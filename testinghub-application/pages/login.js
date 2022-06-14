import { useState } from "react";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import Router from "next/router";
import Header from "../components/Header";

export default function Login({ providers, csrfToken }) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInUser = async (e) => {
    e.preventDefault();
    let options = { redirect: false, email, password };
    const res = await signIn("credentials", options);
    console.log(res);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
    } else {
      return Router.push("/testing");
    }
  };

  const signUpUser = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log(res);

    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    console.log(message);
    console.log(email, password);
    if (data.message == "Registered successfully") {
      let options = { redirect: false, email, password };
      const res = signIn("credentials", options);
      return Router.push("/testing");
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center bg-[#FEFAF3] min-h-screen w-full justify-center">
          <h1 className="">Testing Hub</h1>
          <form method="post">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              Email Address:
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <p style={{ color: "red" }}>{message}</p>
            <br />
            <button
              type="submit"
              onClick={(e) => signInUser(e)}
              className="bg-[#3a7fed] text-white p-1 rounded"
            >
              Sign in with Credentials
            </button>
            <br />
            <button
              onClick={(e) => signUpUser(e)}
              className="bg-[#3a7fed] text-white p-1 rounded"
            >
              Sign up
            </button>
          </form>
          {Object.values(providers).map((provider) => {
            if (provider.name == "credentials") {
              return;
            }
            return (
              <div key={provider.name}>
                <button
                  className="bg-[#3a7fed] text-white p-1 rounded"
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  Sign In with {provider.name}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, context }) {
  /* const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: "/" },
    };
  } */
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: {
      csrfToken,
      providers,
    },
  };
}
