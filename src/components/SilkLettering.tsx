"use client";

import { useEffect, useRef } from "react";
import { sfx } from "@/lib/sound";

/**
 * The name as silk. An original WebGL implementation of the *behaviour* of a
 * "headline cut from silk": it keeps billowing in a slow breeze, ripples where the
 * pointer moves (stronger the faster you move), puffs up where you click or tap,
 * and lays itself down along a slanted edge when it first appears.
 *
 * How it works
 *  - The real DOM name stays in the page (accessible, and the layout reference).
 *    A mask of the same letters is drawn on a 2D canvas, fitted to each syllable.
 *  - A fragment shader builds an analytic height field — travelling breeze waves
 *    plus up to 12 decaying ring-wave "gusts" — takes its gradient as a surface
 *    normal, shades it as satin (diffuse + two sheen lobes + a shot-silk tint at
 *    grazing angles) and warps the mask through the slope so letter edges ripple.
 *  - Quality guards: capped resolution, paused when off-screen or the tab is hidden,
 *    a single still frame for `prefers-reduced-motion`, and the DOM text is restored
 *    if WebGL is unavailable.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uMask;
uniform vec2 uRes;      // canvas pixels
uniform vec2 uSize;     // canvas CSS pixels
uniform float uFs;      // font size, CSS px (1 "unit" below)
uniform float uTime;
uniform float uIntro;   // 0..1, 1 = fully laid down
uniform vec4 uG[12];    // gusts: x, y (units), start time, amplitude

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// the breeze: long swells travelling left to right with some irregularity
float windH(vec2 p, float t){
  float h = 0.0;
  h += 0.020 * sin(p.x * 2.2 - t * 0.9 + 0.8 * sin(p.y * 1.3 + t * 0.35));
  h += 0.012 * sin(p.x * 4.1 + p.y * 1.7 - t * 1.35);
  h += 0.008 * sin(p.x * 7.3 - p.y * 2.3 - t * 2.1 + 1.7);
  h += 0.010 * (noise(p * vec2(2.0, 3.0) + vec2(-t * 0.35, t * 0.12)) - 0.5);
  return h;
}

// pointer gusts and click puffs: an expanding ring wave plus a bump that rings down
float gustH(vec2 p, float t){
  float h = 0.0;
  for (int i = 0; i < 12; i++) {
    vec4 g = uG[i];
    if (g.w > 0.0005) {
      float dt = t - g.z;
      if (dt > 0.0 && dt < 6.0) {
        float r = length(p - g.xy);
        float front = r - 1.6 * dt;
        float env = g.w * exp(-dt * 1.25);
        float ring = exp(-front * front / (0.20 + 0.16 * dt)) * cos(10.5 * front) * exp(-r * 0.55);
        float bump = exp(-r * r / 0.30) * cos(dt * 7.5) * exp(-dt * 1.7);
        h += env * (0.85 * ring + 0.75 * bump);
      }
    }
  }
  return h * 0.04;
}

float H(vec2 p, float t){ return windH(p, t) + gustH(p, t); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv * uSize) / uFs;
  float t = uTime;

  float e = 0.012;
  float h0 = H(p, t);
  vec2 grad = vec2(H(p + vec2(e, 0.0), t) - h0, H(p + vec2(0.0, e), t) - h0) / e;

  // intro: the silk lays itself down from the wind side along a slanted edge
  float W = uSize.x / uFs;
  float s = p.x + 0.45 * (p.y - 0.5 * uSize.y / uFs);
  float front = mix(-1.4, W + 1.6, uIntro);
  float reveal = 1.0 - smoothstep(front - 1.0, front, s);
  float lifted = 1.0 - reveal;
  grad.y += lifted * 0.5;

  // the letters ripple with the fabric
  vec2 tuv = uv - grad * uFs * 0.11 / uSize;
  float a = texture2D(uMask, tuv).a * reveal;
  if (a < 0.002) { gl_FragColor = vec4(0.0); return; }

  // satin shading
  vec3 n = normalize(vec3(-grad * 2.3, 1.0));
  float ang = -0.61 + 0.30 * sin(t * 0.15);                 // light from upper left, slowly drifting
  vec3 l = normalize(vec3(sin(ang) * 0.9, cos(ang) * 0.8, 0.7));
  float diff = dot(n, l) * 0.5 + 0.5;

  vec3 shadow = vec3(0.42, 0.32, 0.78);                     // violet folds
  vec3 silk   = vec3(0.80, 0.70, 0.91);                     // lavender silk
  vec3 sheen  = vec3(1.00, 0.93, 0.99);                     // pale satin highlight
  vec3 tint   = vec3(1.00, 0.56, 0.52);                     // shot-silk tint (tomato-pink)

  vec3 col = mix(shadow, silk, smoothstep(0.22, 0.95, diff));
  vec3 hv = normalize(l + vec3(0.0, 0.0, 1.0));
  float nh = max(dot(n, hv), 0.0);
  col += sheen * (0.30 * pow(nh, 22.0) + 0.55 * pow(nh, 90.0));
  float fres = pow(1.0 - n.z, 1.7);
  col = mix(col, tint, clamp(fres * 0.9, 0.0, 0.55) * 0.5);
  col += (noise(vec2(p.x * 42.0, p.y * 3.0)) - 0.5) * 0.03;  // fine weave
  col += lifted * 0.12;
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col * a, a);
}
`;

const MAX_GUSTS = 12;
const BLEED = 72; // CSS px the canvas extends past the name so ripples are not clipped

export function SilkLettering() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const h1 = canvas?.parentElement;
    const stage = h1?.closest<HTMLElement>(".open") ?? h1;
    if (!canvas || !h1 || !stage) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return; // the DOM name stays visible

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      mask: gl.getUniformLocation(prog, "uMask"),
      res: gl.getUniformLocation(prog, "uRes"),
      size: gl.getUniformLocation(prog, "uSize"),
      fs: gl.getUniformLocation(prog, "uFs"),
      time: gl.getUniformLocation(prog, "uTime"),
      intro: gl.getUniformLocation(prog, "uIntro"),
      g: gl.getUniformLocation(prog, "uG"),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u.mask, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const gusts = new Float32Array(MAX_GUSTS * 4);
    let gi = 0;
    let fontPx = 200;
    let cssW = 1;
    let cssH = 1;
    let ready = false;
    let visible = true;
    let raf = 0;
    let t0 = performance.now();
    let introStart = -1; // ms, or -1 until the intro begins
    let disposed = false;

    const clock = () => (reduce ? 3.5 : (performance.now() - t0) / 1000 + 3);

    const draw = () => {
      if (!ready) return;
      const now = performance.now();
      let intro = 1;
      if (!reduce) {
        if (introStart < 0) intro = 0;
        else {
          const p = Math.min(1, (now - introStart) / 1800);
          intro = 1 - Math.pow(1 - p, 3);
        }
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.time, clock());
      gl.uniform1f(u.intro, intro);
      gl.uniform4fv(u.g, gusts);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* Mask: the letters drawn on a 2D canvas, each syllable fitted to its DOM box. */
    const build = () => {
      const hr = h1.getBoundingClientRect();
      if (!hr.width || !hr.height) return;
      cssW = hr.width + BLEED * 2;
      cssH = hr.height + BLEED * 2;
      canvas.style.left = `${-BLEED}px`;
      canvas.style.top = `${-BLEED}px`;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      let scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const px = cssW * cssH * scale * scale;
      if (px > 2_200_000) scale *= Math.sqrt(2_200_000 / px);
      canvas.width = Math.max(2, Math.round(cssW * scale));
      canvas.height = Math.max(2, Math.round(cssH * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);

      const m = document.createElement("canvas");
      m.width = canvas.width;
      m.height = canvas.height;
      const ctx = m.getContext("2d");
      if (!ctx) return;
      const family = getComputedStyle(h1).fontFamily;
      const syl = Array.from(h1.querySelectorAll<HTMLElement>(".open__syl"));
      if (!syl.length) return;

      ctx.font = `700 100px ${family}`;
      const fits = syl.map((el) => {
        const r = el.getBoundingClientRect();
        const txt = el.textContent ?? "";
        const w = ctx.measureText(txt).width || 1;
        return { r, txt, fs: (100 * r.width) / w };
      });
      const sorted = fits.map((f) => f.fs).sort((a, b) => a - b);
      fontPx = sorted[Math.floor(sorted.length / 2)] ?? 200;

      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.font = `700 ${fontPx * scale}px ${family}`;
      for (const f of fits) {
        const mt = ctx.measureText(f.txt);
        const cx = (f.r.left + f.r.width / 2 - hr.left + BLEED) * scale;
        const cy = (f.r.top + f.r.height / 2 - hr.top + BLEED) * scale;
        ctx.fillText(f.txt, cx, cy + (mt.actualBoundingBoxAscent - mt.actualBoundingBoxDescent) / 2);
      }

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform2f(u.size, cssW, cssH);
      gl.uniform1f(u.fs, fontPx);
      ready = true;
      h1.classList.add("silk-on");
      draw();
    };

    /* Loop: only while visible and the tab is active. */
    const frame = () => {
      raf = 0;
      if (!visible || document.hidden || disposed) return;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden || !ready) return;
      raf = requestAnimationFrame(frame);
    };

    /* Gusts */
    const spawn = (xUnits: number, yUnits: number, amp: number) => {
      const o = gi * 4;
      gusts[o] = xUnits;
      gusts[o + 1] = yUnits;
      gusts[o + 2] = clock();
      gusts[o + 3] = amp;
      gi = (gi + 1) % MAX_GUSTS;
    };
    const toUnits = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return null;
      return { x: x / fontPx, y: (r.height - y) / fontPx };
    };
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let carried = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduce) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(1, now - lastT);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      if (dt > 200) return; // first move after a pause
      carried += dist;
      if (carried < fontPx * 0.12) return;
      carried = 0;
      const p = toUnits(e);
      if (!p) return;
      const speed = (dist / dt) * 1000; // px per second
      const amp = Math.min(1.1, Math.max(0.12, speed / (fontPx * 6)));
      spawn(p.x, p.y, amp);
      sfx.ripple(amp);
    };
    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      if ((e.target as Element | null)?.closest?.("a, button")) return;
      const p = toUnits(e);
      if (p) {
        spawn(p.x, p.y, 1.5);
        sfx.splash();
      }
    };
    if (fine && !reduce) stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);

    /* Lifecycle */
    const ro = new ResizeObserver(() => build());
    ro.observe(h1);
    const io = new IntersectionObserver(([en]) => {
      visible = !!en?.isIntersecting;
      if (visible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(stage);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", onLost);

    // Wait for the web font and for the page-change curtain (if any) before the intro.
    const root = document.documentElement;
    const curtainGone = new Promise<void>((res) => {
      if (root.dataset.curtain !== "hold") return res();
      const mo = new MutationObserver(() => {
        if (root.dataset.curtain !== "hold") {
          mo.disconnect();
          res();
        }
      });
      mo.observe(root, { attributes: true, attributeFilter: ["data-curtain"] });
      window.setTimeout(() => {
        mo.disconnect();
        res();
      }, 3000);
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([fontsReady, curtainGone]).then(() => {
      if (disposed) return;
      build();
      introStart = performance.now();
      t0 = introStart;
      start();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      h1.classList.remove("silk-on");
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="silk" aria-hidden="true" />;
}
