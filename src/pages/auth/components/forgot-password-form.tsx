import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/base/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconLoader2 } from '@tabler/icons-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (resetError) {
      setError('Something went wrong. Try again.');
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Check your email for a reset link.
        </p>
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={onBack}
        >
          &larr; Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        Send reset link
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={onBack}
        >
          &larr; Back to sign in
        </button>
      </div>
    </form>
  );
}
