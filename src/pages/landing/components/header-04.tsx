import { useEffect, useState } from "react";
import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/base/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Logo } from "@/components/base/logo";
import { cn } from "@/lib/utils";

export function Header04() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <div
          className={cn(
            "mx-auto max-w-page rounded-2xl px-6 transition-[background-color,box-shadow,backdrop-filter] duration-200",
            scrolled
              ? "bg-card/75 ring-1 ring-border shadow-md shadow-black/[0.065] backdrop-blur-xl"
              : "bg-transparent ring-0 shadow-none",
          )}
        >
          <div className="relative flex items-center justify-between h-14">
            <Logo />

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-3 lg:flex">
              <Button asChild variant="ghost" size="sm" className="h-8 rounded-md px-3 text-xs">
                <a href="/auth?intent=signin">Sign in</a>
              </Button>
              <Button asChild size="sm" className="h-8 px-3 text-xs">
                <a href="/auth?intent=signup">Get started</a>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="-mr-2.5"
                  >
                    <IconMenu2 className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                    <a
                      href="/auth?intent=signin"
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Sign in
                    </a>
                    <Button asChild className="mt-4">
                      <a href="/auth?intent=signup">Get started</a>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div aria-hidden className="h-20" />
    </header>
  );
}
