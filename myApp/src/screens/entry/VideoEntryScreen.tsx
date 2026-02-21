import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform,
} from 'react-native';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type, Shadow } from '../../theme/theme';
import { PrimaryButton } from '../../components/ui/UIComponents';

export default function VideoEntryScreen({ navigation }: any) {
  const { actions } = useStore();
  const [isRecording, setIsRecording]   = useState(false);
  const [recorded, setRecorded]         = useState(false);
  const [seconds, setSeconds]           = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef  = useRef<any>(null);
  const dotAnim   = useRef(new Animated.Value(1)).current;
  const dotLoop   = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      dotLoop.current?.stop();
    };
  }, []);

  const startRecordingUI = () => {
    setIsRecording(true);
    setRecorded(false);
    setSeconds(0);

    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);

    dotLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    dotLoop.current.start();
  };

  const stopRecordingUI = (path: any) => {
    if (timerRef.current) clearInterval(timerRef.current);
    dotLoop.current?.stop();
    dotAnim.setValue(1);
    setIsRecording(false);
    setRecorded(true);
    if (path) actions.setEntryVideo(path);
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      stopRecordingUI('/mock/video.mp4');
    } else {
      startRecordingUI();
    }
  };

  const handleDiscard = () => {
    setRecorded(false);
    setSeconds(0);
    actions.setEntryVideo(null);
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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderEmoji}>📷</Text>
        <Text style={styles.placeholderText}>
          Camera preview here{'\n'}
          See code comments to wire in{'\n'}
          react-native-vision-camera or expo-camera
        </Text>
      </View>

      {/* Top row: close + timer */}
      <View style={[styles.topRow, { paddingTop: Platform.OS === 'ios' ? 54 : 24 }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.timerPill}>
            <Animated.View style={[styles.recDot, { opacity: dotAnim }]} />
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </View>
        )}
      </View>

      {/* Bottom controls */}
      <View style={[styles.bottomRow, { paddingBottom: Platform.OS === 'ios' ? 48 : 24 }]}>

        {recorded ? (
          <View style={styles.postRecordControls}>
            <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
              <Text style={styles.discardText}>↺  Re-record</Text>
            </TouchableOpacity>

            <PrimaryButton
              label={isSubmitting ? 'Analyzing…' : 'Generate Insights'}
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.generateBtn}
            />
          </View>
        ) : (
          <View style={styles.recordControls}>
            <TouchableOpacity
              style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
              onPress={handleToggleRecord}
              activeOpacity={0.85}
            >
              {isRecording
                ? <View style={styles.stopSquare} />
                : <View style={styles.recordCircle} />
              }
            </TouchableOpacity>

            <Text style={styles.recordLabel}>
              {isRecording ? 'Tap to stop' : 'Tap to record'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderEmoji: { fontSize: 56 },
  placeholderText: {
    color: '#444',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 20,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.recording,
  },
  timerText: {
    color: Colors.recording,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  bottomRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },

  recordControls: { alignItems: 'center', gap: 14 },
  recordBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  recordBtnActive: { borderColor: Colors.recording },
  recordCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.recording,
  },
  stopSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.recording,
  },
  recordLabel: { color: '#FFF', fontSize: 13, fontWeight: '500' },

  postRecordControls: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  discardBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  discardText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  generateBtn: { width: '100%' },
});