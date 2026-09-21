import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

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
  skeletonBase: '#EEF0F3',
  skeletonHigh: '#F7F8FA',
  overlay60: 'rgba(17, 24, 39, 0.60)',
  overlay40: 'rgba(17, 24, 39, 0.40)',
  overlay20: 'rgba(255, 255, 255, 0.18)',
  white: '#FFFFFF',
} as const;

const USER_AVATAR_URI =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20a%20young%20filipino%20teenage%20boy%20with%20short%20black%20hair%20with%20braces%20smiling%20wearing%20a%20light%20pink%20shirt%20holding%20a%20black%20camera%20outdoor%20palm%20trees%20sunny%20day%20green%20grass%20clear%20blue%20sky%20natural%20lighting&image_size=square_hd';

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
  { id: 's3', glyph: 'card', label: 'Payment Methods', value: '•••• 4242', hasArrow: true },
  { id: 's4', glyph: 'palette', label: 'Appearance', value: 'Light', hasArrow: true },
  { id: 's5', glyph: 'info', label: 'About', value: 'v2.4.0', hasArrow: true },
  { id: 's6', glyph: 'logout', label: 'Log Out', danger: true },
];

const tabMeta: Record<TabKey, { glyph: string; label: string }> = {
  posts: { glyph: 'grid', label: 'Posts' },
  photos: { glyph: 'image', label: 'Photos' },
  videos: { glyph: 'play', label: 'Videos' },
};

const Glyph: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 16,
  color = PALETTE.textTertiary,
}) => {
  const commonSvgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'bell':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
              ),
          }}
        />
      );
    case 'shield':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
              ),
          }}
        />
      );
    case 'card':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`
              ),
          }}
        />
      );
    case 'palette':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-1 1.5-2 0-.5 0-1-.5-1.5-.5-.5-.5-1 0-2 .5-.5 1-1 1.5-1h2c3 0 5-2.5 5-5.5C21.5 6.5 17.5 2 12 2z"/></svg>`
              ),
          }}
        />
      );
    case 'info':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
              ),
          }}
        />
      );
    case 'logout':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
              ),
          }}
        />
      );
    case 'grid':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
              ),
          }}
        />
      );
    case 'image':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
              ),
          }}
        />
      );
    case 'play':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>`
              ),
          }}
        />
      );
    case 'settings':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
              ),
          }}
        />
      );
    case 'share':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
              ),
          }}
        />
      );
    case 'pin':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
              ),
          }}
        />
      );
    case 'calendar':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
              ),
          }}
        />
      );
    case 'heart':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" fill="${color}"/></svg>`
              ),
          }}
        />
      );
    case 'chevronRight':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
              ),
          }}
        />
      );
    case 'playFill':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="7 4 21 12 7 20 7 4" fill="${color}"/></svg>`
              ),
          }}
        />
      );
    case 'userPlus':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`
              ),
          }}
        />
      );
    case 'userCheck':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`
              ),
          }}
        />
      );
    case 'message':
      return (
        <Image
          style={{ width: size, height: size, tintColor: color }}
          source={{
            uri:
              'data:image/svg+xml;utf8,' +
              encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
              ),
          }}
        />
      );
    default:
      return null;
  }
};

const Skeleton: React.FC<{
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}> = ({ width = '100%', height = 16, borderRadius = TOKENS.radiusSm }) => {
  const [xAnim] = useState(() => new Animated.Value(-100));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(xAnim, {
        toValue: 100,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [xAnim]);

  return (
    <View
      style={[
        styles.skeletonWrap,
        { width, height, borderRadius, overflow: 'hidden' },
      ]}
    >
      <View style={StyleSheet.absoluteFill} />
      <Animated.View
        style={[
          styles.skeletonShine,
          {
            transform: [{ translateX: xAnim }],
            width: '80%',
            height: '100%',
          },
        ]}
      />
    </View>
  );
};

const AvatarWithFallback: React.FC<{ size: number; uri: string }> = ({ size, uri }) => {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            zIndex: 2,
          }}
        >
          <Skeleton width={size} height={size} borderRadius={size / 2} />
        </View>
      )}
      {!errored ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setErrored(true);
            setLoading(false);
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
          <Glyph name="userPlus" size={size * 0.35} color={PALETTE.textTertiary} />
        </View>
      )}
    </View>
  );
};

const PostCard: React.FC<{ item: Post; size: number; tab: TabKey }> = ({ item, size, tab }) => {
  const [loading, setLoading] = useState(true);
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
        {loading && (
          <View style={StyleSheet.absoluteFill}>
            <Skeleton width={size} height={size} borderRadius={TOKENS.radiusMd} />
          </View>
        )}
        {!errored ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            onError={() => {
              setErrored(true);
              setLoading(false);
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.postFallback}>
            <Glyph name="image" size={size * 0.24} color={PALETTE.textQuaternary} />
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
            <Glyph name="playFill" size={20} color={PALETTE.white} />
          </View>
        )}
        <View style={styles.postOverlay}>
          <View style={styles.postOverlayRow}>
            <Glyph name="heart" size={11} color={PALETTE.white} />
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverContainer}>
          <View style={styles.coverBg} />
          <View style={styles.coverTexture} />
          <View style={styles.coverActions}>
            <TouchableOpacity
              style={styles.coverActionBtn}
              activeOpacity={0.7}
              accessibilityLabel="Open profile settings"
            >
              <Glyph name="settings" size={18} color={PALETTE.white} />
              <Text style={[styles.coverActionLabel, { marginLeft: 6 }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.coverActionBtn}
              activeOpacity={0.7}
              accessibilityLabel="Share profile"
            >
              <Glyph name="share" size={18} color={PALETTE.white} />
              <Text style={[styles.coverActionLabel, { marginLeft: 6 }]}>Share</Text>
            </TouchableOpacity>
          </View>
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
              <Glyph name="pin" size={14} color={PALETTE.textTertiary} />
              <Text style={[styles.locationText, { marginLeft: 6 }]}>
                Philippines · Calbayog City, Samar
              </Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <Glyph name="calendar" size={14} color={PALETTE.textTertiary} />
              <Text style={[styles.locationText, { marginLeft: 6 }]}>Joined Sep 2026</Text>
            </View>
          </View>

          <Text style={styles.bio}>
            Lover of coffee · Student at NWSSU · Building small things that matter one line at a time.
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
            <Glyph
              name={isFollowing ? 'userCheck' : 'userPlus'}
              size={16}
              color={isFollowing ? PALETTE.brand600 : PALETTE.white}
            />
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
            accessibilityRole="button"
            accessibilityLabel="Send a direct message"
          >
            <Glyph name="message" size={16} color={PALETTE.textPrimary} />
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
                <Glyph
                  name={meta.glyph}
                  size={15}
                  color={active ? PALETTE.brand600 : PALETTE.textTertiary}
                />
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

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account settings</Text>
          {settings.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.settingRow,
                idx === settings.length - 1 ? styles.settingRowLast : styles.settingRowBorder,
              ]}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}${item.value ? ', ' + item.value : ''}`}
            >
              <View
                style={[
                  styles.settingIconWrap,
                  item.danger && styles.settingIconWrapDanger,
                ]}
              >
                <Glyph
                  name={item.glyph}
                  size={16}
                  color={item.danger ? PALETTE.danger500 : PALETTE.brand600}
                />
              </View>
              <Text
                style={[
                  styles.settingLabel,
                  item.danger && styles.settingLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              <View style={styles.settingRight}>
                {item.value ? (
                  <Text
                    style={[styles.settingValue, { marginRight: TOKENS.spacingSm }]}
                    numberOfLines={1}
                  >
                    {item.value}
                  </Text>
                ) : null}
                {item.hasArrow ? (
                  <Glyph name="chevronRight" size={16} color={PALETTE.textQuaternary} />
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>© 2026 John Mhyckel · v2.4.0</Text>
      </ScrollView>
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
  coverActions: {
    position: 'absolute',
    top: TOKENS.spacingLg,
    left: TOKENS.spacingLg,
    right: TOKENS.spacingLg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: TOKENS.radiusPill,
    backgroundColor: PALETTE.overlay20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverActionLabel: {
    color: PALETTE.white,
    fontSize: 12,
    fontWeight: '600',
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
  settingsSection: {
    marginHorizontal: TOKENS.contentInset,
    backgroundColor: PALETTE.bgSurface,
    borderRadius: TOKENS.radiusXl,
    paddingHorizontal: TOKENS.spacingLg,
    paddingTop: TOKENS.spacingLg,
    paddingBottom: 6,
    marginBottom: TOKENS.spacing2xl,
    borderWidth: 1,
    borderColor: PALETTE.strokeSoft,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: PALETTE.textPrimary,
    marginBottom: TOKENS.spacingSm,
    paddingHorizontal: TOKENS.spacingSm,
    letterSpacing: 0.2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: TOKENS.spacingSm,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.strokeSoft,
  },
  settingRowLast: {
    paddingBottom: TOKENS.spacingLg,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: TOKENS.radiusMd,
    backgroundColor: PALETTE.brand50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: TOKENS.spacingMd,
  },
  settingIconWrapDanger: {
    backgroundColor: PALETTE.danger50,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  settingLabelDanger: {
    color: PALETTE.danger500,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 13,
    color: PALETTE.textTertiary,
    fontWeight: '500',
    maxWidth: 120,
  },
  skeletonWrap: {
    backgroundColor: PALETTE.skeletonBase,
    position: 'relative',
  },
  skeletonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: PALETTE.skeletonHigh,
    opacity: 0.8,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: PALETTE.textQuaternary,
    fontWeight: '500',
    paddingHorizontal: TOKENS.contentInset,
  },
});

export default ProfileScreen;
