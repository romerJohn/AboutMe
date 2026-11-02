export interface TiltValues {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

/**
 * Calculates 3D perspective rotation angles and specular glare position
 * based on mouse coordinates relative to the element bounding rectangle.
 */
export function calculateTilt(
  x: number,
  y: number,
  width: number,
  height: number,
  maxTiltAngle: number = 12
): TiltValues {
  if (width <= 0 || height <= 0) {
    return {
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50
    };
  }

  // Constrain coordinates within bounding box
  const clampedX = Math.max(0, Math.min(x, width));
  const clampedY = Math.max(0, Math.min(y, height));

  // Normalized offsets between -0.5 and 0.5
  const normalizedX = clampedX / width - 0.5;
  const normalizedY = clampedY / height - 0.5;

  // Negative rotateX produces natural inward tilt when top is hovered
  const rotateX = Number((-normalizedY * maxTiltAngle * 2).toFixed(2));
  const rotateY = Number((normalizedX * maxTiltAngle * 2).toFixed(2));

  // Specular glare percentage from 0% to 100%
  const glareX = Number(((clampedX / width) * 100).toFixed(1));
  const glareY = Number(((clampedY / height) * 100).toFixed(1));

  return {
    rotateX,
    rotateY,
    glareX,
    glareY
  };
}
