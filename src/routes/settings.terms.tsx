import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TermsContent } from "@/components/LegalContent";

export const Route = createFileRoute("/settings/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Nosky HomeOS" }] }),
  component: () => (
    <AppShell title="Terms of Service" subtitle="Using Nosky HomeOS">
      <TermsContent />
    </AppShell>
  ),
});
