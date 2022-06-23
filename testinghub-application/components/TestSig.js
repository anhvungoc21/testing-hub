import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function TestSig({
  apiKey,
  metric,
  daysAgo,
  runTest,
  setOkStatusState,
}) {
  const { data: session } = useSession();
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

  const [metricName, setMetricName] = useState();
  const [testRunning, setTestRunning] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  const [testSignificant, setTestSignificant] = useState([]);
  const [testInsignificant, setTestInsignificant] = useState([]);
  const [testBuilding, setTestBuilding] = useState([]);

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
        // First Render
      } else {
        // Subsequent Renders
        setOkStatusState("");
        (async () => {
          const res = await fetch("/api/tests/fakeTestRun", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey }),
          });
          if (!res.ok) {
            setTestRunning(false);
            if (apiKey === "") return;
            setOkStatusState("Please try again!");
          } else {
            setTestRunning(true);
            setOkStatusState("Fetching data & Running tests...");
          }
        })();
        setTestSignificant([]);
        setTestInsignificant([]);
        setTestBuilding([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runTest]
  );

  useEffect(() => {
    if (!testRunning) return;
    (async () => {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey, metric, daysAgo }),
      });
      const json = await res.json();
      setTestSignificant(json.data[0]);
      setTestInsignificant(json.data[1]);
      setTestBuilding(json.data[2]);
      console.log("Test ran");
      setTestRunning(false);
      setDataReceived(true);
      setOkStatusState("Data Retrieved!");
    })();
  }, [testRunning]);

  useEffect(() => {
    if (metric == 0) {
      setMetricName("Opened");
    } else {
      setMetricName("Clicked");
    }
  }, [testRunning]);

  /// CARDS
  let sigCards;
  let insigCards;
  let buildingCards;

  if (testRunning) {
    sigCards = placeholder1;
  } else if (!dataReceived) {
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
        Metric: {metricName}
        <br />
        Winner: {item.winner}
        <br />
        <a
          href={`https://www.klaviyo.com/flow/message/${item.message_id}/reports/variations`}
        >
          View Test
        </a>
      </div>
    ));
  }

  if (testRunning) {
    insigCards = placeholder2;
  } else if (!dataReceived) {
    insigCards = undefined;
  } else {
    testInsignificant.map((item) => {
      console.log("Item: " + item);
    });

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
        Metric: {metricName}
        <br />
        <a
          href={`https://www.klaviyo.com/flow/message/${item.message_id}/reports/variations`}
        >
          View Test
        </a>
      </div>
    ));
  }

  if (testRunning) {
    buildingCards = placeholder3;
  } else if (!dataReceived) {
    buildingCards = undefined;
  } else {
    buildingCards = testBuilding.map((item, i) => (
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
        <br/>
        <a
          href={`https://www.klaviyo.com/flow/message/${item.message_id}/reports/variations`}
        >
          View Test
        </a>
      </div>
    ));
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
