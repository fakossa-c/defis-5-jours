import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  ensureContrast,
  generateAccentLight,
  generateAccentDark,
} from '../utils';

describe('hexToRgb', () => {
  it('convertit un hex valide en RGB', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('gère le hex minuscule', () => {
    expect(hexToRgb('#ff6347')).toEqual({ r: 255, g: 99, b: 71 });
  });

  it('retourne noir pour un format invalide', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#FFF')).toEqual({ r: 0, g: 0, b: 0 }); // shorthand non supporté
    expect(hexToRgb('')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('relativeLuminance', () => {
  it('calcule la luminance du blanc à ~1', () => {
    const lum = relativeLuminance(255, 255, 255);
    expect(lum).toBeCloseTo(1, 2);
  });

  it('calcule la luminance du noir à 0', () => {
    const lum = relativeLuminance(0, 0, 0);
    expect(lum).toBe(0);
  });

  it('rouge pur a une luminance autour de 0.2126', () => {
    const lum = relativeLuminance(255, 0, 0);
    expect(lum).toBeCloseTo(0.2126, 3);
  });
});

describe('contrastRatio', () => {
  it('noir sur blanc = 21:1', () => {
    const ratio = contrastRatio('#000000', '#FFFFFF');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('blanc sur blanc = 1:1', () => {
    const ratio = contrastRatio('#FFFFFF', '#FFFFFF');
    expect(ratio).toBeCloseTo(1, 1);
  });

  it('est symétrique', () => {
    const ratio1 = contrastRatio('#4B5EAA', '#FFFDF9');
    const ratio2 = contrastRatio('#FFFDF9', '#4B5EAA');
    expect(ratio1).toBeCloseTo(ratio2, 5);
  });
});

describe('ensureContrast', () => {
  const CREAM_BG = '#FFFDF9';

  it('retourne la couleur inchangée si le contraste est suffisant', () => {
    // Noir sur crème = contraste très élevé
    expect(ensureContrast('#000000', CREAM_BG)).toBe('#000000');
  });

  it('assombrit une couleur claire pour atteindre 4.5:1', () => {
    // Jaune vif #FFFF00 sur crème = très faible contraste
    const adjusted = ensureContrast('#FFFF00', CREAM_BG);
    expect(adjusted).not.toBe('#FFFF00');
    const ratio = contrastRatio(adjusted, CREAM_BG);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('assombrit le fallback coral #F96743', () => {
    const adjusted = ensureContrast('#F96743', CREAM_BG);
    const ratio = contrastRatio(adjusted, CREAM_BG);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('retourne noir en dernier recours', () => {
    // Blanc pur sur fond quasi-blanc — devra assombrir jusqu'au noir
    const adjusted = ensureContrast('#FFFDF9', '#FFFDF9');
    const ratio = contrastRatio(adjusted, '#FFFDF9');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('generateAccentLight', () => {
  it('génère rgba avec 10% opacité', () => {
    expect(generateAccentLight('#F96743')).toBe('rgba(249, 103, 67, 0.1)');
  });

  it('fonctionne avec du bleu', () => {
    expect(generateAccentLight('#4B5EAA')).toBe('rgba(75, 94, 170, 0.1)');
  });
});

describe('generateAccentDark', () => {
  it('retourne une couleur plus sombre que l\'originale', () => {
    const original = '#F96743';
    const dark = generateAccentDark(original);
    // La version dark devrait avoir une luminance plus faible
    const origRgb = hexToRgb(original);
    const darkRgb = hexToRgb(dark);
    const origLum = relativeLuminance(origRgb.r, origRgb.g, origRgb.b);
    const darkLum = relativeLuminance(darkRgb.r, darkRgb.g, darkRgb.b);
    expect(darkLum).toBeLessThan(origLum);
  });

  it('ne retourne pas la même couleur', () => {
    expect(generateAccentDark('#4B5EAA')).not.toBe('#4B5EAA');
  });
});
