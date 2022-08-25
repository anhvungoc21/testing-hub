import Header from "../components/Header";
import ChangePassword from "../components/ChangePassword";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import ReactTooltip from "react-tooltip";

export default function Account() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState(null);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyLimit, setApiKeyLimit] = useState(0);

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
      body: JSON.stringify({
        email: session?.user.email,
        apiKeyName: apiKeyName.trim(),
        apiKey: apiKey.trim(),
      }),
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
    <div className="flex flex-col gap-10 bg-[#FEFAF3] h-screen overflow-scroll scrollbar-hide">
      <Header />
      <main className="flex">
        <div className="flex flex-col items-center w-full justify-center">
          <div>
            <table className="p-2 border-separate border-spacing border border-slate-500">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-600">No.</th>
                  <th className="p-2 border border-slate-600">Name</th>
                  <th className="p-2 border border-slate-600">API key</th>
                  <th className="flex align-baseline text-center gap-2 p-2 border border-slate-600">
                    <span>Fetch Data</span>
                    <ReactTooltip multiline="true" />
                    <img
                      className="w-1/6 h-1/3 pt-0.5 pb-0.5"
                      data-background-color="black"
                      data-tip="  Manually fetching data is only necessary <br/> if you want your data as soon as possible. <br/> Else, your data is fetched and updated automatically <br/> at 00:00 UTC daily after you enter the API key!"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABoElEQVRIie2WzU4CMRDHfxrjTQ8kxC8kfiS+ihEVMcSzD2DAiy/ikagX0Ys3DT6Cr2DwIDHgyZt4MFFYPLQbSoPtFIjxwD+Z7G53pr9Od7YtjPVHmgjwTQN7wDawAqR0+yvwAlSAW6AxqsEtASWgBXQ81gZu9MCGUg74EABtawLZQaHHqAxCoWb2xVBobkioCRdnnsI9vXUgD8xo2weqDv8msCgBX3igiT4xCVQ1/xZ35oOmcVdvXvtlNKgBbOm2A0dci+7v11cFR3AHNbVY2dV126wn9sgETVrgjGtUqO/VsUYf6eu0J7anbxu85gm29Qkc6vtNj++662WckcS+UMsnwDzu4oqreyTgEx0zBzwK/J3gpwBwUsc8CP2rJmjKAteADdfIDL0J/WI9mw92cd0HdhaiiuvlMvLtr6wtEvh/41lAAM4FHZUN/yuBf8kHBbXx+6o7BPwOLEjAoLYy17YYaeA17qluA7tSaKyiBy6pg0IoNFaWsEXFnN6dQaGxksApqjIlWV4i+KYhx9sU3ePtKr3H2xpqDbjTz2P9H/0AJ/xJq47cBwgAAAAASUVORK5CYII="
                    />
                  </th>
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
                        className="hover:text-gray-300 rounded-md border-2"
                        data-api-key={apiKey.apiKey}
                        onClick={(e) => fetchIndividualSkeleton(e)}
                      >
                        Fetch
                      </button>
                    </td>
                    <td className="p-2 border border-slate-700">
                      <button
                        className="hover:text-gray-300 rounded-md border-2"
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
