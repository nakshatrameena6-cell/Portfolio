import Image from "next/image";
import { site } from "@/content/site";

/**
 * About. One large statement, then a short working note beside a portrait.
 */
export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-h">
      <div className="section about__inner">
        <h2 id="about-h" className="sr-only">
          About
        </h2>

        <p className="about__lede" data-reveal>
          I&apos;m a computer science student at {site.institution}. I like building{" "}
          <em>AI-assisted tools for education</em>, and software that shows its evidence before it asks to be trusted.
        </p>

        <div className="about__grid">
          <div className="about__text" data-reveal>
            <p>
              <b>For classrooms:</b> attendance trackers, a task tracker, an OCR summariser, a grader, an invigilation
              dashboard and a placement-aptitude drill.
            </p>
            <p>
              <b>With evidence:</b> Suraksha keeps an audit trail and asks a person before the risky step. MedEx puts a
              reviewer in front of every transfer. PandaMIND returns the evidence behind each verdict.
            </p>
            <p>
              <b>With others:</b> PandaMIND, MedEx and ExamEye were built in teams, and each page says so.
            </p>
            <p>
              <b>Now:</b> GradeMIND (OCR, then LLM evaluation, then feedback), an attendance tracker with teacher
              sign-in and CSV imports, and ways to evaluate answers without ground-truth keys.
            </p>
          </div>

          <figure className="about__photo" data-reveal style={{ ["--d" as string]: 2 }}>
            <Image
              src="/portrait.webp"
              alt="Portrait of Nakshatra S.V, smiling, in a denim jacket against a teal wall."
              width={960}
              height={1200}
              sizes="(min-width: 900px) 30vw, 100vw"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
