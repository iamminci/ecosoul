const axios = require("axios");
const fs = require("fs");

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
function fetchMinerRECList() {
  axios
    .get(`https://proofs-api.zerolabs.green/api/partners/filecoin/nodes`)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);

      const data = res.data.data;
      console.log(`data: ${JSON.stringify(data)}`);

      if (!fs.existsSync(`recData`)) {
        fs.mkdirSync(`recData`, { recursive: true });
      }

      fs.writeFileSync(`recData/miners.json`, JSON.stringify(data));
    })
    .catch((error) => {
      console.error(error);
    });
}

if (require.main === module) {
  fetchMinerRECList();
}

module.exports = { fetchMinerRECList };
