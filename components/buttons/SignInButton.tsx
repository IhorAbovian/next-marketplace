"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export const SignInButton = () => {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      /**
       * The social provider ID
       * @example "github", "google", "apple"
       */
      provider: "google",
      /**
       * A URL to redirect after the user authenticates with the provider
       * @default "/"
       */
      callbackURL: "/",
      /**
       * A URL to redirect if an error occurs during the sign in process
       */
      errorCallbackURL: "/error",
      /**
       * A URL to redirect if the user is newly registered
       */
      newUserCallbackURL: "/profile",
    });
  };

  return (
    <div className="container max-w-md mx-auto px-4 pt-12 pb-20">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-1/2 mx-auto flex items-center justify-center gap-2"
        >
          <FaGoogle className="mr-2" />
          Sign In with Google
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            No account? Just sign in with Google - we'll create one for you!
          </span>
        </div>
      </div>
    </div>
  );
};
