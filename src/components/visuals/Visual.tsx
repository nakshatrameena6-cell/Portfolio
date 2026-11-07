import type { VisualId } from "@/content/types";
import { Gates } from "./Gates";
import { Channels } from "./Channels";
import { Loop } from "./Loop";
import { Plate } from "./Plate";

export function Visual({ id, compact }: { id: VisualId; compact?: boolean }) {
  switch (id) {
    case "gates":
      return <Gates />;
    case "channels":
      return <Channels />;
    case "loop":
      return <Loop />;
    case "schema":
      return <Plate compact={compact} />;
  }
}
