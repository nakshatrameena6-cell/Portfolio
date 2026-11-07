import { Dial } from "./Dial";
import { site } from "@/content/site";

/**
 * 02 — About. A typographic treatment instead of a portrait: the dial, cropped,
 * and statements that come from the public profile and from the projects.
 */
export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-h">
      <div className="section about__grid">
        <div className="about__mark" aria-hidden="true">
          <Dial className="about__dial" />
          <p className="about__glyph">S.V</p>
        </div>

        <div className="about__body">
          <header className="folio" data-reveal>
            <span>02</span>
            <h2 id="about-h">About</h2>
          </header>

          <p className="about__lede" data-reveal>
            {site.firstName} is pursuing a BE in Computer Science and Engineering at {site.institution}. The
            work centres on <em>building AI-assisted tools for education</em>.
          </p>

          <div className="about__cols">
            <div data-reveal>
              <h3>Two threads in the projects</h3>
              <p>
                <b>Tools for classrooms.</b> Attendance trackers, a task tracker, an OCR summariser, a grader, an
                invigilation dashboard, a placement-aptitude drill.
              </p>
              <p>
                <b>Systems that show their evidence.</b> Suraksha keeps an audit trail and asks for human approval;
                MedEx puts a reviewer in front of every transfer; PandaMIND returns the evidence behind each verdict.
              </p>
            </div>

            <div data-reveal style={{ ["--d" as string]: 2 }}>
              <h3>Working with others</h3>
              <p>
                PandaMIND, MedEx and ExamEye were built with teammates, and each says so on its page.
              </p>
              <h3>Currently exploring</h3>
              <p>
                GradeMIND (OCR → LLM evaluation → feedback) · attendance tracker with teacher sign-in and CSV imports
                · evaluating answers without ground-truth keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
