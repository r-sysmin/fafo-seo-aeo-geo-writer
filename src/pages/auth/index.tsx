import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-provider';
import { IconArrowLeft } from '@tabler/icons-react';
import { AuthCard } from './components/auth-card';

export default function AuthPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/pages" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>
      <AuthCard />
    </div>
  );
}
