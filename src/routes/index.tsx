import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/studio/home-screen";

export const Route = createFileRoute("/")({ component: HomeScreen });
