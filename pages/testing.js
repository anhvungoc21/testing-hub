import Center from "../components/Center.js";
import { useSession, getSession, signOut } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <p>
        Access Denied. Please go here to <a href="/login">login</a>
      </p>
    );
  }
  return (
    <div className="h-screen w-screen overflow-scroll scrollbar-hide">
      <Header className="w-auto" />
      <main className="flex">
        <Center />
      </main>
    </div>
  );
}
