import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AboutContent } from "@/components/LegalContent";

export const Route = createFileRoute("/settings/about")({
  head: () => ({ meta: [{ title: "About — Nosky HomeOS" }] }),
  component: () => (
    <AppShell title="About" subtitle="About Nosky HomeOS">
      <AboutContent />
    </AppShell>
  ),
});
