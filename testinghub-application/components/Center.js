import SearchBox from "../components/SearchBox.js";
import TestSig from "./TestSig.js";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Center() {
  const [apiState, setApiState] = useState("");
  const [runTest, setRunTest] = useState(false);
  const [metricDropDownState, setMetricDropDownState] = useState(0);
  const [dateDropDownState, setDateDropDownState] = useState(1);
  const [okStatusState, setOkStatusState] = useState("");

  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="w-full h-full overflow-y-scroll scrollbar-hide">
      <btn
        onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
        className="absolute cursor-pointer top-5 right-8 w-10 h-10 rounded-full"
        src={session?.user.image}
      >
        Sign Out
      </btn>
      <div className={"bg-[#FFFFF5]"}>
        <SearchBox
          className={"bg-gray-50"}
          setApiState={setApiState}
          setDateDropDownState={setDateDropDownState}
          setMetricDropDownState={setMetricDropDownState}
          runTest={runTest}
          setRunTest={setRunTest}
          okStatusState={okStatusState}
        />
        <TestSig
          apiKey={apiState}
          metric={metricDropDownState}
          daysAgo={dateDropDownState}
          runTest={runTest}
          setOkStatusState={setOkStatusState}
        />
      </div>
    </div>
  );
}
