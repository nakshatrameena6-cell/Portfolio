"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background — coloured liquid refracted through fluted glass.
 *
 * An original WebGL fragment shader (no library) inspired by the "Prismatic Slats"
 * effect: the view is rotated, cut into diagonal slats, and each slat samples a slow
 * domain-warped noise "liquid" through a lens (compressed and mirrored across the
 * slat), with sharp Tomato and Lavender glints on the slat edges.
 *
 * Care taken for the page it sits behind:
 *  - brightness is capped so Lavender text stays readable over it;
 *  - renders at reduced resolution, ~30 fps, only while visible and the tab is active;
 *  - `prefers-reduced-motion` draws a single still frame;
 *  - if WebGL is unavailable the CSS fallback layer (.hero__bg) shows instead.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
float liquid(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.06)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.05, 0.0)));
  return fbm(p + 2.0 * q + vec2(t * 0.035, -t * 0.025));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);

  // rotate into slat space
  float ang = -0.55;
  float cs = cos(ang); float sn = sin(ang);
  vec2 r = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y);

  float w = mix(0.17, 0.25, smoothstep(0.5, 1.6, asp));   // slat width
  float id = floor(r.x / w);
  float u = fract(r.x / w);                                // 0..1 across a slat
  float lens = u - 0.5;

  // each slat shows a wider, mirrored slice of the liquid (fluted-glass refraction)
  float sx = (id + 0.5) * w + lens * w * 2.6;
  vec2 sp = vec2(sx, r.y) * 1.9 + uMouse * 0.35;
  float v = liquid(sp, uTime);

  // palette: deep ink -> violet -> lavender
  vec3 deep   = vec3(0.043, 0.032, 0.075);
  vec3 violet = vec3(0.20, 0.10, 0.46);
  vec3 lav    = vec3(0.40, 0.30, 0.62);
  vec3 col = mix(deep, violet, smoothstep(0.30, 0.62, v));
  col = mix(col, lav, smoothstep(0.58, 0.82, v) * 0.75);
  col += vec3(0.10, 0.07, 0.18) * smoothstep(0.035, 0.0, abs(v - 0.60));   // liquid ridges

  // slat shading: dark seams, brighter centres
  float edge = smoothstep(0.0, 0.10, u) * smoothstep(1.0, 0.90, u);
  float body = 0.55 + 0.65 * (1.0 - lens * lens * 3.0);
  col *= mix(0.25, 1.0, edge) * body;

  // edge glints: Tomato on one side, Lavender on the other
  float g1 = pow(max(0.0, 1.0 - abs(u - 0.10) * 9.0), 3.0);
  float g2 = pow(max(0.0, 1.0 - abs(u - 0.90) * 9.0), 3.0);
  col += vec3(0.62, 0.17, 0.12) * g1 * (0.15 + v) * 0.55;
  col += vec3(0.34, 0.28, 0.52) * g2 * (0.10 + v) * 0.55;

  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;                    // fine grain
  gl_FragColor = vec4(min(col, vec3(0.62, 0.36, 0.64)), 1.0);              // brightness cap
}
`;

export function PrismaticSlats() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

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
    if (!vs || !fs || !prog) return; // CSS fallback stays visible
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
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const T0 = 20; // a pleasing starting phase
    let raf = 0;
    let visible = true;
    let last = 0;
    let t = T0;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const draw = () => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      // ~0.75 CSS px per texel, capped so large screens stay cheap
      let scale = 0.75;
      const px = w * h * scale * scale;
      if (px > 900_000) scale *= Math.sqrt(900_000 / px);
      canvas.width = Math.max(2, Math.round(w * scale));
      canvas.height = Math.max(2, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      draw();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last >= 33) {
        t = T0 + now / 1000;
        mx += (tx - mx) * 0.06;
        my += (ty - my) * 0.06;
        last = now;
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(host);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = 0.5 - (e.clientY - r.top) / r.height;
    };
    if (fine && !reduce) host.addEventListener("pointermove", onMove);
    const onLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", onLost);

    resize();
    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />;
}
