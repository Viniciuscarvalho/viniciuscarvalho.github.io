export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Semi-implicit integration, bounded dt and substeps keep input stalls stable.
export function spring(state, target, seconds, stiffness = 120, damping = 20) {
  let x = state.x, velocity = state.velocity;
  const dt = clamp(seconds, 0, 0.05);
  for (let i = 0; i < 4; i++) {
    velocity += ((target - x) * stiffness - velocity * damping) * dt / 4;
    x += velocity * dt / 4;
  }
  return { x, velocity };
}

export function createQualityMonitor({ lowFps = 40, samples = 90 } = {}) {
  let slow = 0, degraded = false;
  return {
    sample(milliseconds) {
      if (!Number.isFinite(milliseconds) || milliseconds <= 0) return degraded;
      slow = milliseconds > 1000 / lowFps ? slow + 1 : Math.max(0, slow - 2);
      if (slow >= samples) degraded = true;
      return degraded;
    },
    reset() { slow = 0; },
  };
}

export function projectPose(progress, count) {
  if (count < 1) return { index: 0, next: 0, cut: 0 };
  const position = clamp(progress) * Math.max(0, count - 1);
  const index = Math.floor(position);
  return { index, next: Math.min(index + 1, count - 1), cut: position - index };
}
