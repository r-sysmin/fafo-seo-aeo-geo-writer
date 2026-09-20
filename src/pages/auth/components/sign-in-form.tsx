import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/base/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconLoader2 } from '@tabler/icons-react';
import { ForgotPasswordForm } from './forgot-password-form';

interface SignInFormProps {
  onSwitchTab: () => void;
  claimId: string | null;
}

export function SignInForm({ onSwitchTab, claimId }: SignInFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Email not confirmed — check your inbox.');
      } else {
        setError('Something went wrong. Try again.');
      }
      return;
    }

    if (claimId) {
      const pendingId = sessionStorage.getItem('pendingGenerationId') ?? claimId;
      await supabase
        .from('pages')
        .update({ user_id: (await supabase.auth.getUser()).data.user!.id, updated_at: new Date().toISOString() })
        .eq('id', pendingId)
        .is('user_id', null);
      sessionStorage.removeItem('pendingGenerationId');
    }

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/pages';
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <IconLoader2 className="size-4 animate-spin" />}
        Sign in
      </Button>

      <div className="space-y-2 text-center text-sm">
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot password?
        </button>
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={onSwitchTab}
          >
            Sign up &rarr;
          </button>
        </p>
      </div>
    </form>
  );
}
