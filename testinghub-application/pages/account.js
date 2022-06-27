import Header from "../components/Header";
import ChangePassword from "../components/ChangePassword";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";

export default function Account() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState(null);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyLimit, setApiKeyLimit] = useState(0);

  console.log(session);

  const fetchIndividualSkeleton = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/aws/runFetchSkeleton", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey: e.target.dataset.apiKey }),
    });
    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
  };

  const removeApiKey = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/apikey/removeKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user.email,
        name: e.target.dataset.apiKeyName,
      }),
    });

    console.log(res);
    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
  };

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

    const data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }
    setApiKey("");
    setApiKeyName("");
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

  if (status === "unauthenticated") {
    return (
      <p>
        Access Denied. Please go here to <a href="/login">login</a>
      </p>
    );
  }

  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <Header />
      <main className="flex h-full w-full">
        <div className="flex flex-col items-center bg-[#FEFAF3] w-full justify-center">
          <div>
            <table className="p-2 border-separate border-spacing border border-slate-500 m-">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-600">No.</th>
                  <th className="p-2 border border-slate-600">Name</th>
                  <th className="p-2 border border-slate-600">API key</th>
                  <th className="p-2 border border-slate-600">Fetch Data</th>
                  <th className="p-2 border border-slate-600">Remove</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey, i) => (
                  <tr id={i}>
                    <td className="p-2 border border-slate-700">{i + 1}</td>
                    <td className="p-2 border border-slate-700">
                      {apiKey.name}
                    </td>
                    <td className="p-2 border border-slate-700" type="password">
                      {apiKey.apiKey}
                    </td>
                    <td className="p-2 border border-slate-700">
                      <button
                        className="hover:text-gray-300"
                        data-api-key={apiKey.apiKey}
                        onClick={(e) => fetchIndividualSkeleton(e)}
                      >
                        Fetch
                      </button>
                    </td>
                    <td className="p-2 border border-slate-700">
                      <button
                        className="hover:text-gray-300"
                        data-api-key-name={apiKey.name}
                        onClick={(e) => removeApiKey(e)}
                      >
                        X
                      </button>
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
          <br />
          <ChangePassword />
        </div>
      </main>
    </div>
  );
}
