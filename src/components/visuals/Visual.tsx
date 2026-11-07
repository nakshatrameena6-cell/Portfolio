import type { VisualId } from "@/content/types";
import { Gates } from "./Gates";
import { Channels } from "./Channels";
import { Loop } from "./Loop";

export function Visual({ id }: { id: VisualId }) {
  switch (id) {
    case "gates":
      return <Gates />;
    case "channels":
      return <Channels />;
    case "loop":
      return <Loop />;
  }
}
