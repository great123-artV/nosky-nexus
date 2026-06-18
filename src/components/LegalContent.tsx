import type { ReactNode } from "react";

export function LegalShell({
  title,
  effective,
  children,
}: {
  title: string;
  effective?: string;
  children: ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-12 space-y-6">
      <header className="pb-6 border-b border-border">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient">{title}</h1>
        {effective && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
            Effective: {effective}
          </p>
        )}
      </header>
      <div className="prose-legal space-y-6 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
      <footer className="pt-6 border-t border-border text-[11px] text-muted-foreground/70">
        Powered by <span className="text-foreground font-medium">Nosky Tech</span>
      </footer>
    </article>
  );
}

export function PrivacyContent() {
  return (
    <LegalShell title="Privacy Policy" effective={new Date().toLocaleDateString()}>
      <p>Nosky HomeOS respects user privacy and is committed to protecting user information.</p>
      <Section title="Information We Collect">
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Account information</li>
          <li>Device preferences</li>
          <li>Home configuration data</li>
        </ul>
      </Section>
      <Section title="How We Use Information">
        <ul>
          <li>Provide smart home services</li>
          <li>Personalize the user experience</li>
          <li>Maintain account security</li>
          <li>Improve the application</li>
        </ul>
      </Section>
      <Section title="Data Protection">
        <p>
          We implement security practices to protect user information. We do not sell personal user
          information.
        </p>
      </Section>
      <Section title="User Rights">
        <ul>
          <li>Access their account information</li>
          <li>Update profile information</li>
          <li>Request account deletion</li>
        </ul>
      </Section>
      <Section title="Contact">
        <p>Nosky Tech — support@noskytech.com</p>
      </Section>
    </LegalShell>
  );
}

export function TermsContent() {
  return (
    <LegalShell title="Terms of Service" effective={new Date().toLocaleDateString()}>
      <Section title="Acceptable Use">
        <p>
          You agree to use Nosky HomeOS only for lawful purposes related to managing your own
          smart-home installation. You may not interfere with other users, the service, or connected
          devices you do not own.
        </p>
      </Section>
      <Section title="Account Responsibility">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          all activity occurring under your account.
        </p>
      </Section>
      <Section title="Service Availability">
        <p>
          Nosky HomeOS is provided "as is" and may experience downtime for maintenance, network
          issues, or factors outside Nosky Tech's control.
        </p>
      </Section>
      <Section title="Updates">
        <p>
          We may update, enhance, or remove features at any time to improve the product or maintain
          security.
        </p>
      </Section>
      <Section title="Termination">
        <p>
          We may suspend or terminate accounts that violate these terms or pose a risk to other
          users or connected systems.
        </p>
      </Section>
    </LegalShell>
  );
}

export function DisclaimerContent() {
  return (
    <LegalShell title="Disclaimer">
      <p>
        Nosky HomeOS is designed to provide smart home monitoring and control features. Device
        availability, automation performance, and hardware compatibility depend on the connected
        devices and installation environment.
      </p>
      <Section title="Nosky Tech is not responsible for">
        <ul>
          <li>Improper hardware installation</li>
          <li>Electrical faults</li>
          <li>Third-party device failures</li>
          <li>Network interruptions</li>
        </ul>
      </Section>
      <p>Users should ensure smart devices are installed and maintained properly.</p>
    </LegalShell>
  );
}

export function AboutContent() {
  return (
    <LegalShell title="About Nosky HomeOS">
      <p>
        Nosky HomeOS is a smart home operating system developed by Nosky Tech. It provides
        intelligent control and monitoring of connected home devices including lighting, climate
        systems, power management, and automation.
      </p>
      <p>
        Our goal is to create a seamless smart living experience where technology works naturally
        around everyday life.
      </p>
      <Section title="Developed By">
        <p>
          <strong className="text-foreground">Nosky Tech</strong> — Smart Automation Solutions
        </p>
      </Section>
      <Section title="Version">
        <p>Nosky HomeOS v1.0</p>
      </Section>
      <Section title="Features">
        <ul>
          <li>Smart Device Control</li>
          <li>Zone-Based Home Management</li>
          <li>Smart Scenes</li>
          <li>Energy Monitoring</li>
          <li>Inverter Monitoring</li>
          <li>Future IoT Integration</li>
        </ul>
      </Section>
    </LegalShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">{children}</div>
    </section>
  );
}
