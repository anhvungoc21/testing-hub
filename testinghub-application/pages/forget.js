import { useState } from "react";
import Header from "../components/Header";

export default function Forget() {
  const [email, setEmail] = useState("");

  const forgetPassword = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forgetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center bg-[#FEFAF3] min-h-screen w-full justify-center">
          <form>
            <label>
              Enter your email:
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>
            <br />
            <button
              type="submit"
              onClick={(e) => forgetPassword(e)}
              className="bg-[#3a7fed] text-white p-1 rounded"
            >
              Reset Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
