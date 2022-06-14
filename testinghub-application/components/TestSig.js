import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function TestSig({
  apiKey,
  metric,
  daysAgo,
  setApiState,
  okStatusState,
  setOkStatusState,
}) {
  const { data: session } = useSession();
  if (!session) {
    return;
  }
  const placeholder1 = (
    <div key="placeholder1" className="h-20 w-52 bg-[#72A4C4] rounded">
      Loading data...
    </div>
  );
  const placeholder2 = (
    <div key="placeholder2" className="h-20 w-52 bg-[#72A4C4] rounded">
      Loading data...
    </div>
  );

  const placeholder3 = (
    <div key="placeholder3" className="h-20 w-52 bg-[#72A4C4] rounded">
      Loading data...
    </div>
  );

  const [testRunning, setTestRunning] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  const [testSignificant, setTestSignificant] = useState([]);
  const [testInsignificant, setTestInsignificant] = useState([]);
  const [testBuilding, setTestBuilding] = useState([]);
  const [dataReceivedLocal, setDataReceivedLocal] = useState(false);

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };

  const isMount = useIsMount();

  useEffect(
    () => {
      if (isMount) {
        // First Render -- Check in localStorage
        const sigLS = JSON.parse(localStorage.getItem("significantTests"));
        const insigLS = JSON.parse(localStorage.getItem("insignificantTests"));
        const buildingLS = JSON.parse(localStorage.getItem("buildingTests"));
        if (sigLS === null || insigLS === null || buildingLS === null) return;
        if (
          sigLS.length === 0 &&
          insigLS.length === 0 &&
          buildingLS.length === 0
        )
          return;
        setTestSignificant(sigLS);
        setTestInsignificant(insigLS);
        setTestBuilding(buildingLS);
        //setDataReceived(true)
        setDataReceivedLocal(true);
        setOkStatusState("Data loaded from last session!");
      } else {
        setOkStatusState("");
        // Subsequent Renders
        fetch("/api/tests/fakeTestRun" + `?apiKey=${apiKey}`)
          .then((res) => {
            console.log(res);
            if (!res.ok) {
              setTestRunning(false);
              if (apiKey === "") return;
              setOkStatusState("Please try again!");
            } else {
              updateKeyInDB(session.user.email, apiKey);
              setTestRunning(true);
              setOkStatusState("Fetching data & Running tests...");
            }
          })
          .catch((err) => console.log(err));
        setTestSignificant([]);
        setTestInsignificant([]);
        setTestBuilding([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, metric, daysAgo]
  );

  useEffect(() => {
    if (!testRunning) return;
    fetch(
      "/api/tests" + `?apikey=${apiKey}&metric=${metric}&daysAgo=${daysAgo}`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setTestSignificant(json.data[0]);
        setTestInsignificant(json.data[1]);
        setTestBuilding(json.data[2]);
      })
      .then(() => {
        setTestRunning(false);
        setDataReceived(true);
        setOkStatusState("Data Retrieved!");
      })
      .catch((err) => console.log(err));
  }, [testRunning]);

  /// BUILD CARDS
  let sigCards;
  let insigCards;
  let buildingCards;

  if (testRunning) {
    sigCards = placeholder1;
  } else if (!dataReceived && !dataReceivedLocal) {
    sigCards = undefined;
  } else {
    sigCards = testSignificant.map((item, i) => (
      <div
        key={item.message_id}
        className="content-center text-center h-30 w-52 bg-[#72A4C4] rounded"
      >
        Flow ID:{" "}
        <a href={`https://www.klaviyo.com/flow/${item.flow_id}/edit`}>
          {item.flow_id}
        </a>
        <br />
        Message Name: {item.message_name}
        <br />
        Winner: {item.winner}
        <br />
        Loser: {item.loser}
      </div>
    ));
  }

  if (testRunning) {
    insigCards = placeholder2;
  } else if (!dataReceived && !dataReceivedLocal) {
    insigCards = undefined;
  } else {
    insigCards = testInsignificant.map((item, i) => (
      <div
        key={item.message_id}
        className="content-center text-center h-30 w-52 bg-[#72A4C4] rounded"
      >
        Flow ID:{" "}
        <a href={`https://www.klaviyo.com/flow/${item.flow_id}/edit`}>
          {item.flow_id}
        </a>
        <br />
        Message Name: {item.message_name}
        <br />
        Testing Variations: {item.variation1_id} and {item.variation2_id}
      </div>
    ));
  }

  if (testRunning) {
    buildingCards = placeholder3;
  } else if (!dataReceived && !dataReceivedLocal) {
    buildingCards = undefined;
  } else {
    buildingCards = testBuilding.map((item, i) => (
      <div
        key={item}
        className="p-8 content-center text-center h-30 w-52 bg-[#72A4C4] rounded"
      >
        Flow ID: {item}
      </div>
    ));
  }

  if (typeof window !== "undefined") {
    if (dataReceived === true || dataReceivedLocal) {
      localStorage.setItem("significantTests", JSON.stringify(testSignificant));
      localStorage.setItem(
        "insignificantTests",
        JSON.stringify(testInsignificant)
      );
      localStorage.setItem("buildingTests", JSON.stringify(testBuilding));
    }
  }

  return (
    <div className="flex text-white">
      <div className="grid grid-flow-row grid-cols-1 grid-rows-5 gap-y-5 text-center h-full w-full justify-items-center">
        <div className="h-24 w-60 bg-[#232426] rounded p-8">
          Complete ({testSignificant.length})
        </div>
        {sigCards}
      </div>
      <div className="grid grid-flow-row grid-cols-1 grid-rows-5 gap-y-5 text-center h-full w-full justify-items-center">
        <div className="h-24 w-60 bg-[#232426] rounded p-8">
          Running ({testInsignificant.length})
        </div>
        {insigCards}
      </div>
      <div className="grid grid-flow-row grid-cols-1 grid-rows-5 gap-y-5 text-center h-full w-full justify-items-center">
        <div className="h-24 w-60 bg-[#232426] rounded p-8">
          Building ({testBuilding.length})
        </div>
        {buildingCards}
      </div>
    </div>
  );
}

const updateKeyInDB = (email, apiKey) => {
  const dev = process.env.NODE_ENV == "development";
  const url = dev
    ? "http://localhost:3000"
    : "https://testing-hub-local.vercel.app";
  fetch(url + "/api/signup/recordKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      apiKey: apiKey,
    }),
  });
};
