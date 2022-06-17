import Header from "../components/Header";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";

export default function Account() {
  const { data: session } = useSession();
  const [message, setMessage] = useState(null);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyLimit, setApiKeyLimit] = useState(0);

  console.log(session);

  const saveApiKey = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/apikey/recordKey", {
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

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/apikey/getKeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user.email }),
      });

      const json = await res.json();
      setApiKeys(json.data);
      setApiKeyLimit(json.apiKeyLimit);
      console.log(apiKeys);
    })();
  }, [session, message]);

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center bg-[#FEFAF3] min-h-screen w-full justify-center">
          <table className="p-2 border-separate border-spacing border border-slate-500 m-">
            <thead>
              <tr>
                <th className="p-2 border border-slate-600">No.</th>
                <th className="p-2 border border-slate-600">Name</th>
                <th className="p-2 border border-slate-600">API key</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((apiKey, i) => (
                <tr id={i}>
                  <td className="p-2 border border-slate-700">{i + 1}</td>
                  <td className="p-2 border border-slate-700">{apiKey.name}</td>
                  <td className="p-2 border border-slate-700">
                    {apiKey.apiKey}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <h6>Limit: {apiKeyLimit} API keys</h6>
          <div className="border p-2">
            <h5 className="center">Add your API keys:</h5>
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
            <br />
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
        </div>
      </main>
    </div>
  );
}

/* export async function getStaticProps(context) {
  const session = await getSession(context);
  const res = await fetch("http://localhost:3000/api/apikey/getKeys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: session?.user.email }),
  });

  const json = await res.json();
  const data = await json.data;
  console.log(data);
  return {
    props: {
      apiKeys: data,
    },
  };
} */
