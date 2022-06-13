import Center from "../components/Center.js";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";



export default function Home() {
    const { data: session } = useSession();
    const dev = process.env.NODE_ENV == "development";
    const url = dev
      ? "http://localhost:3000"
      : "https://testing-hub-local.vercel.app";
    if (session) {
      fetch(url + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          apiKeys: [],
        }),
      });
      // recordLogin( { name: session.user.name, email: session.user.email, apiKeys: [] } )
    }
  
    return (
        <div>
            <Header />
            <div className="h-screen overflow-hidden">
          
        <main className="flex">
          <Center />
        </main>
        
      </div>
        </div>
      
    );
  }
  
  /*
  const recordLogin = async (info) => {
    axios({
      method: 'post',
      url: "/api/signup",
      data: info
    })
  }
  */
  
  export async function getServerSideProps(context) {
    return {
      props: {
        session: await getSession(context),
      },
    };
  }
  