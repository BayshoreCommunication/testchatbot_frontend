import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Both email and password are required.");
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          console.error("API URL is not defined in environment variables.");
          throw new Error("Internal server error. Please try again later.");
        }

        try {
          const response = await fetch(`${apiUrl}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid server response.");
          }

          const data = await response.json();

          if (!data?._id || !data.token) {
            throw new Error("Incomplete user data received from server.");
          }

          return {
            _id: data._id,
            email: data.email,
            companyName: data.companyName,
            subscription: data.subscription,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("An error occurred during authorization.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && profile?.email) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          console.error("API URL is not defined");
          return false;
        }

        try {
          // Sync user with backend
          const response = await fetch(`${apiUrl}/api/auth/google/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: profile.email,
              name: profile.name,
              avatar: (profile as any).picture,
            }),
          });

          if (!response.ok) {
            console.error("Failed to sync Google user with backend");
            return false;
          }

          const data = await response.json();

          // Attach backend user data and token to the user object
          if (data.user && data.token) {
            Object.assign(user, {
              accessToken: data.token,
              _id: data.user._id,
              companyName: data.user.companyName,
              companyType: data.user.companyType,
              website: data.user.website,
              subscription: data.user.subscription,
            });
          }
        } catch (error) {
          console.error("Error syncing Google user:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          return { ...token, ...user };
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);

        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user = token as any;
        }

        return session;
      } catch (error) {
        console.error("Session callback error:", error);

        return session;
      }
    },
  },
});
