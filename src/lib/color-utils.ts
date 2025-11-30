/**
 * Convertit une couleur hexadécimale en RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calcule la luminosité relative d'une couleur (0-1)
 * Utilisé pour déterminer si on doit utiliser du texte blanc ou noir
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;

  // Formule de luminosité relative selon WCAG
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Détermine si une couleur est claire (true) ou sombre (false)
 * Utilisé pour choisir la couleur de texte appropriée
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.5;
}

/**
 * Convertit une couleur hex en format OKLCH approximatif
 * Note: C'est une conversion simplifiée, pour une conversion précise,
 * il faudrait utiliser une bibliothèque comme culori
 */
export function hexToOklch(hex: string): string {
  // Pour simplifier, on utilise directement la couleur hex
  // Les navigateurs modernes acceptent les couleurs hex dans les variables CSS
  // Si nécessaire, on peut améliorer avec une vraie conversion OKLCH
  return hex;
}
