import { vars } from 'nativewind';

export const lightTheme = vars({
  '--radius': '12',

  '--background': '255 255 255',
  '--foreground': '31 41 55',

  '--card': '255 255 255',
  '--card-foreground': '31 41 55',

  // Dating app primary color - romantic coral/pink
  '--primary': '239 90 111', // #EF5A6F
  '--primary-foreground': '255 255 255',

  '--secondary': '249 250 251',
  '--secondary-foreground': '31 41 55',

  '--muted': '249 250 251',
  '--muted-foreground': '107 114 128',

  '--accent': '254 242 242',
  '--accent-foreground': '239 90 111',

  '--destructive': '239 68 68',

  '--border': '229 231 235',
  '--input': '229 231 235',
  '--ring': '239 90 111',

  '--chart-1': '239 90 111',
  '--chart-2': '251 146 60',
  '--chart-3': '139 92 246',
  '--chart-4': '236 72 153',
  '--chart-5': '14 165 233',
});

export const darkTheme = vars({
  '--radius': '12',

  '--background': '17 24 39',
  '--foreground': '249 250 251',

  '--card': '31 41 55',
  '--card-foreground': '249 250 251',

  '--primary': '251 113 133', // Lighter pink for dark mode
  '--primary-foreground': '17 24 39',

  '--secondary': '55 65 81',
  '--secondary-foreground': '249 250 251',

  '--muted': '55 65 81',
  '--muted-foreground': '156 163 175',

  '--accent': '55 65 81',
  '--accent-foreground': '251 113 133',

  '--destructive': '248 113 113',

  '--border': '55 65 81',
  '--input': '55 65 81',
  '--ring': '251 113 133',

  '--chart-1': '251 113 133',
  '--chart-2': '251 146 60',
  '--chart-3': '167 139 250',
  '--chart-4': '244 114 182',
  '--chart-5': '56 189 248',
});