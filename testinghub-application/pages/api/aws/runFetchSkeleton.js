import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_AWS_REGION,
};

AWS.config.update(awsConfig);

const lambda = new AWS.Lambda({
  region: process.env.NEXT_AWS_REGION,
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
    const awsRes = await async_lambda_invoke(privateApiKey);
    return res.status(200).json({
      message: "Data for your API Key is being fetched. Ready in 5-10 minutes!",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
