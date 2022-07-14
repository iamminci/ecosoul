const axios = require("axios");
const fs = require("fs");

// fetch locations of all Filecoin SPs
function fetchMinerLocations() {
  axios
    .get(
      "https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-locations-latest.json"
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log(`response body: ${res.data}`);

      const data = res.data;
      fs.writeFileSync("location.json", JSON.stringify(data));
    })
    .catch((error) => {
      console.error(error);
    });
}

if (require.main === module) {
  fetchMinerLocations();
}

module.exports = { fetchMinerLocations };
