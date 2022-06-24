import Layout from "../components/Layout";
import Header from "../components/Header";
import Home from "./home";
import NewsletterSubscribe from "../components/NewsletterSubscribe";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Index() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      console.log(session);
      (async () => {
        const res = await fetch("/api/addUserToDb", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user.email,
            name: session?.user.name,
          }),
        });
        console.log(res);
      })();
    }
  }, [session]);

  return (
    <div className="center">
      <Layout pageTitle="Landing Page">
        <Header />
        <Home />
        <div className=" mb-4 bg-dark rounded-3 jumbotronSignUp">
          <div className="container-fluid py-5">
            <NewsletterSubscribe />
          </div>
        </div>

        <Footer />
      </Layout>
    </div>
  );
}
