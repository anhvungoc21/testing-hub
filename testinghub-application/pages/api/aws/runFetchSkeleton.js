import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: "AKIASKYT4SVEJTTVTRF2",
  secretAccessKey: "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",
  region: "us-east-1",
};

AWS.config.update(awsConfig);

const lambda = new AWS.Lambda({
  region: "us-east-1",
});

const async_lambda_invoke = async (apiKey) => {
  const payload = { apiKey: apiKey };
  const FunctionName = `fetchAndCreateSkeleton`;
  return lambda
    .invoke({
      FunctionName,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    })
    .promise();
};

export default async function handler(req, res) {
  const privateApiKey = req.body.apiKey;
  try {
    return await res.status(200).json(await async_lambda_invoke(privateApiKey));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
