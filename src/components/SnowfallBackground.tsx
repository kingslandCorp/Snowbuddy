import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  baseX: number;
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  rotation: number;
  spin: number;
  spinBoost: number;
  opacity: number;
  hue: "blue" | "cyan";
}

const FLAKE_COUNT = 42;
const MOUSE_RADIUS = 110;
const PUSH_STRENGTH = 1.6;
const RETURN_EASE = 0.02;
const FRICTION = 0.92;
// A flake caught by the cursor spins fast, then eases back to its normal
// lazy rotation -- decays to ~5% of the boost over roughly 1.5s at 60fps.
const SPIN_BOOST_ON_HIT = 0.3;
const SPIN_DECAY = Math.pow(0.05, 1 / 90);

// The favicon's snowflake mark (viewBox 0-32, center 16,16), as center-relative
// segments so it can be redrawn at any position/scale/rotation on canvas.
const SNOWFLAKE_SEGMENTS: [number, number, number, number][] = [
  [0, -10, 0, 10],
  [-10, 0, 10, 0],
  [-7, -7, 7, 7],
  [7, -7, -7, 7],
  [0, -10, -3, -6.5],
  [0, -10, 3, -6.5],
  [0, 10, -3, 6.5],
  [0, 10, 3, 6.5],
  [-10, 0, -6.5, -3],
  [-10, 0, -6.5, 3],
  [10, 0, 6.5, -3],
  [10, 0, 6.5, 3],
];

function makeFlake(width: number, height: number, y?: number): Flake {
  const x = Math.random() * width;
  return {
    x,
    y: y ?? Math.random() * height,
    baseX: x,
    offsetX: 0,
    offsetY: 0,
    vx: 0,
    vy: 0,
    size: 5 + Math.random() * 6,
    speed: 0.12 + Math.random() * 0.22,
    sway: 12 + Math.random() * 22,
    swaySpeed: 0.004 + Math.random() * 0.008,
    swayOffset: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.006,
    spinBoost: 0,
    opacity: 0.18 + Math.random() * 0.28,
    hue: Math.random() < 0.5 ? "blue" : "cyan",
  };
}

function drawSnowflake(ctx: CanvasRenderingContext2D, f: Flake) {
  ctx.save();
  ctx.translate(f.x, f.y + f.offsetY);
  ctx.rotate(f.rotation);
  const scale = f.size / 10;
  ctx.scale(scale, scale);
  ctx.strokeStyle = f.hue === "blue" ? `rgba(30, 64, 175, ${f.opacity})` : `rgba(6, 182, 212, ${f.opacity})`;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (const [x1, y1, x2, y2] of SNOWFLAKE_SEGMENTS) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * A quiet, full-page drift of snow (the favicon's own snowflake mark) that
 * nudges away from the cursor. Sits fixed behind all content -- decorative,
 * so it never intercepts clicks and pauses itself when the tab isn't visible.
 */
export function SnowfallBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const flakes = Array.from({ length: FLAKE_COUNT }, () => makeFlake(width, height));
    const mouse = { x: -9999, y: -9999 };
    let frame = 0;
    let raf = 0;
    let running = true;

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onVisibilityChange() {
      running = document.visibilityState === "visible";
      if (running) tick();
    }

    function tick() {
      if (!running || !ctx) return;
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      for (const f of flakes) {
        const sway = Math.sin(frame * f.swaySpeed + f.swayOffset) * f.sway;

        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * PUSH_STRENGTH;
          f.vx += (dx / (dist || 1)) * force;
          f.vy += (dy / (dist || 1)) * force;
          f.spinBoost = SPIN_BOOST_ON_HIT * (dx < 0 ? -1 : 1);
        }

        // ease the pushed offset back toward the natural drift path
        f.offsetX += f.vx;
        f.offsetY += f.vy;
        f.vx *= FRICTION;
        f.vy *= FRICTION;
        f.offsetX -= f.offsetX * RETURN_EASE;
        f.offsetY -= f.offsetY * RETURN_EASE;

        f.x = f.baseX + sway + f.offsetX;
        f.y += f.speed;
        f.rotation += f.spin + f.spinBoost;
        f.spinBoost *= SPIN_DECAY;

        if (f.y - f.offsetY > height + 10) {
          const fresh = makeFlake(width, height, -10);
          Object.assign(f, fresh, { y: -10 });
        }

        drawSnowflake(ctx, f);
      }

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
