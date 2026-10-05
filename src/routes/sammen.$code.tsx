import { createFileRoute } from "@tanstack/react-router";
import { FollowScreen } from "@/components/studio/lyric-link";

export const Route = createFileRoute("/sammen/$code")({
  component: FollowRoute,
});

function FollowRoute() {
  const { code } = Route.useParams();
  return <FollowScreen code={code} />;
}
