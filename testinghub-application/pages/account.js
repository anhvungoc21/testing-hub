/* import Header from "../components/Header";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Account() {
  const { data: session } = useSession();
  const [message, setMessage] = useState(null);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const saveApiKey = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/recordKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session?.user.email, apiKeyName, apiKey }),
    });

    console.log(res);
    const data = await res.json();
    console.log(data);
    if (data.message) {
      setMessage(data.message);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center bg-[#FEFAF3] min-h-screen w-full justify-center">
          <label>
            Name:
            <input
              type="text"
              name="apiKeyName"
              id="apiKeyName"
              value={apiKeyName}
              onChange={(e) => setApiKeyName(e.target.value)}
            ></input>
          </label>
          <label>
            API key:
            <input
              type="text"
              name="apiKey"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            ></input>
          </label>
          <p style={{ color: "red" }}>{message}</p>
          <button
            type="submit"
            onClick={(e) => saveApiKey(e)}
            className="bg-[#3a7fed] text-white p-1 rounded"
          >
            Save API
          </button>
        </div>
      </main>
    </div>
  );
}
 */
