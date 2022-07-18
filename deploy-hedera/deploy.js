const {
  ContractCreateFlow,
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} = require("@hashgraph/sdk");

const dotenv = require("dotenv");
dotenv.config();

const bytecode =
  "60806040523480156200001157600080fd5b506040518060400160405280600781526020017f45636f536f756c000000000000000000000000000000000000000000000000008152506040518060400160405280600781526020017f45434f534f554c00000000000000000000000000000000000000000000000000815250816000908051906020019062000096929190620001ae565b508060019080519060200190620000af929190620001ae565b505050620000d2620000c6620000e060201b60201c565b620000e860201b60201c565b6001600781905550620002c3565b600033905090565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b828054620001bc906200025e565b90600052602060002090601f016020900481019282620001e057600085556200022c565b82601f10620001fb57805160ff19168380011785556200022c565b828001600101855582156200022c579182015b828111156200022b5782518255916020019190600101906200020e565b5b5090506200023b91906200023f565b5090565b5b808211156200025a57600081600090555060010162000240565b5090565b600060028204905060018216806200027757607f821691505b602082108114156200028e576200028d62000294565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6135ca80620002d36000396000f3fe6080604052600436106101c65760003560e01c806355f804b3116100f757806395d89b4111610095578063c87b56dd11610064578063c87b56dd146105f2578063e8a3d4851461062f578063e985e9c51461065a578063f2fde38b14610697576101cd565b806395d89b411461054a578063a22cb46514610575578063b58b79921461059e578063b88d4fde146105c9576101cd565b8063714c5398116100d1578063714c5398146104b2578063715018a6146104dd57806383c4c00d146104f45780638da5cb5b1461051f576101cd565b806355f804b31461040f5780636352211e1461043857806370a0823114610475576101cd565b80632639f4601161016457806337929eb41161013e57806337929eb41461037b5780633ccfd60b146103a657806342842e0e146103bd57806349df728c146103e6576101cd565b80632639f460146102fe5780632f2fe7211461032757806333039d3d14610350576101cd565b8063095ea7b3116101a0578063095ea7b31461027757806311e3dbca146102a05780631249c58b146102cb57806323b872dd146102d5576101cd565b806301ffc9a7146101d257806306fdde031461020f578063081812fc1461023a576101cd565b366101cd57005b600080fd5b3480156101de57600080fd5b506101f960048036038101906101f491906124bb565b6106c0565b6040516102069190612a55565b60405180910390f35b34801561021b57600080fd5b506102246107a2565b6040516102319190612a8b565b60405180910390f35b34801561024657600080fd5b50610261600480360381019061025c919061258b565b610834565b60405161026e91906129c5565b60405180910390f35b34801561028357600080fd5b5061029e60048036038101906102999190612421565b61087a565b005b3480156102ac57600080fd5b506102b5610992565b6040516102c29190612cad565b60405180910390f35b6102d3610998565b005b3480156102e157600080fd5b506102fc60048036038101906102f7919061230b565b610a4f565b005b34801561030a57600080fd5b5061032560048036038101906103209190612542565b610aaf565b005b34801561033357600080fd5b5061034e6004803603810190610349919061248e565b610ad1565b005b34801561035c57600080fd5b50610365610ae3565b6040516103729190612cad565b60405180910390f35b34801561038757600080fd5b50610390610ae9565b60405161039d9190612a8b565b60405180910390f35b3480156103b257600080fd5b506103bb610b7b565b005b3480156103c957600080fd5b506103e460048036038101906103df919061230b565b610bd2565b005b3480156103f257600080fd5b5061040d60048036038101906104089190612515565b610bf2565b005b34801561041b57600080fd5b5061043660048036038101906104319190612542565b610d19565b005b34801561044457600080fd5b5061045f600480360381019061045a919061258b565b610d3b565b60405161046c91906129c5565b60405180910390f35b34801561048157600080fd5b5061049c6004803603810190610497919061229e565b610ded565b6040516104a99190612cad565b60405180910390f35b3480156104be57600080fd5b506104c7610ea5565b6040516104d49190612a8b565b60405180910390f35b3480156104e957600080fd5b506104f2610f37565b005b34801561050057600080fd5b50610509610f4b565b6040516105169190612cad565b60405180910390f35b34801561052b57600080fd5b50610534610f5c565b60405161054191906129c5565b60405180910390f35b34801561055657600080fd5b5061055f610f86565b60405161056c9190612a8b565b60405180910390f35b34801561058157600080fd5b5061059c600480360381019061059791906123e1565b611018565b005b3480156105aa57600080fd5b506105b361102e565b6040516105c09190612a70565b60405180910390f35b3480156105d557600080fd5b506105f060048036038101906105eb919061235e565b611034565b005b3480156105fe57600080fd5b506106196004803603810190610614919061258b565b611096565b6040516106269190612a8b565b60405180910390f35b34801561063b57600080fd5b50610644611112565b6040516106519190612a8b565b60405180910390f35b34801561066657600080fd5b50610681600480360381019061067c91906122cb565b6111a4565b60405161068e9190612a55565b60405180910390f35b3480156106a357600080fd5b506106be60048036038101906106b9919061229e565b611238565b005b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061078b57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061079b575061079a826112bc565b5b9050919050565b6060600080546107b190612f34565b80601f01602080910402602001604051908101604052809291908181526020018280546107dd90612f34565b801561082a5780601f106107ff5761010080835404028352916020019161082a565b820191906000526020600020905b81548152906001019060200180831161080d57829003601f168201915b5050505050905090565b600061083f82611326565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061088582610d3b565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156108f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ed90612c4d565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610915611371565b73ffffffffffffffffffffffffffffffffffffffff16148061094457506109438161093e611371565b6111a4565b5b610983576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097a90612bcd565b60405180910390fd5b61098d8383611379565b505050565b600b5481565b600260075414156109de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d590612c8d565b60405180910390fd5b60026007819055506113886109f36008611432565b1115610a34576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2b90612b6d565b60405180910390fd5b610a4533610a40611440565b61145b565b6001600781905550565b610a60610a5a611371565b82611479565b610a9f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a9690612c6d565b60405180910390fd5b610aaa83838361150e565b505050565b610ab7611775565b80600a9080519060200190610acd92919061205e565b5050565b610ad9611775565b80600c8190555050565b61138881565b6060600a8054610af890612f34565b80601f0160208091040260200160405190810160405280929190818152602001828054610b2490612f34565b8015610b715780601f10610b4657610100808354040283529160200191610b71565b820191906000526020600020905b815481529060010190602001808311610b5457829003601f168201915b5050505050905090565b610b83611775565b60004790503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610bce573d6000803e3d6000fd5b5050565b610bed83838360405180602001604052806000815250611034565b505050565b610bfa611775565b60008173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610c3591906129c5565b60206040518083038186803b158015610c4d57600080fd5b505afa158015610c61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c8591906125b8565b90508173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b8152600401610cc2929190612a2c565b602060405180830381600087803b158015610cdc57600080fd5b505af1158015610cf0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d149190612461565b505050565b610d21611775565b8060099080519060200190610d3792919061205e565b5050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610de4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ddb90612c2d565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610e5e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e5590612b8d565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060098054610eb490612f34565b80601f0160208091040260200160405190810160405280929190818152602001828054610ee090612f34565b8015610f2d5780601f10610f0257610100808354040283529160200191610f2d565b820191906000526020600020905b815481529060010190602001808311610f1057829003601f168201915b5050505050905090565b610f3f611775565b610f4960006117f3565b565b6000610f576008611432565b905090565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060018054610f9590612f34565b80601f0160208091040260200160405190810160405280929190818152602001828054610fc190612f34565b801561100e5780601f10610fe35761010080835404028352916020019161100e565b820191906000526020600020905b815481529060010190602001808311610ff157829003601f168201915b5050505050905090565b61102a611023611371565b83836118b9565b5050565b600c5481565b61104561103f611371565b83611479565b611084576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161107b90612c6d565b60405180910390fd5b61109084848484611a26565b50505050565b60606110a182611a82565b6110e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110d790612bad565b60405180910390fd5b60096110eb83611aee565b6040516020016110fc929190612996565b6040516020818303038152906040529050919050565b6060600a805461112190612f34565b80601f016020809104026020016040519081016040528092919081815260200182805461114d90612f34565b801561119a5780601f1061116f5761010080835404028352916020019161119a565b820191906000526020600020905b81548152906001019060200180831161117d57829003601f168201915b5050505050905090565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b611240611775565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156112b0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112a790612acd565b60405180910390fd5b6112b9816117f3565b50565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b61132f81611a82565b61136e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161136590612c2d565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff166113ec83610d3b565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600081600001549050919050565b600061144c6008611c4f565b6114566008611432565b905090565b611475828260405180602001604052806000815250611c65565b5050565b60008061148583610d3b565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806114c757506114c681856111a4565b5b8061150557508373ffffffffffffffffffffffffffffffffffffffff166114ed84610834565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff1661152e82610d3b565b73ffffffffffffffffffffffffffffffffffffffff1614611584576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161157b90612aed565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156115f4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115eb90612b2d565b60405180910390fd5b6115ff838383611cc0565b61160a600082611379565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461165a9190612e2e565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116b19190612da7565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611770838383611cc5565b505050565b61177d611371565b73ffffffffffffffffffffffffffffffffffffffff1661179b610f5c565b73ffffffffffffffffffffffffffffffffffffffff16146117f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117e890612c0d565b60405180910390fd5b565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611928576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161191f90612b4d565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611a199190612a55565b60405180910390a3505050565b611a3184848461150e565b611a3d84848484611cca565b611a7c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a7390612aad565b60405180910390fd5b50505050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60606000821415611b36576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050611c4a565b600082905060005b60008214611b68578080611b5190612f97565b915050600a82611b619190612dfd565b9150611b3e565b60008167ffffffffffffffff811115611b8457611b836130cd565b5b6040519080825280601f01601f191660200182016040528015611bb65781602001600182028036833780820191505090505b5090505b60008514611c4357600182611bcf9190612e2e565b9150600a85611bde9190612fe0565b6030611bea9190612da7565b60f81b818381518110611c0057611bff61309e565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a85611c3c9190612dfd565b9450611bba565b8093505050505b919050565b6001816000016000828254019250508190555050565b611c6f8383611e61565b611c7c6000848484611cca565b611cbb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cb290612aad565b60405180910390fd5b505050565b505050565b505050565b6000611ceb8473ffffffffffffffffffffffffffffffffffffffff1661203b565b15611e54578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611d14611371565b8786866040518563ffffffff1660e01b8152600401611d3694939291906129e0565b602060405180830381600087803b158015611d5057600080fd5b505af1925050508015611d8157506040513d601f19601f82011682018060405250810190611d7e91906124e8565b60015b611e04573d8060008114611db1576040519150601f19603f3d011682016040523d82523d6000602084013e611db6565b606091505b50600081511415611dfc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611df390612aad565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611e59565b600190505b949350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611ed1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ec890612bed565b60405180910390fd5b611eda81611a82565b15611f1a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611f1190612b0d565b60405180910390fd5b611f2660008383611cc0565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611f769190612da7565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a461203760008383611cc5565b5050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b82805461206a90612f34565b90600052602060002090601f01602090048101928261208c57600085556120d3565b82601f106120a557805160ff19168380011785556120d3565b828001600101855582156120d3579182015b828111156120d25782518255916020019190600101906120b7565b5b5090506120e091906120e4565b5090565b5b808211156120fd5760008160009055506001016120e5565b5090565b600061211461210f84612ced565b612cc8565b9050828152602081018484840111156121305761212f613101565b5b61213b848285612ef2565b509392505050565b600061215661215184612d1e565b612cc8565b90508281526020810184848401111561217257612171613101565b5b61217d848285612ef2565b509392505050565b6000813590506121948161350a565b92915050565b6000813590506121a981613521565b92915050565b6000815190506121be81613521565b92915050565b6000813590506121d381613538565b92915050565b6000813590506121e88161354f565b92915050565b6000815190506121fd8161354f565b92915050565b600082601f830112612218576122176130fc565b5b8135612228848260208601612101565b91505092915050565b60008135905061224081613566565b92915050565b600082601f83011261225b5761225a6130fc565b5b813561226b848260208601612143565b91505092915050565b6000813590506122838161357d565b92915050565b6000815190506122988161357d565b92915050565b6000602082840312156122b4576122b361310b565b5b60006122c284828501612185565b91505092915050565b600080604083850312156122e2576122e161310b565b5b60006122f085828601612185565b925050602061230185828601612185565b9150509250929050565b6000806000606084860312156123245761232361310b565b5b600061233286828701612185565b935050602061234386828701612185565b925050604061235486828701612274565b9150509250925092565b600080600080608085870312156123785761237761310b565b5b600061238687828801612185565b945050602061239787828801612185565b93505060406123a887828801612274565b925050606085013567ffffffffffffffff8111156123c9576123c8613106565b5b6123d587828801612203565b91505092959194509250565b600080604083850312156123f8576123f761310b565b5b600061240685828601612185565b92505060206124178582860161219a565b9150509250929050565b600080604083850312156124385761243761310b565b5b600061244685828601612185565b925050602061245785828601612274565b9150509250929050565b6000602082840312156124775761247661310b565b5b6000612485848285016121af565b91505092915050565b6000602082840312156124a4576124a361310b565b5b60006124b2848285016121c4565b91505092915050565b6000602082840312156124d1576124d061310b565b5b60006124df848285016121d9565b91505092915050565b6000602082840312156124fe576124fd61310b565b5b600061250c848285016121ee565b91505092915050565b60006020828403121561252b5761252a61310b565b5b600061253984828501612231565b91505092915050565b6000602082840312156125585761255761310b565b5b600082013567ffffffffffffffff81111561257657612575613106565b5b61258284828501612246565b91505092915050565b6000602082840312156125a1576125a061310b565b5b60006125af84828501612274565b91505092915050565b6000602082840312156125ce576125cd61310b565b5b60006125dc84828501612289565b91505092915050565b6125ee81612e62565b82525050565b6125fd81612e74565b82525050565b61260c81612e80565b82525050565b600061261d82612d64565b6126278185612d7a565b9350612637818560208601612f01565b61264081613110565b840191505092915050565b600061265682612d6f565b6126608185612d8b565b9350612670818560208601612f01565b61267981613110565b840191505092915050565b600061268f82612d6f565b6126998185612d9c565b93506126a9818560208601612f01565b80840191505092915050565b600081546126c281612f34565b6126cc8186612d9c565b945060018216600081146126e757600181146126f85761272b565b60ff1983168652818601935061272b565b61270185612d4f565b60005b8381101561272357815481890152600182019150602081019050612704565b838801955050505b50505092915050565b6000612741603283612d8b565b915061274c82613121565b604082019050919050565b6000612764602683612d8b565b915061276f82613170565b604082019050919050565b6000612787602583612d8b565b9150612792826131bf565b604082019050919050565b60006127aa601c83612d8b565b91506127b58261320e565b602082019050919050565b60006127cd602483612d8b565b91506127d882613237565b604082019050919050565b60006127f0601983612d8b565b91506127fb82613286565b602082019050919050565b6000612813601d83612d8b565b915061281e826132af565b602082019050919050565b6000612836602983612d8b565b9150612841826132d8565b604082019050919050565b6000612859601283612d8b565b915061286482613327565b602082019050919050565b600061287c603e83612d8b565b915061288782613350565b604082019050919050565b600061289f602083612d8b565b91506128aa8261339f565b602082019050919050565b60006128c2602083612d8b565b91506128cd826133c8565b602082019050919050565b60006128e5601883612d8b565b91506128f0826133f1565b602082019050919050565b6000612908602183612d8b565b91506129138261341a565b604082019050919050565b600061292b602e83612d8b565b915061293682613469565b604082019050919050565b600061294e601f83612d8b565b9150612959826134b8565b602082019050919050565b6000612971600183612d9c565b915061297c826134e1565b600182019050919050565b61299081612ee8565b82525050565b60006129a282856126b5565b91506129ad82612964565b91506129b98284612684565b91508190509392505050565b60006020820190506129da60008301846125e5565b92915050565b60006080820190506129f560008301876125e5565b612a0260208301866125e5565b612a0f6040830185612987565b8181036060830152612a218184612612565b905095945050505050565b6000604082019050612a4160008301856125e5565b612a4e6020830184612987565b9392505050565b6000602082019050612a6a60008301846125f4565b92915050565b6000602082019050612a856000830184612603565b92915050565b60006020820190508181036000830152612aa5818461264b565b905092915050565b60006020820190508181036000830152612ac681612734565b9050919050565b60006020820190508181036000830152612ae681612757565b9050919050565b60006020820190508181036000830152612b068161277a565b9050919050565b60006020820190508181036000830152612b268161279d565b9050919050565b60006020820190508181036000830152612b46816127c0565b9050919050565b60006020820190508181036000830152612b66816127e3565b9050919050565b60006020820190508181036000830152612b8681612806565b9050919050565b60006020820190508181036000830152612ba681612829565b9050919050565b60006020820190508181036000830152612bc68161284c565b9050919050565b60006020820190508181036000830152612be68161286f565b9050919050565b60006020820190508181036000830152612c0681612892565b9050919050565b60006020820190508181036000830152612c26816128b5565b9050919050565b60006020820190508181036000830152612c46816128d8565b9050919050565b60006020820190508181036000830152612c66816128fb565b9050919050565b60006020820190508181036000830152612c868161291e565b9050919050565b60006020820190508181036000830152612ca681612941565b9050919050565b6000602082019050612cc26000830184612987565b92915050565b6000612cd2612ce3565b9050612cde8282612f66565b919050565b6000604051905090565b600067ffffffffffffffff821115612d0857612d076130cd565b5b612d1182613110565b9050602081019050919050565b600067ffffffffffffffff821115612d3957612d386130cd565b5b612d4282613110565b9050602081019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612db282612ee8565b9150612dbd83612ee8565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612df257612df1613011565b5b828201905092915050565b6000612e0882612ee8565b9150612e1383612ee8565b925082612e2357612e22613040565b5b828204905092915050565b6000612e3982612ee8565b9150612e4483612ee8565b925082821015612e5757612e56613011565b5b828203905092915050565b6000612e6d82612ec8565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6000612ec182612e62565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612f1f578082015181840152602081019050612f04565b83811115612f2e576000848401525b50505050565b60006002820490506001821680612f4c57607f821691505b60208210811415612f6057612f5f61306f565b5b50919050565b612f6f82613110565b810181811067ffffffffffffffff82111715612f8e57612f8d6130cd565b5b80604052505050565b6000612fa282612ee8565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612fd557612fd4613011565b5b600182019050919050565b6000612feb82612ee8565b9150612ff683612ee8565b92508261300657613005613040565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f496e73756666696369656e7420746f6b656e732072656d61696e696e67000000600082015250565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b7f4e6f6e2d6578697374656e7420746f6b656e0000000000000000000000000000600082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206e6f7220617070726f76656420666f7220616c6c0000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206e6f7220617070726f766564000000000000000000000000000000000000602082015250565b7f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00600082015250565b7f2f00000000000000000000000000000000000000000000000000000000000000600082015250565b61351381612e62565b811461351e57600080fd5b50565b61352a81612e74565b811461353557600080fd5b50565b61354181612e80565b811461354c57600080fd5b50565b61355881612e8a565b811461356357600080fd5b50565b61356f81612eb6565b811461357a57600080fd5b50565b61358681612ee8565b811461359157600080fd5b5056fea2646970667358221220c806d1b9d20b0636d11394c06930375336585def875c216cfa2243806f6b7ca264736f6c63430008070033";

const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

const client = Client.forTestnet().setOperator(accountId, privateKey);

const uploadContract = async () => {
  const contractTx = new ContractCreateFlow()
    .setGas(1000000)
    .setBytecode(bytecode);

  const contractRes = contractTx.execute(client);
  const receipt = (await contractRes).getReceipt(client);

  const newContractId = (await receipt).contractId;
  console.log(`New contract id: ${newContractId}`);
};

// uploadContract();

// contract ID: 0.0.47699235

const uploadNFT = async () => {
  const supplyKey = PrivateKey.generate();
  const adminKey = PrivateKey.generate();

  const createNFT = await new TokenCreateTransaction()
    .setTokenName("EcoSoul Community NFT")
    .setTokenSymbol("ECOSOUL")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(accountId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(5000)
    // .setAdminKey(adminKey)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  // const nftCreateSign = await createNFT.sign(adminKey);
  const contractRes = await createNFT.execute(client);
  const receipt = await contractRes.getReceipt(client);

  // const tokenId = receipt.tokenId;

  // const nftCreateSign = await createNFT.sign(adminKey);
  // const mintTxSubmit = await nftCreateSign.execute(client);
  // const nftCreateReceipt = await mintTxSubmit.getReceipt(client);
  // const tokenId = nftCreateReceipt.tokenId;
  console.log("tokenId: ", receipt.tokenId);
};

uploadNFT();