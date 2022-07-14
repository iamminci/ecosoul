import { getTotalConsumedEnergy } from "./getTotalConsumedEnergy";
import { getTotalRenewableEnergy } from "./getTotalRenewableEnergy";

async function calculateRenewableEnergyRatio(minerId: string): Promise<number> {
  const totalConsumedEnergy = await getTotalConsumedEnergy(minerId);
  const totalRenewableEnergy = await getTotalRenewableEnergy(minerId);
  const renewableEnergyRatio = totalRenewableEnergy / totalConsumedEnergy;
  console.log("JM renewableEnergyRatio: ", renewableEnergyRatio);
  return renewableEnergyRatio;
}

if (require.main === module) {
  calculateRenewableEnergyRatio("f01051178");
}
