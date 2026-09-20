import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/base/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconLoader2 } from '@tabler/icons-react';

interface SignUpFormProps {
  onSwitchTab: () => void;
}

export function SignUpForm({ onSwitchTab }: SignUpFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const claimId = searchParams.get('claim');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password too weak — use at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Always /auth/callback — never a protected route. Pointing the confirmation
        // link straight at /pages races ProtectedRoute: the guard runs before the
        // link's code has been exchanged, so it bounces the user back to /auth.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        setError('Email already registered.');
      } else {
        setError(authError.message || 'Something went wrong. Try again.');
      }
      return;
    }

    // If auto-confirm is on we get a session immediately.
    // Claim happens in /pages via sessionStorage.pendingGenerationId.
    if (data.session && data.user) {
      setLoading(false);
      navigate('/pages', { replace: true });
      return;
    }

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Check your email to confirm your account.
        </p>
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={onSwitchTab}
          >
            Sign in &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <Input
          id="signup-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onSwitchTab}
        >
          Sign in &rarr;
        </button>
      </p>
    </form>
  );
}
