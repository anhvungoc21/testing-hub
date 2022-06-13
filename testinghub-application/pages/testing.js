import Center from "../components/Center.js";
import { useSession, getSession, signOut } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex">
        <Center />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
