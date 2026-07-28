"use client";

// import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client"; //import the auth client

export default function SignInPage() {
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch("/api/data/users");
  //   })();
  // }, []);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle sign in logic
  //   console.log("Sign in data:", formData);
  // };

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

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
      callbackURL: "/dashboard",
      /**
       * A URL to redirect if an error occurs during the sign in process
       */
      errorCallbackURL: "/error",
      /**
       * A URL to redirect if the user is newly registered
       */
      newUserCallbackURL: "/welcome",
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

        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form> */}

        <Button
          onClick={handleGoogleSignIn}
          className="w-1/2 mx-auto flex items-center justify-center gap-2"
        >
          <FaGoogle className="mr-2" />
          Sign In with Google
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Do not have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="font-medium text-foreground hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
