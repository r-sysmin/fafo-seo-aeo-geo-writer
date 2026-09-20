import { Logo } from "@/components/base/logo";

export function FooterSection() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo className="text-base" />
          <p className="text-sm text-muted-foreground">Built with Lovable</p>
        </div>
      </div>
    </footer>
  );
}
