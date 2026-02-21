import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Colors, Spacing, Type, Shadow } from '../../theme/theme';

export function Card({ children, style, padding }: { children: ReactNode, style?: any, padding?: number }) {
  return <View style={[styles.card, padding !== undefined && { padding }, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, disabled, loading, style }: { label: string, onPress: () => void, disabled?: boolean, loading?: boolean, style?: any }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={[styles.primaryBtn, (disabled || loading) && styles.primaryBtnDisabled, style]}>
      {loading ? <ActivityIndicator color={Colors.ctaText} size="small" /> : <Text style={styles.primaryBtnText}>{label}</Text>}
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, style }: { label: string, onPress: () => void, style?: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.ghostBtn, style]}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function IconButton({ icon, onPress, size = 44, color, bgColor, style }: { icon: string, onPress: () => void, size?: number, color?: string, bgColor?: string, style?: any }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.iconBtn, { width: size, height: size, borderRadius: size / 2 }, bgColor && { backgroundColor: bgColor }, style]}>
      <Text style={{ fontSize: size * 0.42, color: color || Colors.textPrimary }}>{icon}</Text>
    </TouchableOpacity>
  );
}

export function BackHeader({ onBack, title, right }: { onBack: () => void, title?: string, right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}><Text style={styles.backArrow}>‹</Text></TouchableOpacity>
      {title ? <Text style={styles.headerTitle}>{title}</Text> : <View style={{ flex: 1 }} />}
      <View style={styles.headerRight}>{right || null}</View>
    </View>
  );
}

export function Pill({ label, color, bgColor }: { label: string, color?: string, bgColor?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bgColor || Colors.accentSoft }]}>
      <Text style={[styles.pillText, { color: color || Colors.accent }]}>{label}</Text>
    </View>
  );
}

export function Divider({ style }: { style?: any }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, borderRadius: Spacing.cardR, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, overflow: 'hidden' },
  primaryBtn: { backgroundColor: Colors.ctaBg, height: Spacing.btnH, borderRadius: Spacing.btnR, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, ...Shadow.accent },
  primaryBtnDisabled: { opacity: 0.35, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  primaryBtnText: { ...Type.bodySB, color: Colors.ctaText, fontWeight: '700' },
  ghostBtn: { height: Spacing.btnH, borderRadius: Spacing.btnR, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgElevated },
  ghostBtnText: { ...Type.bodySB, color: Colors.textSecondary },
  iconBtn: { backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenH, paddingVertical: 10, minHeight: 52 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  backArrow: { fontSize: 30, lineHeight: 34, color: Colors.textPrimary, fontWeight: '300' },
  headerTitle: { ...Type.h3, flex: 1 },
  headerRight: { width: 44, alignItems: 'flex-end' },
  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  pillText: { ...Type.captionSB, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border },
});