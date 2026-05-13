"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeds are in 0..1 space; home/current positions are computed in pixels
// against the live SVG size (kept in sync via ResizeObserver). This keeps
// circles round and the mouse-push field actually circular instead of
// stretched into an ellipse like a fixed square viewBox would produce.
type Seed = { sx: number; sy: number; r: number };
type Node = {
  seed: Seed;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const NODE_COUNT = 64;
const EDGE_THRESHOLD = 110;   // px between home points to draw a connecting edge
const PUSH_RADIUS = 140;      // px — circular push zone around the cursor
const PUSH_STRENGTH = 3.5;    // px / frame at max force
const SPRING = 0.045;
const DAMP = 0.82;

export function HeroGraph() {
  const seeds = useMemo<Seed[]>(() => {
    const rng = mulberry32(7);
    const out: Seed[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      out.push({ sx: rng(), sy: rng(), r: 1.5 + rng() * 2.5 });
    }
    return out;
  }, []);

  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<Node[]>(
    seeds.map((s) => ({ seed: s, hx: 0, hy: 0, x: 0, y: 0, vx: 0, vy: 0 })),
  );
  const edgesRef = useRef<[number, number][]>([]);

  const nodeEls = useRef<(SVGCircleElement | null)[]>([]);
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  // Bump on every resize so the rendered edge <line> list refreshes.
  const [layoutTick, setLayoutTick] = useState(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const recompute = () => {
      const r = svg.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      if (w === 0 || h === 0) return;

      const ns = nodesRef.current;
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const newHx = n.seed.sx * w;
        const newHy = n.seed.sy * h;
        // First measurement seeds current position so nodes don't fly in
        // from (0,0); subsequent resizes only shift the home target —
        // spring will pull each node to its new home smoothly.
        if (n.x === 0 && n.y === 0) {
          n.x = newHx;
          n.y = newHy;
        }
        n.hx = newHx;
        n.hy = newHy;
      }

      const es: [number, number][] = [];
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].hx - ns[j].hx;
          const dy = ns[i].hy - ns[j].hy;
          if (Math.hypot(dx, dy) < EDGE_THRESHOLD) es.push([i, j]);
        }
      }
      edgesRef.current = es;
      setLayoutTick((t) => t + 1);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(svg);

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const tick = () => {
      const ns = nodesRef.current;
      const es = edgesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];

        if (active) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < PUSH_RADIUS && dist > 0.001) {
            const force = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * PUSH_STRENGTH;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
        }

        n.vx += (n.hx - n.x) * SPRING;
        n.vy += (n.hy - n.y) * SPRING;
        n.vx *= DAMP;
        n.vy *= DAMP;
        n.x += n.vx;
        n.y += n.vy;

        const el = nodeEls.current[i];
        if (el) {
          el.setAttribute("cx", String(n.x));
          el.setAttribute("cy", String(n.y));
        }
      }

      for (let i = 0; i < es.length; i++) {
        const [a, b] = es[i];
        const el = edgeEls.current[i];
        if (el) {
          el.setAttribute("x1", String(ns[a].x));
          el.setAttribute("y1", String(ns[a].y));
          el.setAttribute("x2", String(ns[b].x));
          el.setAttribute("y2", String(ns[b].y));
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const ns = nodesRef.current;
  const es = edgesRef.current;
  // `layoutTick` is referenced so React picks up the new edge list. The
  // value itself isn't used.
  void layoutTick;

  return (
    <div className="hero-graph">
      <svg ref={svgRef} width="100%" height="100%">
        <g>
          {es.map(([a, b], i) => (
            <line
              key={`${a}-${b}`}
              ref={(el) => {
                edgeEls.current[i] = el;
              }}
              className="edge"
              x1={ns[a].hx}
              y1={ns[a].hy}
              x2={ns[b].hx}
              y2={ns[b].hy}
            />
          ))}
        </g>
        <g>
          {ns.map((n, i) => (
            <circle
              key={i}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              className="node"
              cx={n.hx}
              cy={n.hy}
              r={n.seed.r}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
