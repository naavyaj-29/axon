import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type, Shadow } from '../../theme/theme';
import { BackHeader } from '../../components/ui/UIComponents';

const MODES = [
  {
    key:   'text',
    icon:  '✏️',
    title: 'Write',
    desc:  'Type out your thoughts, feelings, or anything on your mind.',
    color: Colors.accent,
    soft:  Colors.accentSoft,
    border: Colors.accentBorder,
    screen: 'TextEntry',
  },
  {
    key:   'audio',
    icon:  '🎙️',
    title: 'Voice',
    desc:  'Record yourself talking — natural, fast, no typing needed.',
    color: Colors.signalGreen,
    soft:  Colors.signalGreenSoft,
    border: 'rgba(80,203,160,0.3)',
    screen: 'AudioEntry',
  },
  {
    key:   'video',
    icon:  '📹',
    title: 'Video',
    desc:  'Capture a video entry. Facial cues help deepen the analysis.',
    color: Colors.signalAmber,
    soft:  Colors.signalAmberSoft,
    border: 'rgba(240,176,96,0.3)',
    screen: 'VideoEntry',
  },
];

export default function EntryHubScreen({ navigation }: any) {
  const { actions } = useStore();
  const containerFade = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(MODES.map(() => ({
    fade:  new Animated.Value(0),
    slide: new Animated.Value(30),
  }))).current;

  useEffect(() => {
    Animated.timing(containerFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.stagger(90, cardAnims.map(a =>
      Animated.parallel([
        Animated.timing(a.fade,  { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(a.slide, { toValue: 0, duration: 380, useNativeDriver: true }),
      ])
    )).start();
  }, []);

  const handleSelect = (mode: any) => {
    actions.setEntryType(mode.key);
    navigation.push(mode.screen);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <BackHeader onBack={() => navigation.goBack()} />

      <Animated.View style={[styles.content, { opacity: containerFade }]}>
        <Text style={styles.heading}>New Entry</Text>
        <Text style={styles.sub}>How would you like to capture your thoughts?</Text>

        <View style={styles.cards}>
          {MODES.map((mode, i) => (
            <Animated.View
              key={mode.key}
              style={{ opacity: cardAnims[i].fade, transform: [{ translateY: cardAnims[i].slide }] }}
            >
              <TouchableOpacity
                style={[styles.modeCard, { borderColor: mode.border, backgroundColor: Colors.bgCard }]}
                onPress={() => handleSelect(mode)}
                activeOpacity={0.75}
              >
                {/* Icon blob */}
                <View style={[styles.iconBlob, { backgroundColor: mode.soft }]}>
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                </View>

                <View style={styles.modeText}>
                  <Text style={[styles.modeTitle, { color: mode.color }]}>{mode.title}</Text>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </View>

                <Text style={[styles.arrow, { color: mode.color }]}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.privacyNote}>🔒  Nothing you record is shared with anyone</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.sm,
  },
  heading: { ...Type.h1, marginBottom: 6 },
  sub: { ...Type.body, color: Colors.textSecondary, marginBottom: Spacing.xl },

  cards: { gap: 12 },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    ...Shadow.sm,
  },
  iconBlob: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  modeIcon: { fontSize: 26 },
  modeText: { flex: 1 },
  modeTitle: {
    ...Type.h3,
    fontWeight: '700',
    marginBottom: 3,
  },
  modeDesc: { ...Type.label, lineHeight: 18, color: Colors.textSecondary },
  arrow: { fontSize: 26, fontWeight: '300', lineHeight: 30 },

  privacyNote: {
    ...Type.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});