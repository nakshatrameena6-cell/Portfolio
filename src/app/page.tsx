import { Opening } from "@/components/Opening";
import { WorkTeaser } from "@/components/WorkTeaser";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Opening />
      <WorkTeaser />
      <About />
      <Contact />
    </main>
  );
}
