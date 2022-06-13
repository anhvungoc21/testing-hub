import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../lib/mongodb";
import Users from "../../../models/UserModel";
import connectDB from "../../../lib/connectDB";
import bcrypt from "bcrypt";

connectDB();
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization:
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }),
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        firstName: {
          label: "Firstname",
          type: "text",
          placeholder: "John",
        },
        lastName: {
          label: "Lastname",
          type: "text",
          placeholder: "Doe",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const email = credentials.email;
        const password = credentials.password;
        const user = await Users.findOne({ email });
        console.log("User: " + user);
        if (!user) {
          throw new Error("You haven't registered yet");
        }
        if (user) {
          return signInUser({ password, user });
        }
        // If you return null then an error will be displayed advising the user to check their details.
        // return null;
      },

      // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  /* pages: {
    signIn: "login",
  }, */
  callbacks: {
    /* async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // handle expiry times in Milliseconds so we * 1000
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        // console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      // Access token has expired, so we need to refresh it
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    }, */

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.email = token.email;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});

const signInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Please enter password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password not correct");
  }

  return user;
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
