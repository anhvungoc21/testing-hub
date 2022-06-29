import { getCsrfToken } from "next-auth/react";
import Header from "../components/Header";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Router from "next/router";

export default function Signup({ csrfToken }) {
  const [message, setMessage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpUser = async (e) => {
    e.preventDefault();
    if (!(firstName && lastName && email && password)) {
      setMessage("Please fill out all fields!");
      return;
    }
    setMessage(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    if (data.message == "Registered successfully!") {
      let options = { redirect: false, email, password };
      const res = signIn("credentials", options);
      return Router.push("/testing");
    }
  };

  return (
    <div className="h-screen">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center min-h-screen w-full justify-center">
          <form method="post">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              First Name
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-black-400 border-b block pl-4 pr-6 py-2  bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Last Name
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-black-400 border-b block pl-4 pr-6 py-2  bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <br />
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
              onClick={(e) => signUpUser(e)}
              className=" text-white p-1 rounded centerItem standardButton"
            >
              Sign up
            </button>
            <p className="topMargin">
              Already registered? Click here to <a href="/login">Sign In</a>
            </p>
          </form>
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
  return {
    props: {
      csrfToken,
    },
  };
}
