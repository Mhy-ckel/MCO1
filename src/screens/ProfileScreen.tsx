import React, { useState } from 'react';
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

const PALETTE = {
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
  success100: '#DCFCE7',
  overlay60: 'rgba(17, 24, 39, 0.60)',
  overlay40: 'rgba(17, 24, 39, 0.40)',
  overlay20: 'rgba(255, 255, 255, 0.18)',
  white: '#FFFFFF',
} as const;

const USER_AVATAR_URI = profileImage;

const PICSUM_BASE = 'https://picsum.photos/seed';
const P = (seed: string, w: number, h: number) => `${PICSUM_BASE}/${seed}/${w}/${h}`;

const mockPosts: Post[] = [
  { id: 'posts-0', imageUrl: P('alps-mountain', 500, 500), likes: 234, comments: 18 },
  { id: 'posts-1', imageUrl: P('city-sunset', 500, 500), likes: 456, comments: 32 },
  { id: 'posts-2', imageUrl: P('ocean-waves', 500, 500), likes: 128, comments: 9 },
  { id: 'posts-3', imageUrl: P('sakura-bloom', 500, 500), likes: 892, comments: 67 },
  { id: 'posts-4', imageUrl: P('ramen-bowl', 500, 500), likes: 341, comments: 24 },
  { id: 'posts-5', imageUrl: P('art-studio', 500, 500), likes: 675, comments: 51 },
];

const mockPhotos: Post[] = [
  { id: 'photos-0', imageUrl: P('portrait-girl', 400, 550), likes: 1200, comments: 88 },
  { id: 'photos-1', imageUrl: P('coffee-shop', 400, 300), likes: 543, comments: 41 },
  { id: 'photos-2', imageUrl: P('forest-road', 400, 600), likes: 2100, comments: 156 },
  { id: 'photos-3', imageUrl: P('desk-setup', 400, 400), likes: 777, comments: 60 },
  { id: 'photos-4', imageUrl: P('street-food', 400, 350), likes: 321, comments: 19 },
  { id: 'photos-5', imageUrl: P('sunset-lake', 400, 500), likes: 980, comments: 72 },
];

const mockVideos: Post[] = [
  {
    id: 'videos-0',
    imageUrl: P('distracted-bf', 500, 500),
    likes: 5600,
    comments: 420,
    memeTop: 'Me when the code runs',
    memeBottom: 'on the first try',
  },
  {
    id: 'videos-1',
    imageUrl: P('doge-laugh', 500, 500),
    likes: 3200,
    comments: 280,
    memeTop: 'Teacher said put your phones away',
    memeBottom: 'Me still texting',
  },
  {
    id: 'videos-2',
    imageUrl: P('computer-cat', 500, 500),
    likes: 1200,
    comments: 90,
    memeTop: 'Bug that only appears',
    memeBottom: 'in production',
  },
];

const settings: SettingItem[] = [
  { id: 's1', glyph: 'bell', label: 'Notifications', value: 'Enabled', hasArrow: true },
  { id: 's2', glyph: 'shield', label: 'Privacy', value: 'Friends only', hasArrow: true },
  { id: 's3', glyph: 'palette', label: 'Appearance', value: 'Light', hasArrow: true },
  { id: 's4', glyph: 'info', label: 'About', value: 'v2.4.0', hasArrow: true },
  { id: 's5', glyph: 'logout', label: 'Log Out', danger: true },
];

const tabMeta: Record<TabKey, { glyph: string; label: string }> = {
  posts: { glyph: 'grid', label: 'Posts' },
  photos: { glyph: 'image', label: 'Photos' },
  videos: { glyph: 'play', label: 'Videos' },
};

const AvatarWithFallback: React.FC<{ size: number; uri: any }> = ({ size, uri }) => {
  const [errored, setErrored] = useState(false);

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      {!errored ? (
        <Image
          source={typeof uri === 'string' ? { uri } : uri}
          style={{ width: size, height: size }}
          resizeMode="cover"
          onError={() => {
            setErrored(true);
          }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: PALETTE.bgMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: size * 0.4 }}>👤</Text>
        </View>
      )}
    </View>
  );
};

const PostCard: React.FC<{ item: Post; size: number; tab: TabKey }> = ({ item, size, tab }) => {
  const [errored, setErrored] = useState(false);

  return (
    <TouchableOpacity
      style={{ width: size, height: size }}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.postCard,
          { backgroundColor: PALETTE.bgMuted, overflow: 'hidden', width: size, height: size },
        ]}
      >
        {!errored ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            onError={() => {
              setErrored(true);
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.postFallback}>
            <Text style={{ fontSize: size * 0.3 }}>🖼️</Text>
          </View>
        )}

        {tab === 'videos' && item.memeTop && (
          <View style={styles.memeTopWrap} pointerEvents="none">
            <Text style={styles.memeText} numberOfLines={2}>
              {item.memeTop}
            </Text>
          </View>
        )}
        {tab === 'videos' && item.memeBottom && (
          <View style={styles.memeBottomWrap} pointerEvents="none">
            <Text style={styles.memeText} numberOfLines={2}>
              {item.memeBottom}
            </Text>
          </View>
        )}

        {tab === 'videos' && (
          <View style={styles.playIcon}>
            <Text style={{ fontSize: 20, color: PALETTE.white }}>▶</Text>
          </View>
        )}
        <View style={styles.postOverlay}>
          <View style={styles.postOverlayRow}>
            <Text style={{ fontSize: 11, color: PALETTE.white }}>❤️</Text>
            <Text style={[styles.postOverlayText, { marginLeft: 4 }]}>
              {item.likes.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [activeSettingId, setActiveSettingId] = useState<string>('s1');
  const [messageText, setMessageText] = useState('');

  const getTabData = (): Post[] => {
    switch (activeTab) {
      case 'posts':
        return mockPosts;
      case 'photos':
        return mockPhotos;
      case 'videos':
        return mockVideos;
    }
  };

  const numColumns = TOKENS.gridCols;
  const spacing = TOKENS.gridGap;
  const contentPadding = TOKENS.contentInset * 2;
  const itemWidth = (width - contentPadding - (numColumns - 1) * spacing) / numColumns;

  const renderPostGrid = () => {
    const data = getTabData();
    const rows: Post[][] = [];
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }
    return rows.map((row, rowIdx) => (
      <View
        key={`row-${rowIdx}`}
        style={[styles.gridRow, { marginBottom: rowIdx === rows.length - 1 ? 0 : spacing }]}
      >
        {row.map((item, colIdx) => (
          <View
            key={item.id}
            style={{
              marginLeft: colIdx === 0 ? 0 : spacing,
            }}
          >
            <PostCard item={item} size={itemWidth} tab={activeTab} />
          </View>
        ))}
      </View>
    ));
  };

  const Tags = () => (
    <View style={styles.tagRow}>
      {['#Student', '#Coffee', '#Coding', '#Gamer'].map((tag, i, arr) => (
        <View
          key={tag}
          style={[
            styles.tagPill,
            i < arr.length - 1 ? { marginRight: TOKENS.spacingSm } : null,
          ]}
        >
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.screenWrap}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navActionBtn}
          onPress={() => console.log('Back pressed')}
        >
          <Text style={styles.navActionIcon}>←</Text>
          <Text style={styles.navActionLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.navActionBtn}
          onPress={() => setShowSettingsScreen(true)}
        >
          <Text style={styles.navActionIcon}>⚙️</Text>
          <Text style={styles.navActionLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverContainer}>
          <View style={styles.coverBg} />
          <View style={styles.coverTexture} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
              <AvatarWithFallback size={108} uri={USER_AVATAR_URI} />
            </View>
            <View style={styles.statusDot} />
          </View>

          <Text style={styles.userName}>John Mhyckel</Text>
          <Text style={styles.userHandle}>@john.mhyckel</Text>

          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <Text style={{ fontSize: 14, color: PALETTE.textTertiary }}>📍</Text>
              <Text style={[styles.locationText, { marginLeft: 6 }]}>
                Philippines · Calbayog City, Samar
              </Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <Text style={{ fontSize: 14, color: PALETTE.textTertiary }}>📅</Text>
              <Text style={[styles.locationText, { marginLeft: 6 }]}>Joined September 2026</Text>
            </View>
          </View>

          <Text style={styles.bio}>
            Lover of coffee · Student at Nwssu
          </Text>

          <Tags />
        </View>

        <View style={styles.statsContainer}>
          {[
            { value: '248', label: 'Posts' },
            { value: '12.4K', label: 'Followers' },
            { value: '892', label: 'Following' },
            { value: '32.6K', label: 'Likes' },
          ].map((s, i, arr) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statNumber}>{s.value}</Text>
              <Text style={[styles.statLabel, { marginTop: 2 }]}>{s.label}</Text>
              {i < arr.length - 1 ? <View style={styles.statDivider} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              isFollowing ? styles.actionBtnOutline : styles.actionBtnPrimary,
              { marginRight: TOKENS.spacingMd },
            ]}
            activeOpacity={0.8}
            onPress={() => setIsFollowing(!isFollowing)}
            accessibilityRole="button"
            accessibilityLabel={isFollowing ? 'Unfollow user' : 'Follow user'}
          >
            <Text style={{ fontSize: 16, color: isFollowing ? PALETTE.brand600 : PALETTE.white }}>
              {isFollowing ? '' : ''}
            </Text>
            <Text
              style={[
                styles.actionBtnText,
                isFollowing ? styles.actionBtnTextOutline : styles.actionBtnTextPrimary,
                { marginLeft: 6 },
              ]}
            >
              {isFollowing ? 'Following' : 'Follow User'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSecondary]}
            activeOpacity={0.8}
            onPress={() => setShowMessageModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Send a direct message"
          >
            <Text style={{ fontSize: 16, color: PALETTE.textPrimary }}></Text>
            <Text
              style={[styles.actionBtnText, styles.actionBtnTextSecondary, { marginLeft: 6 }]}
            >
              Send Message
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          {(['posts', 'photos', 'videos'] as TabKey[]).map((tab) => {
            const meta = tabMeta[tab];
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={{ fontSize: 16, color: active ? PALETTE.brand600 : PALETTE.textTertiary }}>
                  {meta.glyph === 'grid' ? '📊' : meta.glyph === 'image' ? '📷' : meta.glyph === 'play' ? '▶️' : '•'}
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    active ? styles.tabTextActive : null,
                    { marginLeft: 6 },
                  ]}
                >
                  {meta.label}
                </Text>
                {active ? <View style={styles.tabIndicator} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.gridSection}>{renderPostGrid()}</View>

        <Text style={styles.footer}>© 2026 John Mhyckel · v2.4.0</Text>
      </ScrollView>

      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Message</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.messageInputContainer}>
              <Text style={styles.messageLabel}>To: John Mhyckel</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message..."
                placeholderTextColor={PALETTE.textTertiary}
                multiline={true}
                numberOfLines={4}
                value={messageText}
                onChangeText={setMessageText}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.modalSendBtn,
                !messageText.trim() && styles.modalSendBtnDisabled,
              ]}
              onPress={() => {
                if (messageText.trim()) {
                  console.log('Message sent:', messageText);
                  setMessageText('');
                  setShowMessageModal(false);
                }
              }}
              disabled={!messageText.trim()}
            >
              <Text style={[
                styles.modalSendBtnText,
                !messageText.trim() && styles.modalSendBtnTextDisabled,
              ]}>
                Send Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Full-Screen */}
      <Modal
        visible={showSettingsScreen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowSettingsScreen(false)}
      >
        <View style={styles.settingsScreen}>
          {/* Settings Top Bar */}
          <View style={styles.settingsTopBar}>
            <TouchableOpacity
              style={styles.settingsBackBtn}
              onPress={() => setShowSettingsScreen(false)}
            >
              <Text style={styles.settingsBackIcon}>←</Text>
              <Text style={styles.settingsBackLabel}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.settingsTopTitle}>Account Settings</Text>
            <View style={{ width: 72 }} />
          </View>

          {/* Settings Body: sidebar + detail */}
          <View style={styles.settingsBody}>
            {/* Left Sidebar */}
            <View style={styles.settingsSidebar}>
              <Text style={styles.settingsSidebarHeading}>Settings</Text>
              {settings.map((item) => {
                const isActive = activeSettingId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.sidebarItem,
                      isActive && styles.sidebarItemActive,
                      item.danger && styles.sidebarItemDanger,
                    ]}
                    onPress={() => {
                      if (item.label === 'Log Out') {
                        setShowSettingsScreen(false);
                        return;
                      }
                      setActiveSettingId(item.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.sidebarIconWrap,
                        isActive && styles.sidebarIconWrapActive,
                        item.danger && styles.sidebarIconWrapDanger,
                      ]}
                    >
                      <Text style={{ fontSize: 16 }}>
                        {item.glyph === 'bell' ? '🔔'
                          : item.glyph === 'shield' ? '🔒'
                          : item.glyph === 'palette' ? '🎨'
                          : item.glyph === 'info' ? 'ℹ️'
                          : '🚪'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.sidebarLabel,
                        isActive && styles.sidebarLabelActive,
                        item.danger && styles.sidebarLabelDanger,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {isActive && !item.danger && (
                      <View style={styles.sidebarActiveBar} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Right Detail Panel */}
            <View style={styles.settingsDetail}>
              {(() => {
                const active = settings.find((s) => s.id === activeSettingId);
                if (!active) return null;

                const detailRows: { label: string; value: string }[] =
                  active.label === 'Notifications'
                    ? [
                        { label: 'Push Notifications', value: 'Enabled' },
                        { label: 'Email Alerts', value: 'Disabled' },
                        { label: 'In-App Sound', value: 'Enabled' },
                      ]
                    : active.label === 'Privacy'
                    ? [
                        { label: 'Profile Visibility', value: 'Friends only' },
                        { label: 'Message Requests', value: 'Everyone' },
                        { label: 'Activity Status', value: 'Visible' },
                      ]
                    : active.label === 'Appearance'
                    ? [
                        { label: 'Theme', value: 'Light' },
                        { label: 'Font Size', value: 'Medium' },
                        { label: 'Accent Color', value: 'Indigo' },
                      ]
                    : active.label === 'About'
                    ? [
                        { label: 'Version', value: 'v2.4.0' },
                        { label: 'Build', value: '20260922' },
                        { label: 'Developer', value: 'John Mhyckel' },
                      ]
                    : [];

                return (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.detailHeader}>
                      <View style={styles.detailIconWrap}>
                        <Text style={{ fontSize: 28 }}>
                          {active.glyph === 'bell' ? '🔔'
                            : active.glyph === 'shield' ? '🔒'
                            : active.glyph === 'palette' ? '🎨'
                            : active.glyph === 'info' ? 'ℹ️'
                            : '🚪'}
                        </Text>
                      </View>
                      <Text style={styles.detailTitle}>{active.label}</Text>
                      {active.value && (
                        <View style={styles.detailBadge}>
                          <Text style={styles.detailBadgeText}>{active.value}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.detailCard}>
                      {detailRows.map((row, i) => (
                        <View
                          key={row.label}
                          style={[
                            styles.detailRow,
                            i < detailRows.length - 1 && styles.detailRowBorder,
                          ]}
                        >
                          <Text style={styles.detailRowLabel}>{row.label}</Text>
                          <View style={styles.detailRowRight}>
                            <Text style={styles.detailRowValue}>{row.value}</Text>
                            <Text style={styles.detailRowChevron}>›</Text>
                          </View>
                        </View>
                      ))}
                    </View>
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
const styles = StyleSheet.create({
  screenWrap: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: PALETTE.bgCanvas,
  },
  navBar: {
    height: 56,
    backgroundColor: PALETTE.bgSurface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: TOKENS.spacingLg,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.strokeSoft,
    paddingTop: Dimensions.get('window').height > 800 ? 44 : 0,
  },
  navActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TOKENS.spacingXs,
    paddingHorizontal: TOKENS.spacingSm,
    borderRadius: TOKENS.radiusSm,
  },
  navActionIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  navActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.textPrimary,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: PALETTE.bgCanvas,
  },
  scrollContent: {
    paddingBottom: TOKENS.spacing2xl,
    width: '100%',
    alignSelf: 'stretch',
  },
  coverContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  coverBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3F4B8C',
  },
  coverTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: TOKENS.contentInset,
    marginTop: -54,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: TOKENS.spacingLg,
  },
  avatarRing: {
    padding: 5,
    borderRadius: 64,
    backgroundColor: PALETTE.bgSurface,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  statusDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: PALETTE.success500,
    borderWidth: 3,
    borderColor: PALETTE.bgSurface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: PALETTE.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  userHandle: {
    fontSize: 13,
    color: PALETTE.textTertiary,
    marginBottom: TOKENS.spacingMd,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: TOKENS.spacingMd,
    paddingHorizontal: TOKENS.spacingSm,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDivider: {
    width: 1,
    height: 12,
    backgroundColor: PALETTE.stroke,
    marginHorizontal: TOKENS.spacingMd,
  },
  locationText: {
    fontSize: 13,
    color: PALETTE.textTertiary,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    lineHeight: 22,
    color: PALETTE.textSecondary,
    textAlign: 'center',
    marginBottom: TOKENS.spacingLg,
    paddingHorizontal: TOKENS.spacingMd,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: TOKENS.spacingXl,
    paddingHorizontal: TOKENS.spacingSm,
  },
  tagPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: TOKENS.radiusPill,
    backgroundColor: PALETTE.brand50,
    borderWidth: 1,
    borderColor: PALETTE.brand100,
    marginBottom: TOKENS.spacingSm,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.brand600,
  },
  statsContainer: {
    marginHorizontal: TOKENS.contentInset,
    backgroundColor: PALETTE.bgSurface,
    borderRadius: TOKENS.radiusXl,
    paddingVertical: TOKENS.spacingLg,
    paddingHorizontal: TOKENS.spacingSm,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TOKENS.spacingLg,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: PALETTE.textPrimary,
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: 12,
    color: PALETTE.textQuaternary,
    fontWeight: '600',
  },
  statDivider: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: 1,
    height: 34,
    backgroundColor: PALETTE.strokeSoft,
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: TOKENS.contentInset,
    marginBottom: TOKENS.spacingXl,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: TOKENS.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionBtnPrimary: {
    backgroundColor: PALETTE.brand600,
    shadowColor: PALETTE.brand600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  actionBtnOutline: {
    backgroundColor: PALETTE.bgSurface,
    borderWidth: 1,
    borderColor: PALETTE.brand100,
  },
  actionBtnSecondary: {
    backgroundColor: PALETTE.bgSubtle,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  actionBtnTextPrimary: {
    color: PALETTE.white,
  },
  actionBtnTextOutline: {
    color: PALETTE.brand600,
  },
  actionBtnTextSecondary: {
    color: PALETTE.textPrimary,
  },
  tabsContainer: {
    marginHorizontal: TOKENS.contentInset,
    backgroundColor: PALETTE.bgSurface,
    borderRadius: TOKENS.radiusLg,
    padding: TOKENS.spacingXs,
    flexDirection: 'row',
    marginBottom: TOKENS.spacingLg,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TOKENS.radiusMd,
    position: 'relative',
    flexDirection: 'row',
  },
  tabItemActive: {
    backgroundColor: PALETTE.brand50,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.textTertiary,
  },
  tabTextActive: {
    color: PALETTE.brand600,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 20,
    height: 2,
    borderRadius: 2,
    backgroundColor: PALETTE.brand600,
  },
  gridSection: {
    paddingHorizontal: TOKENS.contentInset,
    marginBottom: TOKENS.spacing2xl,
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
  },
  postCard: {
    borderRadius: TOKENS.radiusMd,
    backgroundColor: PALETTE.bgMuted,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
  },
  postImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  postFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.bgMuted,
  },
  postOverlay: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: TOKENS.radiusSm,
    backgroundColor: PALETTE.overlay40,
    zIndex: 3,
  },
  postOverlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postOverlayText: {
    color: PALETTE.white,
    fontSize: 11,
    fontWeight: '700',
  },
  memeTopWrap: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    alignItems: 'center',
    zIndex: 5,
  },
  memeBottomWrap: {
    position: 'absolute',
    bottom: 22,
    left: 6,
    right: 6,
    alignItems: 'center',
    zIndex: 5,
  },
  memeText: {
    color: PALETTE.white,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.overlay60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },


  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: PALETTE.textQuaternary,
    fontWeight: '500',
    paddingHorizontal: TOKENS.contentInset,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: PALETTE.overlay60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: TOKENS.spacingLg,
  },
  modalContent: {
    backgroundColor: PALETTE.bgSurface,
    borderRadius: TOKENS.radiusXl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: TOKENS.spacingLg,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.strokeSoft,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.textPrimary,
  },
  modalClose: {
    fontSize: 24,
    color: PALETTE.textTertiary,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  messageInputContainer: {
    padding: TOKENS.spacingLg,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    marginBottom: TOKENS.spacingSm,
  },
  messageInput: {
    backgroundColor: PALETTE.bgSubtle,
    borderRadius: TOKENS.radiusMd,
    padding: TOKENS.spacingMd,
    minHeight: 120,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
    fontSize: 14,
    color: PALETTE.textPrimary,
    textAlignVertical: 'top',
  },
  modalSendBtn: {
    backgroundColor: PALETTE.brand600,
    margin: TOKENS.spacingLg,
    paddingVertical: TOKENS.spacingMd,
    borderRadius: TOKENS.radiusLg,
    alignItems: 'center',
  },
  modalSendBtnDisabled: {
    backgroundColor: PALETTE.stroke,
  },
  modalSendBtnText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalSendBtnTextDisabled: {
    color: PALETTE.textTertiary,
  },

  // ── Full-screen Settings ──────────────────────────────────────────────
  settingsScreen: {
    flex: 1,
    backgroundColor: PALETTE.bgCanvas,
  },
  settingsTopBar: {
    height: 56,
    backgroundColor: PALETTE.bgSurface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: TOKENS.spacingLg,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.strokeSoft,
    paddingTop: Dimensions.get('window').height > 800 ? 44 : 0,
  },
  settingsBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TOKENS.spacingXs,
    paddingHorizontal: TOKENS.spacingSm,
    borderRadius: TOKENS.radiusSm,
    minWidth: 72,
  },
  settingsBackIcon: {
    fontSize: 18,
    marginRight: 4,
    color: PALETTE.brand600,
  },
  settingsBackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.brand600,
  },
  settingsTopTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.textPrimary,
  },
  settingsBody: {
    flex: 1,
    flexDirection: 'row',
  },
  // Left sidebar
  settingsSidebar: {
    width: 200,
    backgroundColor: PALETTE.bgSurface,
    borderRightWidth: 1,
    borderRightColor: PALETTE.strokeSoft,
    paddingTop: TOKENS.spacingLg,
    paddingBottom: TOKENS.spacingXl,
  },
  settingsSidebarHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.textQuaternary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: TOKENS.spacingLg,
    marginBottom: TOKENS.spacingMd,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: TOKENS.spacingLg,
    marginHorizontal: TOKENS.spacingSm,
    borderRadius: TOKENS.radiusMd,
    marginBottom: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  sidebarItemActive: {
    backgroundColor: PALETTE.brand50,
  },
  sidebarItemDanger: {
    marginTop: TOKENS.spacingMd,
  },
  sidebarIconWrap: {
    width: 32,
    height: 32,
    borderRadius: TOKENS.radiusSm,
    backgroundColor: PALETTE.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: TOKENS.spacingMd,
  },
  sidebarIconWrapActive: {
    backgroundColor: PALETTE.brand100,
  },
  sidebarIconWrapDanger: {
    backgroundColor: PALETTE.danger50,
  },
  sidebarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    flex: 1,
  },
  sidebarLabelActive: {
    color: PALETTE.brand600,
  },
  sidebarLabelDanger: {
    color: PALETTE.danger500,
  },
  sidebarActiveBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: PALETTE.brand600,
  },
  // Right detail panel
  settingsDetail: {
    flex: 1,
    backgroundColor: PALETTE.bgCanvas,
    paddingHorizontal: TOKENS.spacingXl,
    paddingTop: TOKENS.spacingXl,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TOKENS.spacingXl,
  },
  detailIconWrap: {
    width: 48,
    height: 48,
    borderRadius: TOKENS.radiusMd,
    backgroundColor: PALETTE.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: TOKENS.spacingMd,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.textPrimary,
    flex: 1,
    letterSpacing: -0.2,
  },
  detailBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: TOKENS.radiusPill,
    backgroundColor: PALETTE.brand50,
    borderWidth: 1,
    borderColor: PALETTE.brand100,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.brand600,
  },
  detailCard: {
    backgroundColor: PALETTE.bgSurface,
    borderRadius: TOKENS.radiusLg,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
    overflow: 'hidden',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: TOKENS.spacingLg,
    paddingHorizontal: TOKENS.spacingLg,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.strokeSoft,
  },
  detailRowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  detailRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRowValue: {
    fontSize: 13,
    color: PALETTE.textTertiary,
    fontWeight: '500',
    marginRight: TOKENS.spacingSm,
  },
  detailRowChevron: {
    fontSize: 20,
    color: PALETTE.textQuaternary,
    lineHeight: 22,
  },
});

export default ProfileScreen;
