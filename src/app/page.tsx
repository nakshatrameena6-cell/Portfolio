import { Opening } from "@/components/Opening";
import { Marquee } from "@/components/Marquee";
import { SelectedWork } from "@/components/SelectedWork";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Opening />
      <Marquee />
      <SelectedWork />
      <About />
      <Contact />
    </main>
  );
}
