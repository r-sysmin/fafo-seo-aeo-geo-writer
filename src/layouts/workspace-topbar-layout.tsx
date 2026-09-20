import { Outlet, Link, useNavigate } from "react-router-dom";
import { IconLogout, IconX } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-provider";
import { EXIT_DEMO_ROUTE, useIsDemo } from "@/lib/demo";

/**
 * The workspace shell, mounted by BOTH route trees — `/demo/*` (seed data, no auth)
 * and the protected `/*` (Supabase data).
 *
 * Because it is shared, the leave affordance has to be route-aware, and `useIsDemo()`
 * (`src/lib/demo.ts`) is the ONE thing that decides it — never re-derive demo-ness from
 * the pathname here. Authenticated shows "Sign out"; the demo has no session, so it
 * shows "Exit demo", a plain navigation to EXIT_DEMO_ROUTE. See docs/design/auth.md.
 */
export default function WorkspaceTopbarLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isDemo = useIsDemo();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email ||
    "Account";
  const initial = (displayName[0] || "?").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen flex-col bg-muted">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-6">
        <Link
          to={isDemo ? "/demo/pages" : "/pages"}
          className="font-heading text-[18px] font-semibold leading-6 tracking-tight text-foreground"
        >
          Meta description generator
        </Link>

        {/* The demo has no session, so "Sign out" would be meaningless — and with the
            account menu hidden the visitor had no way out of the demo at all. They
            leave via a plain navigation to the marketing landing. */}
        {isDemo && (
          <Link
            to={EXIT_DEMO_ROUTE}
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-background/60"
          >
            <IconX className="size-4" />
            Exit demo
          </Link>
        )}

        {!isDemo && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 text-sm text-foreground transition-colors hover:bg-background/60"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initial}
                </span>
                <span className="hidden max-w-[160px] truncate sm:inline">{displayName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <IconLogout className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      {/* Main content — inset card */}
      <div className="flex flex-1 flex-col overflow-hidden p-0 lg:px-2 lg:pb-2">
        <div className="flex flex-1 flex-col overflow-hidden border border-border bg-background shadow-sm lg:rounded-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
