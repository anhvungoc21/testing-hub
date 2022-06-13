import SearchBox from "../components/SearchBox.js";
import TestSig from "./TestSig.js";
import React from "react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Center() {
  const [apiState, setApiState] = useState("");
  const [metricDropDownState, setMetricDropDownState] = useState(0);
  const [dateDropDownState, setDateDropDownState] = useState(1);
  const [okStatusState, setOkStatusState] = useState("");

  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="w-screen h-screen overflow-y-scroll scrollbar-hide">
      <img
        onClick={signOut}
        className="absolute cursor-pointer top-5 right-8 w-10 h-10 rounded-full"
        src={session?.user.image}
      />
      <div className={"bg-[#FFFFF5]"}>
        <SearchBox
          className={"bg-gray-50"}
          apiKey={apiState}
          setApiState={setApiState}
          setDateDropDownState={setDateDropDownState}
          setMetricDropDownState={setMetricDropDownState}
          okStatusState={okStatusState}
        />
        <TestSig
          apiKey={apiState}
          metric={metricDropDownState}
          daysAgo={dateDropDownState}
          setApiState={setApiState}
          okStatusState={okStatusState}
          setOkStatusState={setOkStatusState}
        />
      </div>
    </div>
  );
}
