import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DisclaimerContent } from "@/components/LegalContent";

export const Route = createFileRoute("/settings/disclaimer")({
  head: () => ({ meta: [{ title: "Disclaimer — Nosky HomeOS" }] }),
  component: () => (
    <AppShell title="Disclaimer" subtitle="Important information about Nosky HomeOS">
      <DisclaimerContent />
    </AppShell>
  ),
});
