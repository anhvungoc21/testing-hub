export default async function handler(req, res) {
  const testArray = [];

  const privateApiKey = req.body.apiKey;
  const metric = req.body.metric;
  const daysAgo = req.body.daysAgo;
  // let divisor = 0.5;

  async function get_metrics_ID(api_key) {
    const url = `https://a.klaviyo.com/api/v1/metrics?page=0&count=50&api_key=${api_key}`;
    const options = { method: "GET", headers: { Accept: "application/json" } };

    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => json)
      .catch((err) => console.error("error:" + err));
  }

  async function extract_metrics_ID(api_key, metric_name) {
    let json = await get_metrics_ID(api_key);
    let result;
    for (let i = 0; i < json.data.length; i++) {
      if (json.data[i].name == metric_name) {
        result = json.data[i].id;
      }
    }
    return result;
  }

  // Makes API request and retrieves one batch of events of a certain Metric ID. `since` is the starting date of retrival.
  // This is a helper function for `get_batches_since_date` below.

  async function get_batch(api_key, metric_id, since) {
    const url = `https://a.klaviyo.com/api/v1/metric/${metric_id}/timeline?since=${since}&count=100&sort=asc&api_key=${api_key}`;
    const options = { method: "GET", headers: { Accept: "application/json" } };

    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => json)
      .catch((err) => console.error("error:" + err));
  }

  // Makes consecutive API requests until all data of a metric from `time_frame` days ago have been retrieved and compiled
  // Example call: get_batches_since_data("JkVZrn", 30)
  // Example output: [*event_object_1*, *event_object_2*]. The format of an event object can be found in the README.md

  async function get_batches_since_date(api_key, metric_id, time_frame) {
    // Get all batches since `time-frame` days ago.
    let current_time = new Date().getTime();
    current_time = Math.floor(current_time / 1000);
    let next = current_time - time_frame * 86400;
    let result = [];

    while (next != null) {
      let batch = await get_batch(api_key, metric_id, next);
      for (let i = 0; i < batch.data.length; i++) {
        result.push(batch.data[i]);
      }

      testArray.push(next);
      next = batch.next;
      if (next == null) {
        break;
      }
    }
    // console.log(result.length);
    return result;
  }
  //let clicked = await get_batches_since_date('PNQUid', 3)
  //console.log(clicked)
  //let received = await get_batches_since_date('JkVZrn', 60)
  //console.log(received)
  //console.log(await get_batches_since_date("NyNP4X", 1))

  // This is a global dictionary for message_ids
  let message_id_dict = {};

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // REFACTORED CODE STARTS HERE
  function makeRange(days_ago) {
    const ret = [];
    const divisor = 0.25;
    for (let i = days_ago; i > 0; i = i - divisor) {
      ret.push(i);
    }
    return ret;
  }

  function promise_batch(api_key, metric_id, since) {
    const url = `https://a.klaviyo.com/api/v1/metric/${metric_id}/timeline?since=${since}&count=100&sort=asc&api_key=${api_key}`;
    const options = { method: "GET", headers: { Accept: "application/json" } };

    return fetch(url, options);
  }

  // Returns a promise if next is not null, or next is smaller than `until` checkpoint
  function createPromise(api_key, metric_id, token, until) {
    // Check for null token
    if (token == null) return null;

    // Parse token for int comparison
    if (typeof token == "string") {
      // Token is a string (Returned by batch -- `next`)
      const tokenParsed = parseInt(token.split("-")[0]);
      if (tokenParsed >= until) return null;
    } else {
      // Token is a number
      if (token >= until) return null;
    }

    // Make prommise
    const promise = promise_batch(api_key, metric_id, token);
    return promise;
  }

  const createPromiseArr = function (
    api_key,
    metric_id,
    tokenArr,
    checkpointArr
  ) {
    const promiseArr = [];

    // indices to delete from tokenArray and checkpointArr when a promise returns null
    const indicesToDel = [];
    // console.log(tokenArr);
    // console.log(checkpointArr);

    tokenArr.forEach((token, i) => {
      // Create new promise
      const newPromise = createPromise(
        api_key,
        metric_id,
        token,
        checkpointArr[i]
      );

      if (newPromise != null) {
        promiseArr.push(newPromise);
      } else {
        // promiseArr.push(Promise.resolve());
        indicesToDel.push(i);
      }
    });

    // Update/shorten tokenArray and checkpointArr
    indicesToDel.forEach((i) => {
      tokenArr.splice(i, 1);
      checkpointArr.splice(i, 1);
    });

    return promiseArr;
  };

  const runPromiseArr = async function (api_key, metric_id, days_ago) {
    let promiseArr;
    let responses;
    let nextArr;
    const result = {};

    // Making checkpoints and starting points for `next`
    const currentTime = Math.floor(new Date().getTime() / 1000);
    nextArr = makeRange(days_ago);
    const divisor = 0.25;
    let checkPoints = nextArr.map((cp) => cp - divisor);

    checkPoints = checkPoints.map((cp) => currentTime - Math.floor(cp * 86400));
    nextArr = nextArr.map((next) => currentTime - Math.floor(next * 86400));
    let count = 0;
    while (true) {
      promiseArr = createPromiseArr(api_key, metric_id, nextArr, checkPoints); // checkPoints will be updated with the nextArr

      // Check for stop here.
      if (promiseArr.length == 0) break;

      responses = await Promise.all(promiseArr);

      // if (responses.filter((p) => p === undefined).length === days_ago) break;
      for (let i = 0; i < responses.length; i++) {
        // if (responses[i] === undefined) continue;
        let data = await responses[i].json();
        data.data.forEach((event) => {
          // const eventID = event.event_properties.$event_id.split(":").at(1);
          const eventID = event.event_properties.$event_id;
          result[eventID] = event; // Ensure events are unique
        });
        nextArr[i] = data.next;
      }
    }
    const retArr = Object.values(result);
    return retArr;
  };
  // REFACTORED CODE ENDS HERE
  /* 
    Output varies depending on `result_type`:
    - `result_type` == true => Return a dictionary of flows, messages, variations and their count. Suitable for testing
    - `result_type` == false => Returns a dictionary of flows, messages, and message names of objects which either has no flows or no variations
    Example call: extract_variations(await get_batches_since_date('PNQUid', 1), true)
    Example output when True: {*flow_ID*: {*message_ID*: {*variation_ID*: *count*} } }
    Example output when False: { *flow_ID*: {*message*: *message_name*}
                                'Undefined flow': {*message*: *message_name*} }   
    */
  function extract_variations(data, result_type, unique) {
    let result = {};
    let user_id_dict = {};
    let trash = {};
    let undefined_flow = {};
    for (let i = 0; i < data.length; i++) {
      // Event:
      let event = data[i];
      let properties = event.event_properties;
      let message = properties.$message;
      let message_name = properties["Campaign Name"];
      let variation = properties.$variation;
      let flow = properties.$flow;
      // User:
      let user = event.person;
      let user_id = user.$email;
      // $email and $id are the same. Maybe we should use email, because I saw some wacky ids at some point.

      // Organize into message-variation-count dictionary

      if (flow != undefined && variation != undefined) {
        // Check if not Trash
        if (unique) {
          if (flow in result) {
            if (!(flow in user_id_dict)) {
              user_id_dict[flow] = {};
            }
            if (message in result[flow]) {
              if (!(message in user_id_dict[flow])) {
                user_id_dict[flow][message] = {};
              }
              if (variation in result[flow][message]) {
                if (!(user_id in user_id_dict[flow][message][variation])) {
                  result[flow][message][variation] += 1;
                  user_id_dict[flow][message][variation][user_id] = 1;
                }
              } else {
                if (!(variation in user_id_dict[flow][message])) {
                  user_id_dict[flow][message][variation] = {};
                  result[flow][message][variation] = 1;
                  user_id_dict[flow][message][variation][user_id] = 1;
                }
              }
            } else {
              // Result
              result[flow][message] = {};
              result[flow][message][variation] = 1;
              message_id_dict[message] = message_name;

              // User_dict
              user_id_dict[flow][message] = {};
              user_id_dict[flow][message][variation] = {};
              user_id_dict[flow][message][variation][user_id] = 1;
            }
          } else {
            // Result
            result[flow] = {};
            result[flow][message] = {};
            result[flow][message][variation] = 1;
            message_id_dict[message] = message_name;

            // User_dict
            user_id_dict[flow] = {};
            user_id_dict[flow][message] = {};
            user_id_dict[flow][message][variation] = {};
            user_id_dict[flow][message][variation][user_id] = 1;
          }
        } else {
          if (flow in result) {
            if (message in result[flow]) {
              if (variation in result[flow][message]) {
                result[flow][message][variation] += 1;
              } else {
                result[flow][message][variation] = 1;
              }
            } else {
              message_id_dict[message] = message_name;
              result[flow][message] = {};
              result[flow][message][variation] = 1;
            }
          } else {
            message_id_dict[message] = message_name;
            result[flow] = {};
            result[flow][message] = {};
            result[flow][message][variation] = 1;
          }
        }
      } else {
        if (flow != undefined) {
          if (!(flow in trash)) {
            trash[flow] = {};
          }
          trash[flow][message] = message_name;
        } else {
          undefined_flow[message] = message_name;
        }
      }
    }
    if (result_type) {
      return result;
    } else {
      trash["Undefined flow"] = undefined_flow;
      return trash;
    }
  }

  // Unique CLicks & Total Receiveds
  // Opened:
  //let c_data = extract_variations(await get_batches_since_date('NyNP4X', 40), true, true)
  // console.log(extract_variations(await get_batches_since_date('NyNP4X', 30)), true)
  // Clicked:
  //let c_data = extract_variations(await get_batches_since_date('PNQUid', 40), true, true)
  //console.log(extract_variations(await get_batches_since_date('PNQUid', 1), false))
  // Received:
  //let r_data = extract_variations(await get_batches_since_date('JkVZrn', 40), true, false)
  //(await get_batches_since_date('JkVZrn', 10), false))

  // TIME SPENT:
  // 30 days for both clicked and received, then compare -> 212 seconds.

  /*
    Returns [metric_var1_count, received_var1_count, metric_var2_count, received_var2_count, winner, loser]
        Variable name is metric_count because metric = {Clicked Email, Opened Email}
    Any information that is unavailable will be `undefined`
    r_data : dict?, a received email dictionary with flow_id, message_id, variation, and count 
    c_data : dict?, a *metric* email dictionary with flow_id, message_id, variation, and count
    Example call: compare_variations("UZXvua", "XXNdSv", r_data, c_data)
    Example output 1: [5, 26, 1, 21, 'VFtvut'] -> when the test is significant
    Example output 2: [a1, b1, a2, b2, undefined'] -> when the test is insignificant 
    */
  function compare_variations(flow_id, message_id, r_data, c_data) {
    //Returns 1 if e1 is sig better , 2 if e2, -1 if neither
    // let c_subdict = c_data[flow_id]?.[message_id];
    // if (c_subdict === undefined) return undefined;
    // let c_variations = Object.keys(c_subdict);
    // let c_1 = c_subdict[c_variations[0]];
    // let c_2 = c_subdict[c_variations[1]];

    // let r_subdict = r_data?.[flow_id]?.[message_id];
    // if (r_subdict === undefined) return undefined;
    // //let r_variations = Object.keys(r_subdict)
    // let r_1 = r_subdict[c_variations[0]];
    // let r_2 = r_subdict[c_variations[1]];
    // CHANGE BACK TO DICTIONARY!!!! ARRAY IS GAY
    // clicked: var1, var2 ; delivered: var2, var1

    let c_subdict = c_data[flow_id]?.[message_id];
    let r_subdict = r_data[flow_id]?.[message_id];
    if (c_subdict == undefined || r_subdict == undefined) return;
    let c_variations = Object.keys(c_subdict);
    // let r_variations = Object.keys(r_subdict);

    let c_1 = c_subdict[c_variations[0]];
    let c_2 = c_subdict[c_variations[1]];

    //let r_subdict = r_data?.[flow_id]?.[message_id];
    let r_1 = r_subdict[c_variations[0]];
    let r_2 = r_subdict[c_variations[1]];

    let sig = significance(c_1, r_1, c_2, r_2);

    switch (sig) {
      // Siginificant: [metric_var1_count, received_var1_count, metric_var2_count, received_var2_count, winner, loser]
      case 1:
        return {
          metric1_count: c_1,
          received1_count: r_1,
          metric2_count: c_2,
          received2_count: r_2,
          winner: c_variations[0],
          loser: c_variations[1],
          variation1_id: c_variations[0],
          variation2_id: c_variations[1],
        };
      case 2:
        return {
          metric1_count: c_1,
          received1_count: r_1,
          metric2_count: c_2,
          received2_count: r_2,
          winner: c_variations[1],
          loser: c_variations[0],
          variation1_id: c_variations[0],
          variation2_id: c_variations[1],
        };

      // Insignificant: [metric_var1_count, received_var1_count, metric_var2_count, received_var2_count, winner, variation1, variation2]
      default:
        return {
          metric1_count: c_1,
          received1_count: r_1,
          metric2_count: c_2,
          received2_count: r_2,
          winner: undefined,
          variation1_id: c_variations[0],
          variation2_id: c_variations[1],
        };
    }
  }

  function significance(var1_met, var1_d, var2_met, var2_d) {
    let p_winner;
    let p_loser;
    let winner;
    let winner_d;
    let loser_d;
    let crit_z = 1.96;
    if (var1_met < 30 || var2_met < 30) {
      return -1;
    }
    if (var1_met / var1_d > var2_met / var2_d) {
      p_winner = var1_met / var1_d;
      winner_d = var1_d;
      p_loser = var2_met / var2_d;
      loser_d = var2_d;
      winner = 1;
    } else {
      p_winner = var2_met / var2_d;
      winner_d = var2_d;
      p_loser = var1_met / var1_d;
      loser_d = var1_d;
      winner = 2;
    }
    //let p_total = (var1_met + var2_met) / (var1_d + var2_d)
    let z =
      (p_winner - p_loser) /
      Math.sqrt(
        (p_winner * (1 - p_winner)) / winner_d +
          (p_loser * (1 - p_loser)) / loser_d
      );

    if (z > crit_z) {
      return winner;
    }
    return -1;
  }

  // A helper function to transform dictionary to array for easier access
  function dict_to_arr(data) {
    let result = [];
    let flow_arr = Object.keys(data);
    flow_arr.forEach(function (flow) {
      let message_arr = [];
      let messages = Object.keys(data[flow]);
      messages.forEach(function (message) {
        message_arr.push(message);
      });
      let obj = [flow, message_arr];
      result.push(obj);
    });
    return result;
  }

  // A class for test objects.
  // If there is no winner (test is insignificant, this.winner === undefined, and this.loser === [variation1_ID, va])
  class TestObject {
    constructor(
      flow_id,
      message_id,
      message_name,
      variation1_id,
      metric_1,
      received_1,
      variation2_id,
      metric_2,
      received_2,
      winner,
      loser
    ) {
      this.flow_id = flow_id;
      this.message_id = message_id;
      this.message_name = message_name;
      this.variation1_id = variation1_id;
      this.metric_1 = metric_1;
      this.received_1 = received_1;
      this.variation2_id = variation2_id;
      this.metric_2 = metric_2;
      this.received_2 = received_2;
      this.winner = winner;
      this.loser = loser;
    }
  }

  const find_intersection = (arr1, arr2) => {
    return {
      same: arr1.filter((x) => arr2.includes(x)),
      diff: arr1
        .filter((x) => !arr2.includes(x))
        .concat(arr2.filter((x) => !arr1.includes(x))),
    };
  };

  // r_keys & c_keys -- Available
  // Find intersection between those keys.

  // Returns an array of form [result_sig_tests, result_insig_tests] that indicate which tests are insignificant and which tests are significant
  // Example input: get_significant_tests(r_data, c_data)
  // Example output: [[{TestObject1}, {TestObject2}], [{TestObject3}, {TestObject4}]]
  function get_significant_tests(c_data, r_data) {
    let c_arr_data = dict_to_arr(c_data);
    let r_arr_data = dict_to_arr(r_data);

    let result_c = [];
    let result_r = [];
    for (const subArr of c_arr_data) {
      result_c.push(subArr[0]);
    }
    for (const subArr of r_arr_data) {
      result_r.push(subArr[0]);
    }

    const { same, diff } = find_intersection(result_c, result_r);
    let result_sig = [];
    let result_insig = [];
    for (let i = 0; i < same.length; i++) {
      let flow = same[i];
      let message_arr = Object.keys(c_data[flow]);
      //let flow = arr_data[i][0];
      //let message_arr = arr_data[i][1];
      for (let j = 0; j < message_arr.length; j++) {
        let message = message_arr[j];
        let test = compare_variations(flow, message, r_data, c_data);
        if (!test) continue;
        //  test = metric_1, received_1, metric_2, received_2, winner
        if (test.winner) {
          // test[4] is the winner
          let message_name = message_id_dict[message];
          let test_obj = new TestObject(
            flow,
            message,
            message_name,
            test.variation1_id,
            test.metric1_count,
            test.received1_count,
            test.variation2_id,
            test.metric2_count,
            test.received2_count,
            test.winner,
            test.loser
          );
          result_sig.push(test_obj);
        } else {
          let message_name = message_id_dict[message];
          let test_obj = new TestObject(
            flow,
            message,
            message_name,
            test.variation1_id,
            test.metric1_count,
            test.received1_count,
            test.variation2_id,
            test.metric2_count,
            test.received2_count,
            test.winner,
            test.loser
          );
          result_insig.push(test_obj);
        }
      }
    }
    return { data: [result_sig, result_insig, diff] };
  }

  async function get_tests(API_key, metric, time_frame) {
    let metric_name;
    if (metric == 0) {
      metric_name = "Opened Email";
    } else if (metric == 1) {
      metric_name = "Clicked Email";
    }

    // console.log("Got Metric");

    let main_metricID = await extract_metrics_ID(API_key, metric_name);
    let received_metricID = await extract_metrics_ID(API_key, "Received Email");

    let main_batches = await runPromiseArr(API_key, main_metricID, time_frame);

    let received_batches = await runPromiseArr(
      API_key,
      received_metricID,
      time_frame
    );

    // console.log("Got Received Batch");

    let main_data = extract_variations(main_batches, true, true);
    let received_data = extract_variations(received_batches, true, false);

    // console.log("Got Variations");

    return get_significant_tests(main_data, received_data);
  }

  try {
    return await res
      .status(200)
      .json(await get_tests(privateApiKey, metric, +daysAgo));
  } catch (error) {
    console.log(error);
  }
}
