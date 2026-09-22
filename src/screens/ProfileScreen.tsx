import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import profileImage from '../assets/profile.jpg';

const { width } = Dimensions.get('window');

type TabKey = 'posts' | 'photos' | 'videos';

interface Post {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  memeTop?: string;
  memeBottom?: string;
}

interface SettingItem {
  id: string;
  glyph: string;
  label: string;
  value?: string;
  hasArrow?: boolean;
  danger?: boolean;
}

const TOKENS = {
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 12,
  spacingLg: 16,
  spacingXl: 24,
  spacing2xl: 32,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusPill: 999,
  contentInset: 20,
  gridCols: 3,
  gridGap: 12,
} as const;

const LIGHT = {
  bgCanvas: '#F7F8FA',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F3F5',
  bgMuted: '#E9ECEF',
  stroke: '#E5E7EB',
  strokeSoft: '#EEF0F2',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  textQuaternary: '#9CA3AF',
  brand600: '#4F5B93',
  brand500: '#6366F1',
  brand100: '#EEF0FB',
  brand50: '#F5F6FB',
  danger500: '#DC2626',
  danger50: '#FEF2F2',
  success500: '#16A34A',
  overlay60: 'rgba(17,24,39,0.60)',
  overlay40: 'rgba(17,24,39,0.40)',
  white: '#FFFFFF',
} as const;

const DARK = {
  bgCanvas: '#111827',
  bgSurface: '#1F2937',
  bgSubtle: '#374151',
  bgMuted: '#4B5563',
  stroke: '#374151',
  strokeSoft: '#374151',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textQuaternary: '#6B7280',
  brand600: '#818CF8',
  brand500: '#6366F1',
  brand100: '#3730A3',
  brand50: '#1E1B4B',
  danger500: '#EF4444',
  danger50: '#7F1D1D',
  success500: '#10B981',
  overlay60: 'rgba(0,0,0,0.70)',
  overlay40: 'rgba(0,0,0,0.50)',
  white: '#FFFFFF',
} as const;

type Palette = typeof LIGHT;

const getStyles = (C: Palette) => StyleSheet.create({
  screenWrap: { flex: 1, width: '100%', alignSelf: 'stretch', backgroundColor: C.bgCanvas },
  navBar: {
    height: 56, backgroundColor: C.bgSurface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: TOKENS.spacingLg,
    borderBottomWidth: 1, borderBottomColor: C.strokeSoft,
    paddingTop: Dimensions.get('window').height > 800 ? 44 : 0,
  },
  navActionBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: TOKENS.spacingXs, paddingHorizontal: TOKENS.spacingSm,
    borderRadius: TOKENS.radiusSm,
  },
  navActionIcon: { fontSize: 18, marginRight: 4 },
  navActionLabel: { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  navTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  container: { flex: 1, width: '100%', alignSelf: 'stretch', backgroundColor: C.bgCanvas },
  scrollContent: { paddingBottom: TOKENS.spacing2xl, width: '100%', alignSelf: 'stretch' },
  coverContainer: { height: 180, width: '100%', position: 'relative', overflow: 'hidden' },
  coverBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#3F4B8C' },
  coverTexture: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.6 },
  profileHeader: { alignItems: 'center', paddingHorizontal: TOKENS.contentInset, marginTop: -54 },
  avatarWrapper: { position: 'relative', marginBottom: TOKENS.spacingLg },
  avatarRing: {
    padding: 5, borderRadius: 64, backgroundColor: C.bgSurface,
    shadowColor: '#111827', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 6,
  },
  statusDot: {
    position: 'absolute', bottom: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.success500, borderWidth: 3, borderColor: C.bgSurface,
  },
  userName: { fontSize: 24, fontWeight: '800', color: C.textPrimary, marginBottom: 2, letterSpacing: -0.2 },
  userHandle: { fontSize: 13, color: C.textTertiary, marginBottom: TOKENS.spacingMd, fontWeight: '500' },
  locationRow: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    justifyContent: 'center', marginBottom: TOKENS.spacingMd, paddingHorizontal: TOKENS.spacingSm,
  },
  locationItem: { flexDirection: 'row', alignItems: 'center' },
  locationDivider: { width: 1, height: 12, backgroundColor: C.stroke, marginHorizontal: TOKENS.spacingMd },
  locationText: { fontSize: 13, color: C.textTertiary, fontWeight: '500' },
  bio: {
    fontSize: 14, lineHeight: 22, color: C.textSecondary,
    textAlign: 'center', marginBottom: TOKENS.spacingLg, paddingHorizontal: TOKENS.spacingMd,
  },
  tagRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    marginBottom: TOKENS.spacingXl, paddingHorizontal: TOKENS.spacingSm,
  },
  tagPill: {
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: TOKENS.radiusPill, backgroundColor: C.brand50,
    borderWidth: 1, borderColor: C.brand100, marginBottom: TOKENS.spacingSm,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: C.brand600 },
  statsContainer: {
    marginHorizontal: TOKENS.contentInset, backgroundColor: C.bgSurface,
    borderRadius: TOKENS.radiusXl, paddingVertical: TOKENS.spacingLg,
    paddingHorizontal: TOKENS.spacingSm, flexDirection: 'row', alignItems: 'center',
    marginBottom: TOKENS.spacingLg, borderWidth: 1, borderColor: C.strokeSoft,
  },
  statItem: { flex: 1, alignItems: 'center', position: 'relative' },
  statNumber: { fontSize: 18, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.2 },
  statLabel: { fontSize: 12, color: C.textQuaternary, fontWeight: '600' },
  statDivider: { position: 'absolute', right: 0, top: 6, width: 1, height: 34, backgroundColor: C.strokeSoft },
  actionRow: { flexDirection: 'row', marginHorizontal: TOKENS.contentInset, marginBottom: TOKENS.spacingXl },
  actionBtn: { flex: 1, height: 48, borderRadius: TOKENS.radiusLg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  actionBtnPrimary: {
    backgroundColor: C.brand600,
    shadowColor: C.brand600, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16, shadowRadius: 10, elevation: 3,
  },
  actionBtnOutline: { backgroundColor: C.bgSurface, borderWidth: 1, borderColor: C.brand100 },
  actionBtnSecondary: { backgroundColor: C.bgSubtle },
  actionBtnText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.1 },
  actionBtnTextPrimary: { color: C.white },
  actionBtnTextOutline: { color: C.brand600 },
  actionBtnTextSecondary: { color: C.textPrimary },
  tabsContainer: {
    marginHorizontal: TOKENS.contentInset, backgroundColor: C.bgSurface,
    borderRadius: TOKENS.radiusLg, padding: TOKENS.spacingXs,
    flexDirection: 'row', marginBottom: TOKENS.spacingLg,
    borderWidth: 1, borderColor: C.strokeSoft,
  },
  tabItem: {
    flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center',
    borderRadius: TOKENS.radiusMd, position: 'relative', flexDirection: 'row',
  },
  tabItemActive: { backgroundColor: C.brand50 },
  tabText: { fontSize: 13, fontWeight: '700', color: C.textTertiary },
  tabTextActive: { color: C.brand600 },
  tabIndicator: { position: 'absolute', bottom: 5, width: 20, height: 2, borderRadius: 2, backgroundColor: C.brand600 },
  gridSection: { paddingHorizontal: TOKENS.contentInset, marginBottom: TOKENS.spacing2xl, width: '100%' },
  gridRow: { flexDirection: 'row', width: '100%' },
  postCard: {
    borderRadius: TOKENS.radiusMd, backgroundColor: C.bgMuted,
    position: 'relative', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.strokeSoft,
  },
  postImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  postFallback: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bgMuted },
  postOverlay: {
    position: 'absolute', left: 8, bottom: 8,
    paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: TOKENS.radiusSm, backgroundColor: C.overlay40, zIndex: 3,
  },
  postOverlayRow: { flexDirection: 'row', alignItems: 'center' },
  postOverlayText: { color: C.white, fontSize: 11, fontWeight: '700' },
  memeTopWrap: { position: 'absolute', top: 6, left: 6, right: 6, alignItems: 'center', zIndex: 5 },
  memeBottomWrap: { position: 'absolute', bottom: 22, left: 6, right: 6, alignItems: 'center', zIndex: 5 },
  memeText: {
    color: C.white, fontSize: 10, fontWeight: '900', textAlign: 'center',
    textTransform: 'uppercase', letterSpacing: 0.3,
    textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0.5,
  },
  playIcon: {
    position: 'absolute', top: '50%', left: '50%',
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.overlay60,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: -20, marginTop: -20, zIndex: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  footer: { textAlign: 'center', fontSize: 12, color: C.textQuaternary, fontWeight: '500', paddingHorizontal: TOKENS.contentInset },
  // Message modal
  modalOverlay: { flex: 1, backgroundColor: C.overlay60, justifyContent: 'center', alignItems: 'center', padding: TOKENS.spacingLg },
  modalContent: { backgroundColor: C.bgSurface, borderRadius: TOKENS.radiusXl, width: '100%', maxWidth: 400, maxHeight: '80%', overflow: 'hidden' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: TOKENS.spacingLg, borderBottomWidth: 1, borderBottomColor: C.strokeSoft,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  modalClose: { fontSize: 24, color: C.textTertiary, width: 32, height: 32, textAlign: 'center', lineHeight: 32 },
  messageInputContainer: { padding: TOKENS.spacingLg },
  messageLabel: { fontSize: 14, fontWeight: '600', color: C.textSecondary, marginBottom: TOKENS.spacingSm },
  messageInput: {
    backgroundColor: C.bgSubtle, borderRadius: TOKENS.radiusMd, padding: TOKENS.spacingMd,
    minHeight: 120, borderWidth: 1, borderColor: C.strokeSoft,
    fontSize: 14, color: C.textPrimary, textAlignVertical: 'top',
  },
  modalSendBtn: { backgroundColor: C.brand600, margin: TOKENS.spacingLg, paddingVertical: TOKENS.spacingMd, borderRadius: TOKENS.radiusLg, alignItems: 'center' },
  modalSendBtnDisabled: { backgroundColor: C.stroke },
  modalSendBtnText: { color: C.white, fontSize: 16, fontWeight: '700' },
  modalSendBtnTextDisabled: { color: C.textTertiary },
  // Settings screen
  settingsScreen: { flex: 1, backgroundColor: C.bgCanvas },
  settingsTopBar: {
    height: 56, backgroundColor: C.bgSurface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: TOKENS.spacingLg, borderBottomWidth: 1, borderBottomColor: C.strokeSoft,
    paddingTop: Dimensions.get('window').height > 800 ? 44 : 0,
  },
  settingsBackBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: TOKENS.spacingXs, paddingHorizontal: TOKENS.spacingSm,
    borderRadius: TOKENS.radiusSm, minWidth: 72,
  },
  settingsBackIcon: { fontSize: 18, marginRight: 4, color: C.brand600 },
  settingsBackLabel: { fontSize: 14, fontWeight: '600', color: C.brand600 },
  settingsTopTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  settingsBody: { flex: 1, flexDirection: 'row' },
  settingsSidebar: {
    width: 200, backgroundColor: C.bgSurface,
    borderRightWidth: 1, borderRightColor: C.strokeSoft,
    paddingTop: TOKENS.spacingLg, paddingBottom: TOKENS.spacingXl,
  },
  settingsSidebarHeading: {
    fontSize: 11, fontWeight: '700', color: C.textQuaternary,
    letterSpacing: 0.8, textTransform: 'uppercase',
    paddingHorizontal: TOKENS.spacingLg, marginBottom: TOKENS.spacingMd,
  },
  sidebarItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: TOKENS.spacingLg,
    marginHorizontal: TOKENS.spacingSm, borderRadius: TOKENS.radiusMd,
    marginBottom: 2, position: 'relative', overflow: 'hidden',
  },
  sidebarItemActive: { backgroundColor: C.brand50 },
  sidebarItemDanger: { marginTop: TOKENS.spacingMd },
  sidebarIconWrap: {
    width: 32, height: 32, borderRadius: TOKENS.radiusSm, backgroundColor: C.bgSubtle,
    alignItems: 'center', justifyContent: 'center', marginRight: TOKENS.spacingMd,
  },
  sidebarIconWrapActive: { backgroundColor: C.brand100 },
  sidebarIconWrapDanger: { backgroundColor: C.danger50 },
  sidebarLabel: { fontSize: 14, fontWeight: '600', color: C.textSecondary, flex: 1 },
  sidebarLabelActive: { color: C.brand600 },
  sidebarLabelDanger: { color: C.danger500 },
  sidebarActiveBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, backgroundColor: C.brand600 },
  settingsDetail: { flex: 1, backgroundColor: C.bgCanvas, paddingHorizontal: TOKENS.spacingXl, paddingTop: TOKENS.spacingXl },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: TOKENS.spacingXl },
  detailIconWrap: {
    width: 48, height: 48, borderRadius: TOKENS.radiusMd, backgroundColor: C.bgSurface,
    alignItems: 'center', justifyContent: 'center', marginRight: TOKENS.spacingMd,
    borderWidth: 1, borderColor: C.strokeSoft,
    shadowColor: '#111827', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  detailTitle: { fontSize: 20, fontWeight: '800', color: C.textPrimary, flex: 1, letterSpacing: -0.2 },
  detailBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: TOKENS.radiusPill, backgroundColor: C.brand50, borderWidth: 1, borderColor: C.brand100 },
  detailBadgeText: { fontSize: 12, fontWeight: '700', color: C.brand600 },
  detailCard: {
    backgroundColor: C.bgSurface, borderRadius: TOKENS.radiusLg,
    borderWidth: 1, borderColor: C.strokeSoft, overflow: 'hidden',
    shadowColor: '#111827', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: TOKENS.spacingLg, paddingHorizontal: TOKENS.spacingLg,
  },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: C.strokeSoft },
  detailRowLabel: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
  detailRowRight: { flexDirection: 'row', alignItems: 'center' },
  detailRowValue: { fontSize: 13, color: C.textTertiary, fontWeight: '500', marginRight: TOKENS.spacingSm },
  detailRowChevron: { fontSize: 20, color: C.textQuaternary, lineHeight: 22 },
  // Theme toggle switch
  toggleTrack: {
    width: 48, height: 28, borderRadius: 14,
    backgroundColor: C.stroke,
    justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleTrackOn: { backgroundColor: C.brand600 },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: C.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  toggleThumbOn: { transform: [{ translateX: 20 }] },
});

type AppStyles = ReturnType<typeof getStyles>;

// ── Sub-components ─────────────────────────────────────────────────────────────
const AvatarWithFallback: React.FC<{ size: number; uri: any; C: Palette }> = ({ size, uri, C }) => {
  const [errored, setErrored] = useState(false);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      {!errored ? (
        <Image source={typeof uri === 'string' ? { uri } : uri} style={{ width: size, height: size }} resizeMode="cover" onError={() => setErrored(true)} />
      ) : (
        <View style={{ width: size, height: size, backgroundColor: C.bgMuted, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.4 }}>👤</Text>
        </View>
      )}
    </View>
  );
};

const PostCard: React.FC<{ item: Post; size: number; tab: TabKey; C: Palette; S: AppStyles }> = ({ item, size, tab, C, S }) => {
  const [errored, setErrored] = useState(false);
  return (
    <TouchableOpacity style={{ width: size, height: size }} activeOpacity={0.85}>
      <View style={[S.postCard, { overflow: 'hidden', width: size, height: size }]}>
        {!errored ? (
          <Image source={{ uri: item.imageUrl }} style={S.postImage} onError={() => setErrored(true)} resizeMode="cover" />
        ) : (
          <View style={S.postFallback}><Text style={{ fontSize: size * 0.3 }}>🖼️</Text></View>
        )}
        {tab === 'videos' && item.memeTop && <View style={S.memeTopWrap} pointerEvents="none"><Text style={S.memeText} numberOfLines={2}>{item.memeTop}</Text></View>}
        {tab === 'videos' && item.memeBottom && <View style={S.memeBottomWrap} pointerEvents="none"><Text style={S.memeText} numberOfLines={2}>{item.memeBottom}</Text></View>}
        {tab === 'videos' && <View style={S.playIcon}><Text style={{ fontSize: 20, color: C.white }}>▶</Text></View>}
        <View style={S.postOverlay}>
          <View style={S.postOverlayRow}>
            <Text style={{ fontSize: 11, color: C.white }}>❤️</Text>
            <Text style={[S.postOverlayText, { marginLeft: 4 }]}>{item.likes.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ── Static data ────────────────────────────────────────────────────────────────
const USER_AVATAR_URI = profileImage;
const PICSUM_BASE = 'https://picsum.photos/seed';
const Pic = (seed: string, w: number, h: number) => `${PICSUM_BASE}/${seed}/${w}/${h}`;

const mockPosts: Post[] = [
  { id: 'p0', imageUrl: Pic('alps-mountain', 500, 500), likes: 234, comments: 18 },
  { id: 'p1', imageUrl: Pic('city-sunset', 500, 500), likes: 456, comments: 32 },
  { id: 'p2', imageUrl: Pic('ocean-waves', 500, 500), likes: 128, comments: 9 },
  { id: 'p3', imageUrl: Pic('sakura-bloom', 500, 500), likes: 892, comments: 67 },
  { id: 'p4', imageUrl: Pic('ramen-bowl', 500, 500), likes: 341, comments: 24 },
  { id: 'p5', imageUrl: Pic('art-studio', 500, 500), likes: 675, comments: 51 },
];
const mockPhotos: Post[] = [
  { id: 'ph0', imageUrl: Pic('portrait-girl', 400, 550), likes: 1200, comments: 88 },
  { id: 'ph1', imageUrl: Pic('coffee-shop', 400, 300), likes: 543, comments: 41 },
  { id: 'ph2', imageUrl: Pic('forest-road', 400, 600), likes: 2100, comments: 156 },
  { id: 'ph3', imageUrl: Pic('desk-setup', 400, 400), likes: 777, comments: 60 },
  { id: 'ph4', imageUrl: Pic('street-food', 400, 350), likes: 321, comments: 19 },
  { id: 'ph5', imageUrl: Pic('sunset-lake', 400, 500), likes: 980, comments: 72 },
];
const mockVideos: Post[] = [
  { id: 'v0', imageUrl: Pic('distracted-bf', 500, 500), likes: 5600, comments: 420, memeTop: 'Me when the code runs', memeBottom: 'on the first try' },
  { id: 'v1', imageUrl: Pic('doge-laugh', 500, 500), likes: 3200, comments: 280, memeTop: 'Teacher said put your phones away', memeBottom: 'Me still texting' },
  { id: 'v2', imageUrl: Pic('computer-cat', 500, 500), likes: 1200, comments: 90, memeTop: 'Bug that only appears', memeBottom: 'in production' },
];

const tabMeta: Record<TabKey, { glyph: string; label: string }> = {
  posts:  { glyph: 'grid',  label: 'Posts' },
  photos: { glyph: 'image', label: 'Photos' },
  videos: { glyph: 'play',  label: 'Videos' },
};

const glyphEmoji = (g: string) =>
  g === 'bell' ? '🔔' : g === 'shield' ? '🔒' : g === 'palette' ? '🎨' : g === 'info' ? 'ℹ️' : '🚪';

// ── Screen ─────────────────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab]               = useState<TabKey>('posts');
  const [isFollowing, setIsFollowing]           = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSettings, setShowSettings]         = useState(false);
  const [activeSettingId, setActiveSettingId]   = useState('s1');
  const [messageText, setMessageText]           = useState('');
  const [isDark, setIsDark]                     = useState(false);

  const C = useMemo(() => isDark ? DARK : LIGHT, [isDark]);
  const S = useMemo(() => getStyles(C), [C]);

  const settings: SettingItem[] = useMemo(() => [
    { id: 's1', glyph: 'bell',    label: 'Notifications', value: 'Enabled',      hasArrow: true },
    { id: 's2', glyph: 'shield',  label: 'Privacy',       value: 'Friends only', hasArrow: true },
    { id: 's3', glyph: 'palette', label: 'Appearance',    value: isDark ? 'Dark' : 'Light', hasArrow: true },
    { id: 's4', glyph: 'info',    label: 'About',         value: 'v2.4.0',       hasArrow: true },
    { id: 's5', glyph: 'logout',  label: 'Log Out',       danger: true },
  ], [isDark]);

  const numColumns   = TOKENS.gridCols;
  const spacing      = TOKENS.gridGap;
  const itemWidth    = (width - TOKENS.contentInset * 2 - (numColumns - 1) * spacing) / numColumns;

  const getTabData = () => activeTab === 'posts' ? mockPosts : activeTab === 'photos' ? mockPhotos : mockVideos;

  const renderGrid = () => {
    const data = getTabData();
    const rows: Post[][] = [];
    for (let i = 0; i < data.length; i += numColumns) rows.push(data.slice(i, i + numColumns));
    return rows.map((row, ri) => (
      <View key={ri} style={[S.gridRow, { marginBottom: ri < rows.length - 1 ? spacing : 0 }]}>
        {row.map((item, ci) => (
          <View key={item.id} style={{ marginLeft: ci === 0 ? 0 : spacing }}>
            <PostCard item={item} size={itemWidth} tab={activeTab} C={C} S={S} />
          </View>
        ))}
      </View>
    ));
  };

  // Detail panel rows per section
  const detailRowsFor = (label: string) =>
    label === 'Notifications' ? [{ label: 'Push Notifications', value: 'Enabled' }, { label: 'Email Alerts', value: 'Disabled' }, { label: 'In-App Sound', value: 'Enabled' }]
    : label === 'Privacy'     ? [{ label: 'Profile Visibility', value: 'Friends only' }, { label: 'Message Requests', value: 'Everyone' }, { label: 'Activity Status', value: 'Visible' }]
    : label === 'About'       ? [{ label: 'Version', value: 'v1.1.1' }, { label: 'Build', value: '20260922' }, { label: 'Developer', value: 'John Mhyckel' }]
    : [];

  return (
    <View style={S.screenWrap}>
      {/* Nav */}
      <View style={S.navBar}>
        <TouchableOpacity style={S.navActionBtn} onPress={() => {}}>
          <Text style={S.navActionIcon}>←</Text>
          <Text style={S.navActionLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={S.navTitle}>Profile</Text>
        <TouchableOpacity style={S.navActionBtn} onPress={() => setShowSettings(true)}>
          <Text style={S.navActionIcon}>⚙️</Text>
          <Text style={S.navActionLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={S.container} contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={S.coverContainer}>
          <View style={S.coverBg} />
          <View style={S.coverTexture} />
        </View>

        <View style={S.profileHeader}>
          <View style={S.avatarWrapper}>
            <View style={S.avatarRing}>
              <AvatarWithFallback size={108} uri={USER_AVATAR_URI} C={C} />
            </View>
            <View style={S.statusDot} />
          </View>
          <Text style={S.userName}>John Mhyckel</Text>
          <Text style={S.userHandle}>@john.mhyckel</Text>
          <View style={S.locationRow}>
            <View style={S.locationItem}>
              <Text style={{ fontSize: 14, color: C.textTertiary }}>📍</Text>
              <Text style={[S.locationText, { marginLeft: 6 }]}>Philippines · Calbayog City, Samar</Text>
            </View>
            <View style={S.locationDivider} />
            <View style={S.locationItem}>
              <Text style={{ fontSize: 14, color: C.textTertiary }}>📅</Text>
              <Text style={[S.locationText, { marginLeft: 6 }]}>Joined Sep 2026</Text>
            </View>
          </View>
          <Text style={S.bio}>Lover of coffee · Student at Nwssu</Text>
          <View style={S.tagRow}>
            {['#Student', '#Coffee', '#Coding', '#Gamer'].map((tag, i, arr) => (
              <View key={tag} style={[S.tagPill, i < arr.length - 1 && { marginRight: TOKENS.spacingSm }]}>
                <Text style={S.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={S.statsContainer}>
          {[{ value: '248', label: 'Posts' }, { value: '12.4K', label: 'Followers' }, { value: '892', label: 'Following' }, { value: '32.6K', label: 'Likes' }].map((s, i, arr) => (
            <View key={s.label} style={S.statItem}>
              <Text style={S.statNumber}>{s.value}</Text>
              <Text style={[S.statLabel, { marginTop: 2 }]}>{s.label}</Text>
              {i < arr.length - 1 && <View style={S.statDivider} />}
            </View>
          ))}
        </View>

        <View style={S.actionRow}>
          <TouchableOpacity
            style={[S.actionBtn, isFollowing ? S.actionBtnOutline : S.actionBtnPrimary, { marginRight: TOKENS.spacingMd }]}
            activeOpacity={0.8} onPress={() => setIsFollowing(!isFollowing)}
            accessibilityRole="button" accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow'}
          >
            <Text style={[S.actionBtnText, isFollowing ? S.actionBtnTextOutline : S.actionBtnTextPrimary]}>
              {isFollowing ? 'Following' : 'Follow User'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.actionBtn, S.actionBtnSecondary]} activeOpacity={0.8} onPress={() => setShowMessageModal(true)} accessibilityRole="button">
            <Text style={[S.actionBtnText, S.actionBtnTextSecondary]}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <View style={S.tabsContainer}>
          {(['posts', 'photos', 'videos'] as TabKey[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity key={tab} style={[S.tabItem, active && S.tabItemActive]} onPress={() => setActiveTab(tab)} activeOpacity={0.7} accessibilityRole="tab">
                <Text style={{ fontSize: 16, color: active ? C.brand600 : C.textTertiary }}>
                  {tab === 'posts' ? '📊' : tab === 'photos' ? '📷' : '▶️'}
                </Text>
                <Text style={[S.tabText, active && S.tabTextActive, { marginLeft: 6 }]}>{tabMeta[tab].label}</Text>
                {active && <View style={S.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={S.gridSection}>{renderGrid()}</View>
        <Text style={S.footer}>© 2026 John Mhyckel · v2.4.0</Text>
      </ScrollView>

      {/* Message Modal */}
      <Modal visible={showMessageModal} animationType="slide" transparent onRequestClose={() => setShowMessageModal(false)}>
        <View style={S.modalOverlay}>
          <View style={S.modalContent}>
            <View style={S.modalHeader}>
              <Text style={S.modalTitle}>Send Message</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}><Text style={S.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <View style={S.messageInputContainer}>
              <Text style={S.messageLabel}>To: John Mhyckel</Text>
              <TextInput
                style={S.messageInput} placeholder="Type your message..." placeholderTextColor={C.textTertiary}
                multiline numberOfLines={4} value={messageText} onChangeText={setMessageText}
              />
            </View>
            <TouchableOpacity
              style={[S.modalSendBtn, !messageText.trim() && S.modalSendBtnDisabled]}
              onPress={() => { if (messageText.trim()) { setMessageText(''); setShowMessageModal(false); } }}
              disabled={!messageText.trim()}
            >
              <Text style={[S.modalSendBtnText, !messageText.trim() && S.modalSendBtnTextDisabled]}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Screen */}
      <Modal visible={showSettings} animationType="slide" transparent={false} onRequestClose={() => setShowSettings(false)}>
        <View style={S.settingsScreen}>
          <View style={S.settingsTopBar}>
            <TouchableOpacity style={S.settingsBackBtn} onPress={() => setShowSettings(false)}>
              <Text style={S.settingsBackIcon}>←</Text>
              <Text style={S.settingsBackLabel}>Back</Text>
            </TouchableOpacity>
            <Text style={S.settingsTopTitle}>Account Settings</Text>
            <View style={{ width: 72 }} />
          </View>

          <View style={S.settingsBody}>
            {/* Sidebar */}
            <View style={S.settingsSidebar}>
              <Text style={S.settingsSidebarHeading}>Settings</Text>
              {settings.map((item) => {
                const isActive = activeSettingId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[S.sidebarItem, isActive && S.sidebarItemActive, item.danger && S.sidebarItemDanger]}
                    onPress={() => { if (item.danger) { setShowSettings(false); return; } setActiveSettingId(item.id); }}
                    activeOpacity={0.7}
                  >
                    <View style={[S.sidebarIconWrap, isActive && S.sidebarIconWrapActive, item.danger && S.sidebarIconWrapDanger]}>
                      <Text style={{ fontSize: 16 }}>{glyphEmoji(item.glyph)}</Text>
                    </View>
                    <Text style={[S.sidebarLabel, isActive && S.sidebarLabelActive, item.danger && S.sidebarLabelDanger]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    {isActive && !item.danger && <View style={S.sidebarActiveBar} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Detail panel */}
            <View style={S.settingsDetail}>
              {(() => {
                const active = settings.find((s) => s.id === activeSettingId);
                if (!active) return null;
                const rows = detailRowsFor(active.label);

                return (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={S.detailHeader}>
                      <View style={S.detailIconWrap}>
                        <Text style={{ fontSize: 28 }}>{glyphEmoji(active.glyph)}</Text>
                      </View>
                      <Text style={S.detailTitle}>{active.label}</Text>
                      <View style={S.detailBadge}>
                        <Text style={S.detailBadgeText}>{isDark ? 'Dark' : 'Light'}</Text>
                      </View>
                    </View>

                    {/* Appearance: Dark Mode toggle */}
                    {active.label === 'Appearance' && (
                      <View style={[S.detailCard, { marginBottom: TOKENS.spacingMd }]}>
                        <View style={S.detailRow}>
                          <Text style={S.detailRowLabel}>Dark Mode</Text>
                          <TouchableOpacity
                            style={[S.toggleTrack, isDark && S.toggleTrackOn]}
                            onPress={() => setIsDark(!isDark)}
                            activeOpacity={0.8}
                            accessibilityRole="switch"
                            accessibilityState={{ checked: isDark }}
                          >
                            <View style={[S.toggleThumb, isDark && S.toggleThumbOn]} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Other rows */}
                    {rows.length > 0 && (
                      <View style={S.detailCard}>
                        {rows.map((row, i) => (
                          <View key={row.label} style={[S.detailRow, i < rows.length - 1 && S.detailRowBorder]}>
                            <Text style={S.detailRowLabel}>{row.label}</Text>
                            <View style={S.detailRowRight}>
                              <Text style={S.detailRowValue}>{row.value}</Text>
                              <Text style={S.detailRowChevron}>›</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </ScrollView>
                );
              })()}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
