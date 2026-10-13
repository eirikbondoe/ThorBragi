import { Rig } from "./rig-screen";
import type { JobId } from "@/lib/studio/types";

export function GearGuide({ go }: { go?: (job: JobId) => void; titled?: boolean }) {
  return <Rig go={go} />;
}
