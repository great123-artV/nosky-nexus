import { createFileRoute } from "@tanstack/react-router";
import { ZonesList } from "./zones";

export const Route = createFileRoute("/zones/")({
  component: ZonesList,
});
