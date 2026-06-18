import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PrivacyContent } from "@/components/LegalContent";

export const Route = createFileRoute("/settings/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Nosky HomeOS" }] }),
  component: () => (
    <AppShell title="Privacy Policy" subtitle="How Nosky HomeOS handles your data">
      <PrivacyContent />
    </AppShell>
  ),
});
