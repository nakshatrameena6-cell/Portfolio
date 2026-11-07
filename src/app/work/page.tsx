import type { Metadata } from "next";
import { Work } from "@/components/Work";
import { Also } from "@/components/Also";
import { Instruments } from "@/components/Instruments";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Four case studies, a handful of smaller builds, and the technologies behind them: a safety-gated threat-response system, a synthetic-speech detector, a supply-chain console and a database project.",
};

export default function Projects() {
  return (
    <>
      <main id="main" className="projects">
        <header className="section projects__head">
          <a href="/" className="case__back">
            <span aria-hidden="true">←</span> Home
          </a>
          <p className="stage__meta">
            <span className="stage__n">→</span>
            <span>All projects</span>
          </p>
          <h1 className="case__title">Projects</h1>
          <p className="case__kicker">Four case studies, the smaller builds, and what each was made with.</p>
          <nav className="projects__jump" aria-label="On this page">
            <a href="#selected">Selected work</a>
            <a href="#also">Also built</a>
            <a href="#instruments">Instruments</a>
          </nav>
        </header>

        <Work n="01" />
        <Also n="02" />
        <Instruments n="03" />
      </main>
      <Contact />
    </>
  );
}
