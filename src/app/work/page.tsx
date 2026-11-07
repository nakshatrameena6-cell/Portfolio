import type { Metadata } from "next";
import { Gallery, MoreBuilds, Toolbox } from "@/components/Gallery";
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
          <h1 className="projects__h">Projects</h1>
          <p className="projects__line">
            Four in depth, each with its own write-up. Then the smaller builds and the tools behind them.
          </p>
        </header>

        <Gallery />
        <MoreBuilds />
        <Toolbox />
      </main>
      <Contact />
    </>
  );
}
