import { useEffect, useRef } from "react";

const MAX_DPR = 2;
const MOBILE_BREAKPOINT = 768;
const MOBILE_DENSITY = 10500;
const DESKTOP_DENSITY = 13000;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getParticleCount = (width, height) => {
  const density = width < MOBILE_BREAKPOINT ? MOBILE_DENSITY : DESKTOP_DENSITY;
  const count = Math.floor((width * height) / density);
  return clamp(count, 35, 95);
};

const createParticle = (width, height, withRandomY = false) => {
  const speedMagnitude = 0.18 + Math.random() * 0.55;
  const direction = Math.random() > 0.5 ? 1 : -1;

  return {
    x: Math.random() * width,
    y: withRandomY ? Math.random() * height : direction > 0 ? -12 : height + 12,
    r: 0.9 + Math.random() * 2,
    vy: speedMagnitude * direction,
    drift: 0.45 + Math.random() * 1.15,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.18 + Math.random() * 0.5,
    twinkle: 0.5 + Math.random() * 1.2,
  };
};

const respawnParticle = (particle, width, height) => {
  const next = createParticle(width, height);
  particle.x = next.x;
  particle.y = next.y;
  particle.r = next.r;
  particle.vy = next.vy;
  particle.drift = next.drift;
  particle.phase = next.phase;
  particle.alpha = next.alpha;
  particle.twinkle = next.twinkle;
};

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = 0;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: getParticleCount(width, height) }, () =>
        createParticle(width, height, true),
      );
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      const motionAllowed = !reducedMotionQuery.matches;
      const timeScale = time * 0.001;

      for (const particle of particles) {
        if (motionAllowed) {
          particle.y += particle.vy;
          particle.x +=
            Math.sin(timeScale * particle.drift + particle.phase) * 0.1;
          particle.vy += (Math.random() - 0.5) * 0.002;
          particle.vy = clamp(particle.vy, -0.85, 0.85);

          if (
            particle.y < -20 ||
            particle.y > height + 20 ||
            particle.x < -30 ||
            particle.x > width + 30
          ) {
            respawnParticle(particle, width, height);
          }
        }

        const pulse =
          0.72 + Math.sin(timeScale * particle.twinkle + particle.phase) * 0.28;
        const alpha = clamp(particle.alpha * pulse, 0.08, 0.92);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (motionAllowed) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      frameId = 0;

      if (reducedMotionQuery.matches) {
        render(performance.now());
      } else {
        frameId = window.requestAnimationFrame(render);
      }
    };

    resizeCanvas();
    start();

    const handleMotionPreferenceChange = () => {
      start();
    };

    window.addEventListener("resize", resizeCanvas);
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      reducedMotionQuery.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    };
  }, []);

  return (
    <canvas
      className="particle-background"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}

export default ParticleBackground;
