import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StyleSheet, Animated,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type, Shadow } from '../../theme/theme';
import { Card, Pill } from '../../components/ui/UIComponents';
import { LineChart, BarChart } from '../../components/charts/Charts';

const W = Dimensions.get('window').width;

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ metric, color, softColor, icon, delay }) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const statusColor =
    metric.status === 'good'     ? Colors.signalGreen  :
    metric.status === 'elevated' ? Colors.signalRed    :
    metric.status === 'moderate' ? Colors.signalAmber  : Colors.signalBlue;

  const pct = Math.min(100, metric.value);

  return (
    <Animated.View style={[styles.metricWrap, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <Card style={styles.metricCard}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <Text style={[styles.metricValue, { color }]}>{metric.value}</Text>
        <Text style={styles.metricLabel}>{metric.label}</Text>

        {/* Mini progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>

        {/* Trend pill */}
        <View style={styles.metricBottom}>
          <Pill
            label={metric.trend}
            color={statusColor}
            bgColor={softColor}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

// ─── Signal Row ───────────────────────────────────────────────────────────────
function SignalRow({ label, value, color, softColor, index }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 400, delay: 200 + index * 70, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay: 200 + index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <View style={styles.signalRow}>
        <View style={[styles.signalDot, { backgroundColor: color }]} />
        <Text style={styles.signalLabel}>{label}</Text>
        <View style={styles.signalRight}>
          <Text style={[styles.signalValue, { color }]}>{value}</Text>
          <View style={[styles.signalBadge, { backgroundColor: softColor }]}>
            <Text style={[styles.signalBadgeText, { color }]}>Tracking ↑</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const { state, actions } = useStore();
  const { dashboard, charts, insight } = state;

  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const metrics = [
    { data: dashboard.cognitiveLoad,     color: Colors.signalRed,   soft: Colors.signalRedSoft,   icon: '⚡', delay: 0   },
    { data: dashboard.mentalClarity,     color: Colors.signalGreen, soft: Colors.signalGreenSoft, icon: '🧠', delay: 60  },
    { data: dashboard.emotionalRecovery, color: Colors.signalBlue,  soft: Colors.signalBlueSoft,  icon: '↑',  delay: 120 },
    { data: dashboard.stressLoad,        color: Colors.signalAmber, soft: Colors.signalAmberSoft, icon: '〜', delay: 180 },
  ];

  const signals = [
    { label: 'Cognitive Load Trend',    value: dashboard.cognitiveLoad.trend,     color: Colors.signalRed,   soft: Colors.signalRedSoft   },
    { label: 'Mental Clarity',          value: dashboard.mentalClarity.trend,     color: Colors.signalGreen, soft: Colors.signalGreenSoft },
    { label: 'Emotional Recovery',      value: dashboard.emotionalRecovery.trend, color: Colors.signalBlue,  soft: Colors.signalBlueSoft  },
    { label: 'Stress Load Trend',       value: dashboard.stressLoad.trend,        color: Colors.signalAmber, soft: Colors.signalAmberSoft },
  ];

  const barGroups = charts.days.slice(-5).map((_, i) => ({
    a: charts.recoveryWeek[i + 2],
    b: charts.stressWeek[i + 2],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <Animated.View style={[styles.topBar, { opacity: headerFade }]}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.appName}>Sine</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{dashboard.streakDays} days</Text>
          </View>
          <TouchableOpacity
            style={styles.newEntryBtn}
            onPress={() => navigation.push('EntryHub')}
            activeOpacity={0.8}
          >
            <Text style={styles.newEntryText}>＋ New Entry</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={dashboard.isRefreshing}
            onRefresh={actions.refreshDashboard}
            tintColor={Colors.accent}
          />
        }
      >
        {/* ── Metrics Grid ── */}
        <Text style={styles.sectionLabel}>THIS WEEK</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((m, i) => (
            <MetricCard
              key={i}
              metric={m.data}
              color={m.color}
              softColor={m.soft}
              icon={m.icon}
              delay={m.delay}
            />
          ))}
        </View>

        {/* ── Stats strip ── */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dashboard.entriesThisWeek}</Text>
            <Text style={styles.statLabel}>entries this week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dashboard.streakDays}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.signalGreen }]}>↑ 12%</Text>
            <Text style={styles.statLabel}>overall recovery</Text>
          </View>
        </View>

        {/* ── Cognitive Load Line Chart ── */}
        <Text style={styles.sectionLabel}>COGNITIVE LOAD — 7 DAYS</Text>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Cognitive Load Trend</Text>
          <Text style={styles.chartSubtitle}>Lower is better</Text>
          <View style={{ height: Spacing.md }} />
          <LineChart
            data={charts.cognitiveLoadWeek}
            labels={charts.days}
            color={Colors.signalRed}
            height={160}
          />
        </Card>

        {/* ── Recovery vs Stress Bar Chart ── */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>RECOVERY VS STRESS</Text>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Recovery & Stress Balance</Text>
          <Text style={styles.chartSubtitle}>Last 5 days</Text>
          <View style={{ height: Spacing.md }} />
          <BarChart
            groups={barGroups}
            colors={[Colors.signalGreen, Colors.signalRed]}
            labels={charts.days.slice(-5).map(d => d.slice(0, 1))}
            height={160}
          />
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.signalGreen }]} />
              <Text style={styles.legendLabel}>Recovery</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.signalRed }]} />
              <Text style={styles.legendLabel}>Stress</Text>
            </View>
          </View>
        </Card>

        {/* ── Signals Detected ── */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>SIGNALS DETECTED</Text>
        <Card style={styles.signalsCard}>
          {signals.map((s, i) => (
            <SignalRow key={i} {...s} index={i} />
          ))}
        </Card>

        {/* ── Daily Insight ── */}
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.insightText}>{insight}</Text>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity style={styles.cta} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Try 1 month free — Unlock full insights</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingTop: 8,
    paddingBottom: 12,
  },
  greeting: { ...Type.caption, color: Colors.textTertiary, marginBottom: 2 },
  appName:  { ...Type.h1, letterSpacing: 1 },
  headerRight: { alignItems: 'flex-end', gap: 8 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.signalAmberSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  streakIcon: { fontSize: 12 },
  streakText: { ...Type.captionSB, color: Colors.signalAmber, fontWeight: '700' },
  newEntryBtn: {
    backgroundColor: Colors.accentSoft,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  newEntryText: { ...Type.captionSB, color: Colors.accent, fontWeight: '700', fontSize: 13 },

  scroll: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.sm,
  },

  sectionLabel: {
    ...Type.captionSB,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
  },

  // Metrics
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing.md,
  },
  metricWrap: { width: (W - Spacing.screenH * 2 - 10) / 2 },
  metricCard: { padding: 14, gap: 2 },
  metricIcon: { fontSize: 22, marginBottom: 6 },
  metricValue: { fontSize: 30, fontWeight: '800', letterSpacing: -1, lineHeight: 34 },
  metricLabel: { ...Type.caption, color: Colors.textSecondary, marginTop: 1 },
  progressBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 2 },
  metricBottom: { marginTop: 8 },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Spacing.cardR,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...Type.h2, color: Colors.textPrimary },
  statLabel: { ...Type.caption, color: Colors.textTertiary, marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  // Charts
  chartCard: { padding: Spacing.md, marginBottom: 0 },
  chartTitle: { ...Type.h3 },
  chartSubtitle: { ...Type.caption, color: Colors.textTertiary, marginTop: 2 },
  legend: { flexDirection: 'row', gap: 20, justifyContent: 'center', marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendLabel: { ...Type.caption, color: Colors.textSecondary },

  // Signals
  signalsCard: { padding: 0, overflow: 'hidden' },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  signalDot: { width: 8, height: 8, borderRadius: 4 },
  signalLabel: { ...Type.body, flex: 1, color: Colors.textPrimary },
  signalRight: { alignItems: 'flex-end', gap: 4 },
  signalValue: { ...Type.bodySB, fontWeight: '700' },
  signalBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  signalBadgeText: { ...Type.captionSB, fontWeight: '700' },

  // Insight
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.bgElevated,
    borderRadius: Spacing.cardR,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  insightIcon: { fontSize: 18 },
  insightText: { ...Type.label, flex: 1, color: Colors.textSecondary, lineHeight: 20 },

  // CTA
  cta: {
    backgroundColor: Colors.accent,
    borderRadius: Spacing.btnR,
    height: Spacing.btnH,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    ...Shadow.accent,
  },
  ctaText: { ...Type.bodySB, color: Colors.ctaText, fontWeight: '700' },
});