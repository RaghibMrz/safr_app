const BASE_UNIT = 8;

export const SPACING = {
  none: 0,
  xxs: BASE_UNIT * 0.25, // 2
  xs: BASE_UNIT * 0.5, // 4
  sm: BASE_UNIT, // 8 (base)
  md: BASE_UNIT * 1.5, // 12
  lg: BASE_UNIT * 2, // 16
  xl: BASE_UNIT * 2.5, // 20
  xxl: BASE_UNIT * 3, // 24
  "3xl": BASE_UNIT * 4, // 32
  "4xl": BASE_UNIT * 5, // 40
  "5xl": BASE_UNIT * 6, // 48
};

export type SpacingType = keyof typeof SPACING;
