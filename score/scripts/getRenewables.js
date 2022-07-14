let axios = require("axios");
// let api_header = require('./zl_api_header.json') // API is now public
let getEnergy = require("./getEnergy");
// const json2csvparse = require("json2csv");
// const fs = require("fs");
// let findLocation =
//   require("../filecoin-sp-locations/findLocation").findLocation;

// This uses the Zero Labs API to look at every Filecoin minerID associated with EACs
// in their system, and for each one:
// Finds the location
// Determines the (upper bound) amount of energy this node has used over the network lifetime
// Compares total renewables purchases to energy consumption
// Then saves the output as EAC_purchase_summary.csv

start = "2020-07-01";
end = "2022-03-08"; // ie today's date

async function catalog_renewables_purchases(minerId) {
  // Get Transaction data
  requestString = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/transactions`;
  var transactionsResult = await axios.get(requestString);

  // Record transaction data
  const pageUrl = transactionsResult.data.pageUrl;
  const deliveredEACs_MWh = transactionsResult.data.recsTotal / 1e6;
  // console.log("redeemed EACs_MWh: ", deliveredEACs_MWh);

  // Get Contracts data
  requestString = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`;
  var contractsResult = await axios.get(requestString);

  // Sum and record volume under contract
  openVol = contractsResult.data.contracts.reduce((previousValue, elem) => {
    newVol = Number.parseInt(elem.openVolume);
    return previousValue + newVol;
  }, 0);
  const openEACContracts_MWh = openVol / 1e6;
  // console.log("available EACs_MWh: ", openEACContracts_MWh);
  const AllEACs_MWh = deliveredEACs_MWh + openEACContracts_MWh;
  console.log("all EACs_MWh: ", AllEACs_MWh);

  // Compare to the volume of energy consumed by this node over the history of the network
  enResult = await getEnergy.get_total_energy_data(start, end, minerId);
  const energyConsumed_Upper_MWh = enResult.total_energy_upper_MWh;
  console.log("energyConsumed_Upper_MWh: ", energyConsumed_Upper_MWh);
  const Renewable_Consumed_Ratio = AllEACs_MWh / energyConsumed_Upper_MWh;
  console.log("Renewable_Consumed_Ratio: ", Renewable_Consumed_Ratio);
}

catalog_renewables_purchases("f01051178");

module.exports = { catalog_renewables_purchases };
