import { useState } from "react";
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import Router from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
    } else {
      return Router.push("/testing");
    }
  };

  /* const signUpUser = async (e) => {
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
  }; */

  return (
    <div className="h-screen">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center min-h-screen w-full justify-center">
          <h1 className="">Testing Hub</h1>
          <form method="post">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              Email Address:
              <input
                type="email"
                name="email"
                id="email"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-black-400 border-b block pl-4 pr-6 py-2  bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
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
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-black-400 border-b block pl-4 pr-6 py-2  bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <p style={{ color: "red" }}>{message}</p>
            <button
              type="submit"
              onClick={(e) => signInUser(e)}
              className=" text-white p-1 rounded centerItem standardButton"
            >
              Sign in
            </button>

            {/* <button
              onClick={(e) => signUpUser(e)}
              className="bg-[#3a7fed] text-white p-1 rounded"
            >
              Sign up
            </button> */}
          </form>
          {Object.values(providers).map((provider) => {
            if (provider.name == "credentials") {
              return;
            }
            return (
              <div key={provider.name}>
                <button
                  className=" text-white p-1 rounded standardButton topMargin"
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  Sign In with {provider.name}
                </button>
              </div>
            );
          })}
          <br></br>
          <div></div>
          <h4>New to TestingHub?</h4>
          <a
            className=" text-white p-1 rounded standardButton topMargin"
            href="/signup"
          >
            Sign Up
          </a>
        </div>
      </main>
      <Footer />
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
