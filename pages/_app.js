import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/header.css";
import "../styles/home.css";
import "../styles/footer.css";
import "../styles/newsletterform.css";
import "../styles/login.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider
      session={session}
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetches session when window is focused
      refetchOnWindowFocus={true}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
