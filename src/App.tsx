import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplicationLayout from "./layouts/application-layout";
import WorkspaceTopbarLayout from "./layouts/workspace-topbar-layout";
import Landing from "./pages/landing";
import AuthPage from "./pages/auth";
import AuthCallback from "./pages/auth/callback";
import PagesListPage from "./pages/pages-list";
import PageViewPage from "./pages/page-view";
import NotFound from "./pages/not-found";
import { ProtectedRoute } from "./components/protected-route";
import { SeedDataProvider, SupabaseDataProvider } from "./lib/data-provider";
import { FilterProvider } from "./lib/filter-context";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route element={<ApplicationLayout />}>
        <Route path="/" element={<SupabaseDataProvider><Landing /></SupabaseDataProvider>} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Managed OAuth + email-confirmation return. SocialAuthButtons always
            redirects here, so this route must exist or SSO dead-ends on a 404. */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>

      {/* Demo routes — seed data, no auth */}
      <Route
        element={
          <SeedDataProvider>
            <FilterProvider>
              <WorkspaceTopbarLayout />
            </FilterProvider>
          </SeedDataProvider>
        }
      >
        <Route path="/demo/pages" element={<PagesListPage />} />
        <Route path="/demo/pages/:id" element={<PageViewPage />} />
      </Route>

      {/* Protected routes — Supabase data, auth required */}
      <Route
        element={
          <ProtectedRoute>
            <SupabaseDataProvider>
              <FilterProvider>
                <WorkspaceTopbarLayout />
              </FilterProvider>
            </SupabaseDataProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/pages" element={<PagesListPage />} />
        <Route path="/pages/:id" element={<PageViewPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
