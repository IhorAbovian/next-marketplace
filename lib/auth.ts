import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { createAuthMiddleware } from "better-auth/api";
import { headers } from "next/headers";

export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback/")) {
        const user = ctx.context.newSession?.user;

        //If our custom flag is true, force redirect to onboarding
        if (user?.isNewUser) {
          return ctx.redirect("/profile?tab=settings"); // Path for new users
        }
      }
    }),
  },
  user: {
    additionalFields: {
      userId: {
        type: "string",
        input: true,
        returned: true,
      },
      isNewUser: {
        type: "boolean",
        input: true,
        returned: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
      strategy: "jwt", // can be "jwt" or "compact"
      refreshCache: true, // Enable stateless refresh
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async (profile) => {
        let user;

        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        user = existingUser;

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
            },
          });

          user = newUser;
        }

        if (!user) {
          throw new Error("User not found or created");
        }

        return {
          userId: user.id,
          isNewUser: !existingUser, // Flag to indicate if the user is new
        };
      },
    },
  },
});

// Helper functions for authentication
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session?.user?.email) throw new Error("Unauthorized");

  return { ...session.user, id: session.user.userId }; // Assuming userId is the unique identifier for the user
}
