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

    console.log(res);

    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    console.log(message);
    console.log(email, password);
    if (data.message == "Registered successfully!") {
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
          <form method="post">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label>
              First Name
              <input
                type="text"
                name="firstName"
                id="firstName"
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
              onClick={(e) => signUpUser(e)}
              className="bg-[#3a7fed] text-white p-1 rounded"
            >
              Sign up
            </button>
            <p>
              Already registered? Click here to <a href="/login">sign in</a>
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
