import { createFileRoute } from "@tanstack/react-router";
import { StudioScreen } from "@/components/studio/studio-screen";

export const Route = createFileRoute("/sang/$id")({
  component: SongRoute,
});

function SongRoute() {
  const { id } = Route.useParams();
  return <StudioScreen id={id} />;
}
