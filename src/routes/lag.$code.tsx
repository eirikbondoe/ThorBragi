import { createFileRoute } from "@tanstack/react-router";
import { OverlayScreen } from "@/components/studio/overlay-screen";

export const Route = createFileRoute("/lag/$code")({
  component: LagRoute,
});

function LagRoute() {
  const { code } = Route.useParams();
  return <OverlayScreen code={code} />;
}
