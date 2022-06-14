import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SearchBox({
  apiKey,
  setApiState,
  setDateDropDownState,
  setMetricDropDownState,
  okStatusState,
}) {
  const [formState, setFormState] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const { data: session } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiState(formState);
    setFormState("");
  };

  useEffect(() => {
    fetch("/api/signup/getKeys" + `?email=${session?.user.email}`)
      .then((res) => res.json())
      .then((json) => {
        setApiKeys(json.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    // DropDown
    // Search bar & Submit button
    <div className="ml-5 text-black bg-[#FFFFF5] py-5">
      <div className="space-y-5">
        <form onSubmit={handleSubmit}>
          <select
            className="bg-[#FFFFF5] border-[#232426] hover:bg-[#232426] hover:border-transparent hover:text-white border-2 border-opacity-50 rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
            onChange={(e) => setMetricDropDownState(e.target.value)}
          >
            <option className="font-medium" value="0">
              Opened Email
            </option>{" "}
            {/* 0 is the metric for Opened Email*/}
            <option className="font-medium" value="1">
              Clicked Email
            </option>{" "}
            {/* 1 is the metric for Opened Email*/}
          </select>
          <input
            className="bg-[#FFFFF5] border-[#232426] border-opacity-50 border-2 rounded mx-2 w-80 px-3 py-2 font-normal text-gray-700 text-left"
            placeholder="Type Your API Key"
            list="apiKeys"
            onChange={(e) => setFormState(e.target.value)}
            value={formState}
          />
          <datalist id="apiKeys">
            {apiKeys.map((apiKey, i) => (
              <option key={i} value={apiKey}></option>
            ))}
          </datalist>
          <select
            className="bg-[#FFFFF5] border-[#232426] hover:bg-[#232426] hover:border-transparent hover:text-white border-2 border-opacity-50 rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
            onChange={(e) => setDateDropDownState(e.target.value)}
          >
            <option className="font-medium" value="1">
              1 day
            </option>{" "}
            <option className="font-medium" value="3">
              3 days
            </option>{" "}
            <option className="font-medium" value="10">
              10 days
            </option>{" "}
            <option className="font-medium" value="15">
              15 days
            </option>{" "}
            <option className="font-medium" value="30">
              30 days
            </option>{" "}
            <option className="font-medium" value="90">
              90 days
            </option>{" "}
          </select>
          <button className="ml-4 font-bold py-2 px-6 border-2 border-opacity-50 border-[#232426] hover:bg-[#232426] hover:border-transparent hover:text-white rounded-lg">
            Submit API
          </button>
        </form>
        <div className="flex">
          {/* Hiding API Key
          <div className="grid h-full w-[62em] font-bold px-2 py-2">
            Your API: {apiKey}
          </div> */}
          <div className="grid h-full w-full font-bold px-2 py-2">
            Status: {okStatusState}
          </div>
        </div>
      </div>
    </div>
  );
}
