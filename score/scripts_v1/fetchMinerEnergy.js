const axios = require("axios");
const fs = require("fs");

const models = {
  0: "energy_intensity",
  1: "renewable_energy_ratio",
  2: "energy_consumption_rate",
  3: "energy_to_seal_data",
  4: "energy_to_store_data",
  5: "cumulative_energy_use",
  6: "cumulative_renewable_energy_purchases",
  7: "data_storage_capacity_added_per_day",
  8: "data_storage_capacity",
};

// fetch energy consumption details for specified SP
function fetchMinerEnergy() {
  const file = fs.readFileSync("location.json");
  const data = JSON.parse(file);

  const miners = ["f0101018"];

  miners.forEach((minerId) => {
    Object.keys(models).forEach((modelId) => {
      axios
        .get(
          ` https://api.filgreen.d.interplanetary.one/models/export?id=${modelId}&miner=${minerId}`
        )
        .then((res) => {
          console.log(
            `Model: ${modelId}, Miner: ${minerId}, statusCode: ${res.status}`
          );

          const data = res.data.data;
          console.log(
            `Model: ${modelId}, Miner: ${minerId}, data: ${JSON.stringify(
              data
            )}`
          );

          const modelName = models[modelId];

          if (!fs.existsSync(`minerData`)) fs.mkdirSync(`minerData`);

          if (!fs.existsSync(`minerData/${minerId}`))
            fs.mkdirSync(`minerData/${minerId}`, { recursive: true });

          fs.writeFileSync(
            `minerData/${minerId}/${modelName}.json`,
            JSON.stringify(data)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
}

if (require.main === module) {
  fetchMinerEnergy();
}

module.exports = { fetchMinerEnergy };
