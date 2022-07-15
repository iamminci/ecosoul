const { fetchMinerRECList } = require("./fetchMinerRECList");
const { fetchGridEmissions } = require("./fetchGridEmissions");
const { fetchMinerEnergy } = require("./fetchMinerEnergy");
const { fetchMinerLocations } = require("./fetchMinerLocations");
const { fetchMinerRECDetails } = require("./fetchMinerRECTransactions");

async function main() {
  await fetchMinerLocations();
  await fetchMinerEnergy();
  await fetchGridEmissions();
  await fetchMinerRECList();
  await fetchMinerRECDetails();
}

/*

1. net carbon emissions (lower better) i.e. total energy consumed (consumption) - REC offset
2. REC accounting period (shorter better), but how to calculate this?
3. operational emissions (less better) - but miner has no control over that


*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
