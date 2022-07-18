# EcoSoul

EcoSoul is a soul-bound token that represents an environmental score for storage providers. This is a project being built solely for the purpose of entry into the Sustainability Hackathon and potential further development for the Filecoin community.

### The idea is as follow:

- create a certificate NFT for storage providers on the filecoin network, like an honor system to incentivize them to stay env friendly
- this will likely be a non-transferrable SBT (soul-bound token) which acts as a verified certification of your "environmental score"
- we can further expand this idea to create a token that tracks any individual's environmental score which result from their env-friendly actions

### MVP user experience:

- every SP can mint the network NFT, auto-update the NFT based on data from filecoin's api endpoints
- stretch demo: (community NFT) e.g. if a user brings a reusable bag to the grocery store, they can be rewarded in sustainability points

### Tech stack:

Frontend

- NextJS
- RainbowKit
- Wagmi Hooks
- IPFS
- Firebase, if needed

Contract

- hardhat
