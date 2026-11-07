import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Motion } from "@/components/Motion";
import { SoundFx } from "@/components/SoundFx";
import { PageTransition, type CurtainLabel } from "@/components/PageTransition";
import { features } from "@/content/projects";
import { site } from "@/content/site";

const display = Fraunces({
  // latin-ext carries the dotted ṣ in "nakṣatra"; its file is only fetched when that glyph is on the page.
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

/** Path → curtain label, for the destination name shown while the page changes. */
const curtainLabels: Record<string, CurtainLabel> = {
  "/": { index: "", title: "Index" },
  "/work": { index: "", title: "Projects" },
  ...Object.fromEntries(features.map((p) => [`/work/${p.slug}`, { index: p.n, title: p.title }])),
};

const curtainHead = `document.documentElement.classList.add('js');try{var s=sessionStorage.getItem('nsv-curtain');if(s){sessionStorage.removeItem('nsv-curtain');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var c=JSON.parse(s),r=document.documentElement;r.style.setProperty('--curtain-i',JSON.stringify(c.index?'Project '+c.index:'Nakshatra S.V'));r.style.setProperty('--curtain-t',JSON.stringify(c.title));r.setAttribute('data-curtain','hold');setTimeout(function(){if(document.documentElement.getAttribute('data-curtain')==='hold')document.documentElement.removeAttribute('data-curtain')},4000)}}}catch(e){}`;

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s — ${site.name}`,
  },
  description:
    "Computer Science and Engineering undergraduate at Sri Shakthi Institute of Engineering and Technology. Case studies of a safety-gated threat-response system, a synthetic-speech detector, a supply-chain console and a database project.",
  authors: [{ name: site.name, url: site.github }],
  openGraph: {
    title: `${site.name} — Portfolio`,
    description:
      "Systems that have to be trusted: safety-gated automation, speech forensics and decision support.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#110D16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* 1) Marks that JS is available so reveal styles never hide content without it.
            2) If we arrived through the page-transition curtain, hold it closed from first paint
               (never under reduced motion; released after 4 s if hydration somehow fails). */}
        <script dangerouslySetInnerHTML={{ __html: curtainHead }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <div className="page">{children}</div>
        <PageTransition labels={curtainLabels} />
        <Motion />
        <SoundFx />
      </body>
    </html>
  );
}
