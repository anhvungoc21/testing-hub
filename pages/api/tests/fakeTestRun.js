export default async function handler(req, res) {
  const apiKey = req.body.apiKey;
  const url = `https://a.klaviyo.com/api/v1/metrics?page=0&count=50&api_key=${apiKey}`;
  const options = { method: "GET", headers: { Accept: "application/json" } };

  fetch(url, options)
    .then((response) => {
      if (response.status === 403) {
        return res.status(403).json();
      } else {
        return res.status(200).json();
      }
    })
    .catch((err) => console.log(err));
}
