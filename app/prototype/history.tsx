import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { AppBottomNav } from '../components/AppBottomNav';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

interface HistoryItem {
  id: string;
  type: 'sign_to_text' | 'text_to_speech' | 'text_to_sign';
  source: string;
  translated: string;
  timestamp: string;
  langTag?: string;
  starred?: boolean;
}

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: '1',
    type: 'sign_to_text',
    source: 'Gesture: Raised open palm (Wave)',
    translated: 'Hello, good morning',
    timestamp: '10 mins ago',
    langTag: 'ISL → English',
    starred: true,
  },
  {
    id: '2',
    type: 'text_to_speech',
    source: 'Where is the train station?',
    translated: 'ரயில் நிலையம் எங்கே இருக்கிறது?',
    timestamp: '45 mins ago',
    langTag: 'English → தமிழ்',
    starred: true,
  },
  {
    id: '3',
    type: 'text_to_sign',
    source: 'Can you help me?',
    translated: 'Gesture Video: Emergency Assistance',
    timestamp: '2 hours ago',
    langTag: 'Text → ISL Video',
    starred: false,
  },
  {
    id: '4',
    type: 'sign_to_text',
    source: 'Gesture: Fingertips chin forward',
    translated: 'Thank you very much',
    timestamp: 'Yesterday, 4:20 PM',
    langTag: 'ISL → English',
    starred: false,
  },
  {
    id: '5',
    type: 'text_to_speech',
    source: 'I need water please.',
    translated: 'मुझे पानी चाहिए कृपया।',
    timestamp: 'Yesterday, 2:15 PM',
    langTag: 'English → हिन्दी',
    starred: false,
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sign' | 'speech' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = history.filter((item) => {
    const matchesSearch =
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translated.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'sign') return matchesSearch && item.type === 'sign_to_text';
    if (selectedFilter === 'speech') return matchesSearch && item.type === 'text_to_speech';
    if (selectedFilter === 'favorites') return matchesSearch && item.starred;
    return matchesSearch;
  });

  const toggleStar = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item)),
    );
  };

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  const speakItem = (text: string) => {
    Speech.speak(text, { language: 'en-IN' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Translation History</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>Recent Conversations & Gestures</Text>
        </View>

        {history.length > 0 ? (
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
            onPress={clearAllHistory}
          >
            <Ionicons name="trash-outline" size={18} color={PALETTE.danger} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Ionicons name="search-outline" size={18} color={theme.textTertiary} />
          <TextInput
            placeholder="Search past translations..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: selectedFilter === 'all' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: selectedFilter === 'all' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterPillText, { color: selectedFilter === 'all' ? '#fff' : theme.textSecondary }]}>
              All ({history.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: selectedFilter === 'sign' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: selectedFilter === 'sign' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter('sign')}
          >
            <Text style={[styles.filterPillText, { color: selectedFilter === 'sign' ? '#fff' : theme.textSecondary }]}>
              Sign AI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: selectedFilter === 'speech' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: selectedFilter === 'speech' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter('speech')}
          >
            <Text style={[styles.filterPillText, { color: selectedFilter === 'speech' ? '#fff' : theme.textSecondary }]}>
              Speech
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: selectedFilter === 'favorites' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: selectedFilter === 'favorites' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter('favorites')}
          >
            <Text style={[styles.filterPillText, { color: selectedFilter === 'favorites' ? '#fff' : theme.textSecondary }]}>
              Starred ⭐
            </Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        {filteredItems.length > 0 ? (
          <View style={styles.list}>
            {filteredItems.map((item) => {
              const isSign = item.type === 'sign_to_text';
              const isVoice = item.type === 'text_to_speech';
              const typeColor = isSign ? PALETTE.primary : isVoice ? '#10B981' : '#8B5CF6';

              return (
                <View
                  key={item.id}
                  style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}
                >
                  <View style={styles.cardTop}>
                    <View style={[styles.typeBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                      <Ionicons
                        name={isSign ? 'videocam' : isVoice ? 'volume-high' : 'film'}
                        size={12}
                        color={typeColor}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.typeBadgeText, { color: typeColor }]}>{item.langTag}</Text>
                    </View>

                    <Text style={[styles.timestamp, { color: theme.textTertiary }]}>{item.timestamp}</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.sourceText, { color: theme.textTertiary }]}>{item.source}</Text>
                    <Text style={[styles.transText, { color: theme.textPrimary }]}>{item.translated}</Text>
                  </View>

                  <View style={[styles.cardFooter, { borderTopColor: theme.borderSubtle }]}>
                    <View style={styles.actionsLeft}>
                      <TouchableOpacity
                        style={[styles.actionIconBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                        onPress={() => speakItem(item.translated)}
                      >
                        <Ionicons name="volume-medium" size={16} color={PALETTE.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionIconBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                        onPress={() => toggleStar(item.id)}
                      >
                        <Ionicons
                          name={item.starred ? 'star' : 'star-outline'}
                          size={16}
                          color={item.starred ? '#F59E0B' : theme.textTertiary}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
                      <Ionicons name="trash-outline" size={16} color={theme.textTertiary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="history" size={54} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No translation records</Text>
            <Text style={[styles.emptyDesc, { color: theme.textTertiary }]}>
              Translations and gestures performed in Camera or Speech mode will be saved here automatically.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <AppBottomNav currentTab="history" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filtersRow: { flexDirection: 'row', gap: 8 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterPillText: { fontSize: 12, fontWeight: '700' },
  list: { gap: 12 },
  historyCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  timestamp: { fontSize: 11, fontWeight: '500' },
  cardContent: { gap: 4 },
  sourceText: { fontSize: 13, fontWeight: '500' },
  transText: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  actionsLeft: { flexDirection: 'row', gap: 8 },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptyDesc: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
