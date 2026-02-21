import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type, Shadow } from '../../theme/theme';
import { BackHeader, PrimaryButton } from '../../components/ui/UIComponents';

const NUM_BARS = 28;

export default function AudioEntryScreen({ navigation }: any) {
  const { actions } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused]       = useState(false);
  const [recorded, setRecorded]       = useState(false);
  const [seconds, setSeconds]         = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef    = useRef<any>(null);
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const pulseLoop   = useRef<any>(null);
  const barAnims    = useRef(Array.from({ length: NUM_BARS }, () => new Animated.Value(0.15))).current;
  const barLoops    = useRef<any[]>([]);
  const fadeIn      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    return () => stopAllAnimations();
  }, []);

  const stopAllAnimations = () => {
    pulseLoop.current?.stop();
    barLoops.current.forEach(l => l?.stop());
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startWaveform = () => {
    barLoops.current = barAnims.map((anim, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 200 + Math.floor(Math.random() * 300),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.1 + Math.random() * 0.25,
            duration: 200 + Math.floor(Math.random() * 300),
            useNativeDriver: true,
          }),
        ])
      );
      setTimeout(() => loop.start(), i * 12);
      return loop;
    });
  };

  const stopWaveform = () => {
    barLoops.current.forEach(l => l?.stop());
    barAnims.forEach(a => {
      Animated.timing(a, { toValue: 0.15, duration: 300, useNativeDriver: true }).start();
    });
  };

  const startMicPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.96, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecorded(false);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    startMicPulse();
    startWaveform();
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopAllAnimations();
    pulseAnim.setValue(1);
    setIsRecording(false);
    setIsPaused(false);
    setRecorded(true);
    actions.setEntryAudio('/mock/audio.m4a');
  };

  const handleDiscard = () => {
    setRecorded(false);
    setSeconds(0);
    actions.setEntryAudio(null);
  };

  const handleSubmit = async () => {
    if (!recorded || isSubmitting) return;
    setIsSubmitting(true);
    await actions.analyzeEntry();
    setIsSubmitting(false);
    navigation.replace('Analyzing');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <BackHeader onBack={() => navigation.goBack()} title="Voice Entry" />

      <Animated.View style={[styles.body, { opacity: fadeIn }]}>

        {/* Timer */}
        <Text style={[styles.timer, isRecording && styles.timerActive]}>
          {formatTime(seconds)}
        </Text>

        {/* Status text */}
        <Text style={styles.statusText}>
          {isRecording ? 'Recording…' : recorded ? 'Recording complete ✓' : 'Tap the mic to start'}
        </Text>

        {/* Waveform visualiser */}
        <View style={styles.waveform}>
          {barAnims.map((anim, i) => {
            const maxH = 16 + ((i % 5) * 10);
            return (
              <Animated.View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: maxH,
                    backgroundColor: isRecording ? Colors.accent : recorded ? Colors.signalGreen : Colors.textTertiary,
                    transform: [{ scaleY: anim }],
                    opacity: isRecording ? 1 : recorded ? 0.6 : 0.25,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Mic button */}
        {!recorded ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.micBtn, isRecording && styles.micBtnActive]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              activeOpacity={0.85}
            >
              <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎙️'}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.postRecord}>
            <TouchableOpacity onPress={handleDiscard} style={styles.discardBtn}>
              <Text style={styles.discardText}>↺  Re-record</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom action */}
        <View style={styles.bottomAction}>
          {!recorded ? (
            <TouchableOpacity
              style={[styles.bigRecordBtn, isRecording && styles.bigRecordBtnStop]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              activeOpacity={0.8}
            >
              <Text style={styles.bigRecordText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Text>
            </TouchableOpacity>
          ) : (
            <PrimaryButton
              label="Generate Insights"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          )}
          <Text style={styles.hint}>
            {recorded ? 'Your voice is analyzed securely on-device' : isRecording ? 'Speak naturally — there\'s no right way to do this' : 'Speak about anything on your mind'}
          </Text>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.xxl,
  },

  timer: {
    fontSize: 52,
    fontWeight: '200',
    letterSpacing: 3,
    color: Colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  timerActive: { color: Colors.textPrimary },

  statusText: {
    ...Type.label,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 70,
    paddingHorizontal: 4,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },

  micBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.bgElevated,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  micBtnActive: {
    backgroundColor: Colors.recording + '22',
    borderColor: Colors.recording,
    ...Shadow.recording,
  },
  micIcon: { fontSize: 44 },

  postRecord: {
    alignItems: 'center',
    gap: 8,
  },
  discardBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  discardText: { ...Type.label, color: Colors.textSecondary },

  bottomAction: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  bigRecordBtn: {
    width: '100%',
    height: Spacing.btnH,
    backgroundColor: Colors.accent,
    borderRadius: Spacing.btnR,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.accent,
  },
  bigRecordBtnStop: {
    backgroundColor: Colors.recording,
    shadowColor: Colors.recording,
  },
  bigRecordText: { ...Type.bodySB, color: Colors.white, fontWeight: '700' },
  hint: { ...Type.caption, color: Colors.textTertiary, textAlign: 'center' },
});