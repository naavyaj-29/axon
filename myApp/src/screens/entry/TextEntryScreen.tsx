import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, Animated,
  Keyboard, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useStore } from '../../store/store';
import { Colors, Spacing, Type } from '../../theme/theme';
import { BackHeader, PrimaryButton } from '../../components/ui/UIComponents';

const PROMPTS = [
  'What\'s weighing on you today?',
  'How\'s your mental energy right now?',
  'What happened that you want to process?',
  'What are you feeling right now?',
  'Anything you\'ve been avoiding thinking about?',
];

export default function TextEntryScreen({ navigation }) {
  const { actions } = useStore();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const inputRef = useRef(null);
  const fade = useRef(new Animated.Value(0)).current;
  const charCount = text.trim().length;
  const hasContent = charCount > 10;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    // Auto-focus after animation
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (!hasContent || isSubmitting) return;
    Keyboard.dismiss();
    setIsSubmitting(true);
    actions.setEntryText(text);
    await actions.analyzeEntry();
    setIsSubmitting(false);
    navigation.replace('Analyzing');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <BackHeader onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Animated.View style={{ opacity: fade }}>
            <Text style={styles.heading}>What's on your mind?</Text>
            <Text style={styles.prompt}>{PROMPTS[promptIndex]}</Text>

            {/* Input area */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}
            >
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                placeholder="Start writing here…"
                placeholderTextColor={Colors.textTertiary}
                style={styles.input}
                textAlignVertical="top"
                selectionColor={Colors.accent}
              />
            </TouchableOpacity>

            {/* Word count hint */}
            <View style={styles.meta}>
              <Text style={styles.metaText}>
                {charCount < 10 && charCount > 0 ? 'Keep going…' : charCount > 0 ? `${charCount} characters` : 'No minimum — just be honest'}
              </Text>
              {hasContent && <Text style={styles.metaGood}>Ready to analyze ✓</Text>}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <PrimaryButton
            label="Generate Insights"
            onPress={handleSubmit}
            disabled={!hasContent}
            loading={isSubmitting}
            style={{ marginBottom: 0 }}
          />
          <Text style={styles.privacyNote}>🔒  Your entry is never shared</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  heading: { ...Type.h1, marginBottom: 8 },
  prompt: {
    ...Type.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },

  inputWrap: {
    backgroundColor: Colors.bgInput,
    borderRadius: Spacing.cardR,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 220,
    maxHeight: 380,
  },
  inputWrapFocused: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.bgCard,
  },
  input: {
    ...Type.body,
    color: Colors.textPrimary,
    padding: Spacing.md,
    lineHeight: 24,
    minHeight: 220,
  },

  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  metaText: { ...Type.caption, color: Colors.textTertiary },
  metaGood: { ...Type.captionSB, color: Colors.signalGreen, fontWeight: '600' },

  bottomBar: {
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
    gap: 10,
  },
  privacyNote: {
    ...Type.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});