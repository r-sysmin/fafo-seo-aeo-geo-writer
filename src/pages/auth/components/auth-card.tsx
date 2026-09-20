import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SocialAuthButtons } from '@/components/base/social-auth-buttons';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

export function AuthCard() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const claimId = searchParams.get('claim');

  const defaultTab = intent === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(intent === 'signup' ? 'signup' : 'signin');
  }, [intent]);

  const headline =
    intent === 'signup'
      ? 'Create your account to save your page.'
      : intent === 'signin'
        ? 'Welcome back.'
        : 'Sign in or create an account.';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <span className="font-heading text-[21px] font-semibold leading-6 tracking-tight">
          Meta description generator
        </span>
        <p className="text-sm text-muted-foreground">{headline}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* The ONE brand-compliant SSO button set. Do not restyle or rebuild it
            inline. Google only — Apple is not configured on this project's broker,
            so an Apple button could only ever error. See docs/design/auth.md. */}
        <SocialAuthButtons
          mode={activeTab === 'signup' ? 'signup' : 'signin'}
          providers={['google']}
        />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <SignInForm
              onSwitchTab={() => setActiveTab('signup')}
              claimId={claimId}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm onSwitchTab={() => setActiveTab('signin')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
