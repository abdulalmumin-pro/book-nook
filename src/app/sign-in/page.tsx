"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      toast.add({
        type: "error",
        title: "Sign In Failed",
        description:
          error.message ?? "Invalid email or password. Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Signed in!",
      description: "Welcome back — you're logged in.",
    });
    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Google Sign In Failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in with your Google account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn}>
            <FieldGroup>
              <Field>
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <a
                    href="/forgot-password"
                    className="text-sm underline underline-offset-4 hover:text-primary"
                  >
                    Forgot password?
                  </a>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/sign-up"
                    className="underline underline-offset-4 font-medium"
                  >
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-4 mt-6 text-center">
        By continuing, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
