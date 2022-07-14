const axios = require("axios");
const fs = require("fs");

// fetch details on REC purchases for SP of specified miner ID
function fetchMinerRECContracts() {
  const file = fs.readFileSync("minerData/miners.json");
  const miners = JSON.parse(file);

  // TODO: remove 20 hard-coded miners
  miners.slice(0, 100).forEach(({ id: minerId }) => {
    axios
      .get(
        `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`
      )
      .then((res) => {
        console.log(`Miner: ${minerId}, statusCode: ${res.status}`);

        const data = res.data;
        console.log(`Miner: ${minerId}, data: ${JSON.stringify(data)}`);

        if (!fs.existsSync(`recData`)) {
          fs.mkdirSync(`recData`, { recursive: true });
        }

        if (!fs.existsSync(`recData/contracts`)) {
          fs.mkdirSync(`recData/contracts`, { recursive: true });
        }

        fs.writeFileSync(
          `recData/contracts/${minerId}.json`,
          JSON.stringify(data)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

if (require.main === module) {
  fetchMinerRECContracts();
}

module.exports = { fetchMinerRECContracts };
