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
  icon: string;
  label: string;
  value?: string;
  danger?: boolean;
}

const GAP   = 12;
const INSET = 20;
const COLS  = 3;
const R     = { sm: 6, md: 10, lg: 14, xl: 18, pill: 999 } as const;

const LIGHT = {
  canvas:       '#F4F5F7',
  surface:      '#FFFFFF',
  subtle:       '#EDEEF0',
  muted:        '#E2E4E8',
  border:       '#E0E2E6',
  text1:        '#1A1D23',
  text2:        '#4A5063',
  text3:        '#808899',
  text4:        '#ADB3C0',
  accent:       '#4A5568',
  accentBorder: '#C8CCDA',
  danger:       '#C0392B',
  success:      '#2E7D52',
  scrim:        'rgba(26,29,35,0.55)',
  white:        '#FFFFFF',
} as const;

const DARK = {
  canvas:       '#161B22',
  surface:      '#1E2530',
  subtle:       '#252D3A',
  muted:        '#2E3848',
  border:       '#303848',
  text1:        '#E8EAF0',
  text2:        '#A8AEBB',
  text3:        '#676E80',
  text4:        '#454D5E',
  accent:       '#8891B0',
  accentBorder: '#3A4258',
  danger:       '#E05C4B',
  success:      '#3D9E6A',
  scrim:        'rgba(0,0,0,0.70)',
  white:        '#FAFAFA',
} as const;

type Palette = typeof LIGHT | typeof DARK;

const makeStyles = (C: Palette) => StyleSheet.create({
  screen:    { flex: 1, backgroundColor: C.canvas },
  navBar: {
    backgroundColor: C.surface, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: INSET, paddingBottom: 12,
    paddingTop: Dimensions.get('window').height > 800 ? 48 : 12,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  navBtn:      { flexDirection: 'row', alignItems: 'center', minWidth: 64 },
  navBtnIcon:  { fontSize: 16, color: C.text2, marginRight: 5 },
  navBtnLabel: { fontSize: 13, fontWeight: '600', color: C.text2 },
  navTitle:    { fontSize: 17, fontWeight: '700', color: C.text1 },
  cover:        { height: 160, backgroundColor: '#2C3452' },
  coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(44,52,82,0.40)' },
  profileSection: { alignItems: 'center', paddingHorizontal: INSET, marginTop: -48 },
  avatarRing: {
    padding: 4, borderRadius: 999, backgroundColor: C.surface,
    marginBottom: GAP,
  },
  onlineDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.success, borderWidth: 2, borderColor: C.surface,
  },
  name:     { fontSize: 22, fontWeight: '800', color: C.text1, marginBottom: 3 },
  handle:   { fontSize: 13, color: C.text3, fontWeight: '500', marginBottom: GAP },
  metaRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: GAP },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: C.border, marginHorizontal: GAP },
  metaText: { fontSize: 12, color: C.text3, marginLeft: 4 },
  bio:      { fontSize: 14, lineHeight: 21, color: C.text2, textAlign: 'center', marginBottom: GAP },
  tagRow:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: GAP * 2 },
  tag: {
    paddingVertical: 5, paddingHorizontal: 11, borderRadius: R.pill,
    backgroundColor: C.subtle, borderWidth: 1, borderColor: C.border,
    marginRight: GAP / 2, marginBottom: GAP / 2,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: C.text2 },
  statsRow: {
    flexDirection: 'row', marginHorizontal: INSET, marginBottom: GAP,
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border, paddingVertical: GAP + 2,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statNum:  { fontSize: 17, fontWeight: '800', color: C.text1 },
  statLbl:  { fontSize: 11, color: C.text3, fontWeight: '600', marginTop: 2 },
  statSep:  { width: 1, backgroundColor: C.border, marginVertical: 4 },
  actionRow: { flexDirection: 'row', marginHorizontal: INSET, marginBottom: GAP * 2 },
  btn:           { flex: 1, height: 44, borderRadius: R.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnPrimary:    { backgroundColor: C.accent },
  btnOutline:    { backgroundColor: C.surface, borderWidth: 1, borderColor: C.accentBorder },
  btnSecondary:  { backgroundColor: C.subtle, marginLeft: GAP },
  btnIcon:           { fontSize: 15, marginRight: 6 },
  btnText:           { fontSize: 14, fontWeight: '700' },
  btnTextPrimary:    { color: C.white },
  btnTextOutline:    { color: C.accent },
  btnTextSecondary:  { color: C.text2 },
  tabBar: {
    flexDirection: 'row', marginHorizontal: INSET, marginBottom: GAP,
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border, padding: 3,
  },
  tab:            { flex: 1, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: R.md },
  tabActive:      { backgroundColor: C.subtle },
  tabIcon:        { fontSize: 14, marginRight: 5 },
  tabLabel:       { fontSize: 13, fontWeight: '600', color: C.text3 },
  tabLabelActive: { color: C.text1 },
  gridWrap: { paddingHorizontal: INSET, marginBottom: GAP * 2 },
  gridRow:  { flexDirection: 'row', marginBottom: GAP },
  // Skeleton cell
  skeleton: { borderRadius: R.md, backgroundColor: C.muted },
  // Post card overlay
  cardLikeBadge: {
    position: 'absolute', left: 6, bottom: 6,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 3, paddingHorizontal: 7,
    borderRadius: R.sm, backgroundColor: 'rgba(0,0,0,0.42)',
  },
  cardLikeIcon: { fontSize: 10, color: '#F0F0F0', marginRight: 3 },
  cardLikeText: { fontSize: 11, fontWeight: '700', color: '#F0F0F0' },
  footer: { textAlign: 'center', fontSize: 11, color: C.text4, paddingBottom: GAP * 2 },
  // Message sheet
  overlay: { flex: 1, backgroundColor: C.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl,
    paddingHorizontal: INSET, paddingBottom: 32, paddingTop: GAP,
  },
  sheetHandle:  { width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: GAP },
  sheetTitle:   { fontSize: 17, fontWeight: '700', color: C.text1, marginBottom: GAP },
  msgLabel:     { fontSize: 13, fontWeight: '600', color: C.text2, marginBottom: GAP / 2 },
  msgInput: {
    backgroundColor: C.subtle, borderRadius: R.lg, padding: GAP,
    minHeight: 110, fontSize: 14, color: C.text1, textAlignVertical: 'top',
    borderWidth: 1, borderColor: C.border,
  },
  sendBtn:             { marginTop: GAP, backgroundColor: C.accent, borderRadius: R.lg, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:     { backgroundColor: C.muted },
  sendBtnIcon:         { fontSize: 14, color: C.white, marginRight: 6 },
  sendBtnText:         { fontSize: 15, fontWeight: '700', color: C.white },
  sendBtnTextDisabled: { color: C.text3 },
  // Settings
  settingsScreen:   { flex: 1, backgroundColor: C.canvas },
  settingsBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.surface, paddingHorizontal: INSET,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border,
    paddingTop: Dimensions.get('window').height > 800 ? 48 : 12,
  },
  settingsBarTitle: { fontSize: 17, fontWeight: '700', color: C.text1 },
  settingsBody:     { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: 188, backgroundColor: C.surface,
    borderRightWidth: 1, borderRightColor: C.border, paddingTop: GAP,
  },
  sidebarLabel: {
    fontSize: 10, fontWeight: '700', color: C.text4,
    letterSpacing: 0.9, textTransform: 'uppercase',
    paddingHorizontal: INSET, marginBottom: GAP / 2, marginTop: GAP / 2,
  },
  sidebarRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: INSET - 4,
    marginHorizontal: GAP / 2, borderRadius: R.md, marginBottom: 2,
  },
  sidebarRowActive:     { backgroundColor: C.subtle },
  sidebarRowIcon:       { fontSize: 15, marginRight: GAP - 2, width: 22, textAlign: 'center' },
  sidebarRowText:       { fontSize: 14, fontWeight: '600', color: C.text2, flex: 1 },
  sidebarRowTextActive: { color: C.text1 },
  sidebarRowTextDanger: { color: C.danger },
  sidebarActivePip:     { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, backgroundColor: C.accent },
  detailPane:  { flex: 1, backgroundColor: C.canvas, padding: INSET },
  detailTitle: { fontSize: 18, fontWeight: '800', color: C.text1, marginBottom: GAP * 2 },
  detailGroup: {
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: GAP,
  },
  detailRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: GAP + 2, paddingHorizontal: INSET - 2, justifyContent: 'space-between' },
  detailRowDivider: { borderTopWidth: 1, borderTopColor: C.border },
  detailRowLabel:   { fontSize: 14, fontWeight: '600', color: C.text1 },
  detailRowValue:   { fontSize: 13, color: C.text3 },
  toggle:        { width: 46, height: 26, borderRadius: 13, backgroundColor: C.muted, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn:      { backgroundColor: C.accent },
  toggleThumb:   { width: 20, height: 20, borderRadius: 10, backgroundColor: C.white },
  toggleThumbOn: { transform: [{ translateX: 20 }] },
});

type AppStyles = ReturnType<typeof makeStyles>;

// ── Skeleton placeholder (no animation — web-safe) ─────────────────────────────
const SkeletonCell: React.FC<{ size: number; C: Palette }> = ({ size, C }) => (
  <View style={{ width: size, height: size, borderRadius: R.md, backgroundColor: C.muted }} />
);

// ── Post card ──────────────────────────────────────────────────────────────────
const PostCard: React.FC<{ item: Post; size: number; tab: TabKey; C: Palette; S: AppStyles }> = ({ item, size, tab, C, S }) => {
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <TouchableOpacity style={{ width: size, height: size }} activeOpacity={0.82}>
      {!loaded && !errored && <SkeletonCell size={size} C={C} />}
      {!errored && (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ position: 'absolute', width: size, height: size, borderRadius: R.md, opacity: loaded ? 1 : 0 }}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <View style={{ width: size, height: size, borderRadius: R.md, backgroundColor: C.muted, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: C.text4 }}>—</Text>
        </View>
      )}
      {loaded && !errored && (
        <>
          {tab === 'videos' && (
            <View style={{ position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', top: size / 2 - 17, left: size / 2 - 17 }}>
              <Text style={{ color: '#F0F0F0', fontSize: 13 }}>▶</Text>
            </View>
          )}
          <View style={S.cardLikeBadge}>
            <Text style={S.cardLikeIcon}>♥</Text>
            <Text style={S.cardLikeText}>{item.likes.toLocaleString()}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

// ── Static data ────────────────────────────────────────────────────────────────
const USER_AVATAR_URI = profileImage;
const Pic = (s: string, w: number, h: number) => `https://picsum.photos/seed/${s}/${w}/${h}`;

const mockPosts: Post[] = [
  { id: 'p0', imageUrl: Pic('alps-mountain', 500, 500), likes: 234, comments: 18 },
  { id: 'p1', imageUrl: Pic('city-sunset',   500, 500), likes: 456, comments: 32 },
  { id: 'p2', imageUrl: Pic('ocean-waves',   500, 500), likes: 128, comments: 9  },
  { id: 'p3', imageUrl: Pic('sakura-bloom',  500, 500), likes: 892, comments: 67 },
  { id: 'p4', imageUrl: Pic('ramen-bowl',    500, 500), likes: 341, comments: 24 },
  { id: 'p5', imageUrl: Pic('art-studio',    500, 500), likes: 675, comments: 51 },
];
const mockPhotos: Post[] = [
  { id: 'ph0', imageUrl: Pic('portrait-girl', 400, 550), likes: 1200, comments: 88  },
  { id: 'ph1', imageUrl: Pic('coffee-shop',   400, 300), likes: 543,  comments: 41  },
  { id: 'ph2', imageUrl: Pic('forest-road',   400, 600), likes: 2100, comments: 156 },
  { id: 'ph3', imageUrl: Pic('desk-setup',    400, 400), likes: 777,  comments: 60  },
  { id: 'ph4', imageUrl: Pic('street-food',   400, 350), likes: 321,  comments: 19  },
  { id: 'ph5', imageUrl: Pic('sunset-lake',   400, 500), likes: 980,  comments: 72  },
];
const mockVideos: Post[] = [
  { id: 'v0', imageUrl: Pic('distracted-bf', 500, 500), likes: 5600, comments: 420, memeTop: 'Me when the code runs',        memeBottom: 'on the first try'  },
  { id: 'v1', imageUrl: Pic('doge-laugh',    500, 500), likes: 3200, comments: 280, memeTop: 'Teacher said put phones away', memeBottom: 'Me still texting'  },
  { id: 'v2', imageUrl: Pic('computer-cat',  500, 500), likes: 1200, comments: 90,  memeTop: 'Bug that only appears',        memeBottom: 'in production'     },
];

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'posts',  icon: '▦', label: 'Posts'  },
  { key: 'photos', icon: '◻', label: 'Photos' },
  { key: 'videos', icon: '▶', label: 'Videos' },
];

const SETTINGS: SettingItem[] = [
  { id: 's1', icon: '◎', label: 'Notifications', value: 'On'      },
  { id: 's2', icon: '◈', label: 'Privacy',       value: 'Friends' },
  { id: 's3', icon: '◑', label: 'Appearance'                      },
  { id: 's4', icon: '○', label: 'About',         value: 'v2.4.0'  },
  { id: 's5', icon: '→', label: 'Log Out',       danger: true     },
];

const DETAIL_ROWS: Record<string, { label: string; value: string }[]> = {
  Notifications: [
    { label: 'Push Notifications', value: 'On'  },
    { label: 'Email Alerts',       value: 'Off' },
    { label: 'In-App Sound',       value: 'On'  },
  ],
  Privacy: [
    { label: 'Profile Visibility', value: 'Friends'  },
    { label: 'Message Requests',   value: 'Everyone' },
    { label: 'Activity Status',    value: 'Visible'  },
  ],
  About: [
    { label: 'Version',   value: 'v2.4.0'       },
    { label: 'Build',     value: '20260922'     },
    { label: 'Developer', value: 'John Mhyckel' },
  ],
};

// ── Screen ─────────────────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const [activeTab,    setActiveTab]    = useState<TabKey>('posts');
  const [following,    setFollowing]    = useState(false);
  const [showMsg,      setShowMsg]      = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSid,    setActiveSid]    = useState('s1');
  const [msgText,      setMsgText]      = useState('');
  const [isDark,       setIsDark]       = useState(false);

  const C = useMemo(() => isDark ? DARK  : LIGHT,       [isDark]);
  const S = useMemo(() => makeStyles(C),                [C]);

  const itemW = (width - INSET * 2 - (COLS - 1) * GAP) / COLS;
  const data  = activeTab === 'posts' ? mockPosts : activeTab === 'photos' ? mockPhotos : mockVideos;

  const renderGrid = () => {
    const rows: Post[][] = [];
    for (let i = 0; i < data.length; i += COLS) rows.push(data.slice(i, i + COLS));
    return rows.map((row, ri) => (
      <View key={ri} style={[S.gridRow, ri === rows.length - 1 && { marginBottom: 0 }]}>
        {row.map((item, ci) => (
          <View key={item.id} style={ci > 0 ? { marginLeft: GAP } : undefined}>
            <PostCard item={item} size={itemW} tab={activeTab} C={C} S={S} />
          </View>
        ))}
      </View>
    ));
  };

  const activeSetting = SETTINGS.find(s => s.id === activeSid);

  return (
    <View style={S.screen}>

      {/* Nav */}
      <View style={S.navBar}>
        <TouchableOpacity style={S.navBtn} onPress={() => {}} accessibilityRole="button">
          <Text style={S.navBtnIcon}>←</Text>
          <Text style={S.navBtnLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={S.navTitle}>Profile</Text>
        <TouchableOpacity style={[S.navBtn, { justifyContent: 'flex-end' }]} onPress={() => setShowSettings(true)} accessibilityRole="button">
          <Text style={S.navBtnIcon}>⚙</Text>
          <Text style={S.navBtnLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: GAP * 3 }} showsVerticalScrollIndicator={false}>

        {/* Cover */}
        <View style={S.cover}>
          <View style={S.coverOverlay} />
        </View>

        {/* Profile header */}
        <View style={S.profileSection}>
          <View style={S.avatarRing}>
            <View style={{ width: 96, height: 96, borderRadius: 48, overflow: 'hidden' }}>
              <Image source={USER_AVATAR_URI} style={{ width: 96, height: 96 }} resizeMode="cover" />
            </View>
            <View style={S.onlineDot} />
          </View>
          <Text style={S.name}>John Mhyckel</Text>
          <Text style={S.handle}>@john.mhyckel</Text>
          <View style={S.metaRow}>
            <View style={S.metaItem}>
              <Text style={{ fontSize: 12, color: C.text3 }}>📍</Text>
              <Text style={S.metaText}>Calbayog City, Samar</Text>
            </View>
            <View style={S.metaDot} />
            <View style={S.metaItem}>
              <Text style={{ fontSize: 12, color: C.text3 }}>📅</Text>
              <Text style={S.metaText}>Joined Sep 2026</Text>
            </View>
          </View>
          <Text style={S.bio}>Coffee lover · Student at Nwssu</Text>
          <View style={S.tagRow}>
            {['Student', 'Coffee', 'Coding', 'Gamer'].map(tag => (
              <View key={tag} style={S.tag}>
                <Text style={S.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={S.statsRow}>
          {[
            { v: '248',   l: 'Posts'     },
            { v: '12.4K', l: 'Followers' },
            { v: '892',   l: 'Following' },
            { v: '32.6K', l: 'Likes'     },
          ].map((s, i, arr) => (
            <React.Fragment key={s.l}>
              <View style={S.statCell}>
                <Text style={S.statNum}>{s.v}</Text>
                <Text style={S.statLbl}>{s.l}</Text>
              </View>
              {i < arr.length - 1 && <View style={S.statSep} />}
            </React.Fragment>
          ))}
        </View>

        {/* Actions */}
        <View style={S.actionRow}>
          <TouchableOpacity
            style={[S.btn, following ? S.btnOutline : S.btnPrimary]}
            onPress={() => setFollowing(!following)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={[S.btnIcon, { color: following ? C.accent : C.white }]}>{following ? '✓' : '+'}</Text>
            <Text style={[S.btnText, following ? S.btnTextOutline : S.btnTextPrimary]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[S.btn, S.btnSecondary]}
            onPress={() => setShowMsg(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={[S.btnIcon, { color: C.text2 }]}>✉</Text>
            <Text style={[S.btnText, S.btnTextSecondary]}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={S.tabBar}>
          {TABS.map(t => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[S.tab, active && S.tabActive]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[S.tabIcon, { color: active ? C.text1 : C.text3 }]}>{t.icon}</Text>
                <Text style={[S.tabLabel, active && S.tabLabelActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Grid */}
        <View style={S.gridWrap}>{renderGrid()}</View>

        <Text style={S.footer}>© 2026 John Mhyckel · v1.1.1</Text>

      </ScrollView>

      {/* Message sheet */}
      <Modal visible={showMsg} animationType="slide" transparent onRequestClose={() => setShowMsg(false)}>
        <View style={S.overlay}>
          <View style={S.sheet}>
            <View style={S.sheetHandle} />
            <Text style={S.sheetTitle}>Message</Text>
            <TextInput
              style={S.msgInput}
              placeholder="Write your message…"
              placeholderTextColor={C.text4}
              multiline
              numberOfLines={4}
              value={msgText}
              onChangeText={setMsgText}
            />
            <TouchableOpacity
              style={[S.sendBtn, !msgText.trim() && S.sendBtnDisabled]}
              onPress={() => { if (msgText.trim()) { setMsgText(''); setShowMsg(false); } }}
              disabled={!msgText.trim()}
              accessibilityRole="button"
            >
              <Text style={S.sendBtnIcon}>✉</Text>
              <Text style={[S.sendBtnText, !msgText.trim() && S.sendBtnTextDisabled]}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings screen */}
      <Modal visible={showSettings} animationType="slide" transparent={false} onRequestClose={() => setShowSettings(false)}>
        <View style={S.settingsScreen}>
          <View style={S.settingsBar}>
            <TouchableOpacity style={S.navBtn} onPress={() => setShowSettings(false)} accessibilityRole="button">
              <Text style={S.navBtnIcon}>←</Text>
              <Text style={S.navBtnLabel}>Back</Text>
            </TouchableOpacity>
            <Text style={S.settingsBarTitle}>Settings</Text>
            <View style={{ width: 64 }} />
          </View>

          <View style={S.settingsBody}>
            {/* Sidebar */}
            <View style={S.sidebar}>
              <Text style={S.sidebarLabel}>Menu</Text>
              {SETTINGS.map(item => {
                const active = activeSid === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[S.sidebarRow, active && S.sidebarRowActive]}
                    onPress={() => {
                      if (item.danger) { setShowSettings(false); return; }
                      setActiveSid(item.id);
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="menuitem"
                  >
                    <Text style={[S.sidebarRowIcon, item.danger && { color: C.danger }]}>{item.icon}</Text>
                    <Text style={[S.sidebarRowText, active && S.sidebarRowTextActive, item.danger && S.sidebarRowTextDanger]}>
                      {item.label}
                    </Text>
                    {active && !item.danger && <View style={S.sidebarActivePip} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Detail pane */}
            <View style={S.detailPane}>
              {activeSetting && !activeSetting.danger && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={S.detailTitle}>{activeSetting.label}</Text>

                  {activeSetting.label === 'Appearance' && (
                    <View style={[S.detailGroup, { marginBottom: GAP }]}>
                      <View style={S.detailRow}>
                        <Text style={S.detailRowLabel}>Dark Mode</Text>
                        <TouchableOpacity
                          style={[S.toggle, isDark && S.toggleOn]}
                          onPress={() => setIsDark(d => !d)}
                          activeOpacity={0.85}
                          accessibilityRole="switch"
                          accessibilityState={{ checked: isDark }}
                        >
                          <View style={[S.toggleThumb, isDark && S.toggleThumbOn]} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {(DETAIL_ROWS[activeSetting.label] ?? []).length > 0 && (
                    <View style={S.detailGroup}>
                      {(DETAIL_ROWS[activeSetting.label] ?? []).map((row, i) => (
                        <View key={row.label} style={[S.detailRow, i > 0 && S.detailRowDivider]}>
                          <Text style={S.detailRowLabel}>{row.label}</Text>
                          <Text style={S.detailRowValue}>{row.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ProfileScreen;
