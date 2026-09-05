import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    // Navigate straight into the app
    router.push('/prototype/translation Mode');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Nav Back */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Brand Header */}
          <View style={styles.brandSection}>
            <View style={[styles.logoBadge, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.16)' : '#E0F2FE' }]}>
              <MaterialCommunityIcons name="sign-language" size={36} color={PALETTE.primary} />
            </View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>Hand2Voice</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Bridging Indian Sign Language with Text & Voice
            </Text>
          </View>

          {/* Mode Switcher Tab */}
          <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                mode === 'signin' && [styles.tabBtnActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => setMode('signin')}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: mode === 'signin' ? PALETTE.primary : theme.textTertiary,
                    fontWeight: mode === 'signin' ? '700' : '500',
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                mode === 'signup' && [styles.tabBtnActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => setMode('signup')}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: mode === 'signup' ? PALETTE.primary : theme.textTertiary,
                    fontWeight: mode === 'signup' ? '700' : '500',
                  },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <Ionicons name="person-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textTertiary}
                    value={name}
                    onChangeText={setName}
                    style={[styles.textInput, { color: theme.textPrimary }]}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Ionicons name="mail-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
                {mode === 'signin' && (
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={[styles.forgotText, { color: PALETTE.primary }]}>Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.textTertiary} style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={theme.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.textInput, { color: theme.textPrimary }]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, SHADOWS.md]}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {/* Quick Guest Access */}
            <TouchableOpacity
              style={[styles.guestBtn, { borderColor: theme.borderSubtle }]}
              onPress={() => router.push('/prototype/translation Mode')}
            >
              <Ionicons name="flash-outline" size={16} color={PALETTE.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.guestBtnText, { color: theme.textSecondary }]}>
                Continue as <Text style={{ color: PALETTE.primary, fontWeight: '700' }}>Guest</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Auth Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textTertiary }]}>OR CONNECT WITH</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/prototype/translation Mode')}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => router.push('/prototype/translation Mode')}
            >
              <Ionicons name="logo-apple" size={18} color={isDark ? '#FFFFFF' : '#000000'} />
              <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Apple</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topRow: {
    paddingVertical: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  tabBtnActive: {
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 14,
  },
  card: {
    padding: 20,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 16,
    ...SHADOWS.sm,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
  },
  submitBtn: {
    height: 52,
    backgroundColor: PALETTE.primary,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  guestBtn: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  guestBtnText: {
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
