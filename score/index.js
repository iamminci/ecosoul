const { fetchMinerRECList } = require("./fetchMinerRECList");
const { fetchGridEmissions } = require("./fetchGridEmissions");
const { fetchMinerEnergy } = require("./fetchMinerEnergy");
const { fetchMinerLocations } = require("./fetchMinerLocations");
const { fetchMinerRECDetails } = require("./fetchMinerRECDetails");

async function main() {
  await fetchMinerLocations();
  await fetchMinerEnergy();
  await fetchGridEmissions();
  await fetchMinerRECList();
  await fetchMinerRECDetails();
}

/*

1. net carbon emissions (lower better) i.e. consumption - REC
2. REC accounting period (shorter better)
3. operational emissions (less better) - but miner has no control over that


*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
