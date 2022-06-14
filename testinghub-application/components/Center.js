import SearchBox from "../components/SearchBox.js"
import TestSig from "./TestSig.js"
import React from "react"
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function Center() {
  const [apiState, setApiState] = useState('');
  const [metricDropDownState, setMetricDropDownState] = useState(0);
  const [dateDropDownState, setDateDropDownState] = useState(1);
  const [okStatusState, setOkStatusState] = useState('')
  
  const { data: session } = useSession()
  console.log(session);

  return (
    <div className="w-screen h-screen overflow-y-scroll scrollbar-hide">
      {/* <section
        className={`relative flex flex-column items-center bg-[#EF6450] h-44 text-white p-8 w-full`}
      >
        <div className="text-[#232426] text-center">
          <h1 className="text-7xl">Testing Hub</h1>
        </div>
      </section> */}
      <btn onClick={signOut} className="absolute cursor-pointer top-5 right-8 w-10 h-10 rounded-full" src={ session?.user.image }>Sign Out</btn>

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
  )
}
