export type MinerScoreData = {
  carbonIntensity: number;
  accountingScore: number;
  renewableRatio: number;
};

export type FinalMinerScoreData = {
  carbonIntensity: number;
  accountingScore: number;
  renewableRatio: number;
  rScore: number;
  aScore: number;
  iScore: number;
  score: number;
  minerId: string;
  url: string;
  region: string;
  country: string;
  long: number;
  lat: number;
  hasMinted: boolean;
  rank?: number;
  tier?: string;
};

export type Epoch = {
  epoch: string;
  miner: string;
  timestamp: string;
};

export type Miner = {
  id: string;
  buyerId: string;
  blockchainAddress: string;
  region: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

export type MinerContractReportingPeriod = {
  id: string;
  startTime: number;
  endTime: number;
  period: number;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type MinerLocationData = {
  provider: string;
  region: string;
  long: number;
  lat: number;
  numLocations: number;
  country: string;
  city: string;
  delegate: string;
};

export type Contract = {
  id: string;
  productType: string;
  energySources: string;
  contractDate: string;
  deliveryDate: string;
  reportingStart: string;
  reportingEnd: string;
  buyer: any;
  seller: any;
  openVolume: string;
  deliveredVolume: string;
  purchases: string;
  timezoneOffset: string;
  filecoinNode: any;
  externalId: string;
  onchainId: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  countryRegionMap: any;
  pageUrl: string;
  dataUrl: string;
};
