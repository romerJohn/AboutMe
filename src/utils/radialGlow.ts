export interface RadialGlowConfig {
  color?: string;
  radius?: number;
  falloffPercent?: number;
}

export interface RadialGlowResult {
  x: number;
  y: number;
  background: string;
}

/**
 * Calculates a mouse-tracking radial glow gradient based on element coordinates.
 */
export function calculateRadialGlow(
  x: number,
  y: number,
  width: number,
  height: number,
  config: RadialGlowConfig = {}
): RadialGlowResult {
  const {
    color = 'rgba(0, 229, 255, 0.15)',
    radius = 380,
    falloffPercent = 65
  } = config;

  const validWidth = Math.max(0, width);
  const validHeight = Math.max(0, height);

  // Constrain coordinates within card boundaries
  const clampedX = Math.max(0, Math.min(x, validWidth));
  const clampedY = Math.max(0, Math.min(y, validHeight));

  return {
    x: clampedX,
    y: clampedY,
    background: `radial-gradient(${radius}px circle at ${clampedX}px ${clampedY}px, ${color}, transparent ${falloffPercent}%)`
  };
}
