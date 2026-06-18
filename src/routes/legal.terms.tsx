import { createFileRoute, Link } from "@tanstack/react-router";
import { TermsContent } from "@/components/LegalContent";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Nosky HomeOS" }] }),
  component: () => (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <TermsContent />
    </div>
  ),
});
