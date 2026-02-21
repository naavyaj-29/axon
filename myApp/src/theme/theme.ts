// ─── Colors ───────────────────────────────────────────────────────────────────
export const Colors = {
  // Backgrounds
  bg:          '#080810',
  bgCard:      '#10101A',
  bgElevated:  '#16162A',
  bgInput:     '#0E0E1C',

  // Borders
  border:      'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(120,120,220,0.45)',

  // Text
  textPrimary:   '#EEEEF8',
  textSecondary: '#8888AA',
  textTertiary:  '#4A4A6A',

  // Brand / accent
  accent:        '#7878DC',
  accentSoft:    'rgba(120,120,220,0.15)',
  accentBorder:  'rgba(120,120,220,0.3)',

  // Signal colors
  signalRed:     '#F07272',
  signalRedSoft: 'rgba(240,114,114,0.12)',
  signalGreen:   '#50CBA0',
  signalGreenSoft:'rgba(80,203,160,0.12)',
  signalBlue:    '#6CA0F8',
  signalBlueSoft:'rgba(108,160,248,0.12)',
  signalAmber:   '#F0B060',
  signalAmberSoft:'rgba(240,176,96,0.12)',

  // CTA
  ctaBg:   '#7878DC',
  ctaText: '#FFFFFF',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  recording: '#E84040',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  screenH: 20,
  screenV: 20,
  cardR:   16,
  btnR:    14,
  btnH:    54,
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const Type = {
  hero: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 38,
    color: '#EEEEF8',
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
    color: '#EEEEF8',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 26,
    color: '#EEEEF8',
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    color: '#EEEEF8',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#EEEEF8',
  },
  bodySB: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    color: '#EEEEF8',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#8888AA',
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    color: '#8888AA',
  },
  captionSB: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    color: '#8888AA',
  },
  mono: {
    fontSize: 13,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    color: '#EEEEF8',
  },
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: '#7878DC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  recording: {
    shadowColor: '#E84040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};