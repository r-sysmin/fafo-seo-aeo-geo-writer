import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconFileText,
  IconLayoutSidebar,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-provider";

const navItems = [
  { label: "Pages", href: "/pages", icon: IconFileText },
];

export default function WorkspaceLayout03() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();

  const activeItem = navItems.find((item) => pathname === item.href) ?? navItems[0];

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
    <div className="flex h-screen bg-muted">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col p-4 transition-[width] duration-300 lg:flex",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden p-0",
        )}
      >
        <Link
          to="/pages"
          className="mb-8 px-2 font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
        >
          Acme
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-background font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User menu at bottom */}
        {user && (
          <div className="mt-auto pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Account menu"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-background/60"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initial}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left">{displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <IconLogout className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main content — inset card */}
      <div className="flex flex-1 flex-col overflow-hidden p-0 lg:py-2 lg:pr-2">
        <div className="flex flex-1 flex-col overflow-hidden border border-border bg-background shadow-sm lg:rounded-xl">
          {/* Header with toggle + breadcrumbs */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <IconLayoutSidebar className="size-4" />
            </Button>
            <nav className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Workspace</span>
              <IconChevronRight className="size-3 text-muted-foreground" />
              <span className="font-medium text-foreground">{activeItem.label}</span>
            </nav>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
