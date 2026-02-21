import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type } from '../../theme/theme';

const STEPS = [
  { icon: '🔍', label: 'Reading your entry…',          duration: 800  },
  { icon: '🧠', label: 'Mapping cognitive patterns…',     duration: 900  },
  { icon: '💭', label: 'Measuring emotional signals…',    duration: 850  },
  { icon: '📊', label: 'Calculating stress load…',        duration: 750  },
  { icon: '⚡', label: 'Detecting cognitive load…',       duration: 700  },
  { icon: '✨', label: 'Generating your insights…',       duration: 600  },
];

function StepItem({ step, isActive, isDone, index }: any) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (isActive || isDone) {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive, isDone]);

  if (!isActive && !isDone) return null;

  return (
    <Animated.View style={[styles.stepRow, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={[styles.stepIconWrap, isDone && styles.stepIconDone, isActive && styles.stepIconActive]}>
        <Text style={styles.stepIcon}>{isDone ? '✓' : step.icon}</Text>
      </View>
      <Text style={[styles.stepLabel, isDone && styles.stepLabelDone, isActive && styles.stepLabelActive]}>
        {step.label}
      </Text>
    </Animated.View>
  );
}

export default function AnalyzingScreen({ navigation }: any) {
  const { state } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps]     = useState<number[]>([]);
  const [complete, setComplete]       = useState(false);

  const ringAnim    = useRef(new Animated.Value(0)).current;
  const ringLoop    = useRef<any>(null);
  const completeFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spinning ring
    ringLoop.current = Animated.loop(
      Animated.timing(ringAnim, { toValue: 1, duration: 1400, useNativeDriver: true })
    );
    ringLoop.current.start();

    // Walk through steps
    let stepIndex = 0;
    let timeoutId: any;

    const runStep = () => {
      if (stepIndex >= STEPS.length) {
        ringLoop.current?.stop();
        setComplete(true);
        Animated.timing(completeFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        // Navigate to dashboard after a beat
        timeoutId = setTimeout(() => navigation.replace('Dashboard'), 1200);
        return;
      }

      setCurrentStep(stepIndex);
      const dur = STEPS[stepIndex].duration;
      timeoutId = setTimeout(() => {
        setDoneSteps(prev => [...prev, stepIndex]);
        stepIndex++;
        runStep();
      }, dur);
    };

    runStep();

    return () => {
      ringLoop.current?.stop();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const spin = ringAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.body}>
        {/* Spinner */}
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
          <View style={styles.ringInner}>
            <Text style={styles.ringEmoji}>{complete ? '✨' : '🧠'}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {complete ? 'Analysis Complete' : 'Analyzing Your Entry'}
        </Text>
        <Text style={styles.subtitle}>
          {complete ? 'Taking you to your insights…' : 'This takes just a moment'}
        </Text>

        {/* Steps list */}
        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <StepItem
              key={i}
              step={step}
              index={i}
              isActive={i === currentStep && !doneSteps.includes(i)}
              isDone={doneSteps.includes(i)}
            />
          ))}
        </View>

        {/* Complete banner */}
        {complete && (
          <Animated.View style={[styles.completeBanner, { opacity: completeFade }]}>
            <Text style={styles.completeBannerText}>✓  Ready to view</Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenH,
    gap: 20,
  },

  spinnerWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.accent,
    borderTopColor: 'transparent',
    borderRightColor: Colors.accent + '55',
  },
  ringInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringEmoji: { fontSize: 28 },

  title: { ...Type.h2, textAlign: 'center' },
  subtitle: { ...Type.label, color: Colors.textTertiary, textAlign: 'center', marginTop: -10 },

  steps: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 2,
  },
  stepIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    borderColor: Colors.accentBorder,
    backgroundColor: Colors.accentSoft,
  },
  stepIconDone: {
    borderColor: 'rgba(80,203,160,0.4)',
    backgroundColor: Colors.signalGreenSoft,
  },
  stepIcon: { fontSize: 16 },
  stepLabel: { ...Type.body, color: Colors.textTertiary, flex: 1 },
  stepLabelActive: { color: Colors.textPrimary },
  stepLabelDone: { color: Colors.signalGreen },

  completeBanner: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.signalGreenSoft,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(80,203,160,0.35)',
  },
  completeBannerText: {
    ...Type.bodySB,
    color: Colors.signalGreen,
    fontWeight: '700',
  },
});