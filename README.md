# EcoSoul: A Community Reputation System for Filecoin Storage Providers

EcoSoul is a soul-bound token that represents an environmental score for storage providers. This is a project being built solely for the purpose of entry into the Sustainability Hackathon and potential further development for the Filecoin community.

### Context

Filecoin aims to be the greenest blockchain. To achieve that goal, the Filecoin SP's (i.e. the largest sources of energy expenditures for FIL) must be environmentally friendly.

How can we make SP’s operate more sustainably? Here's my take: create a green reputation score by which we can measure how “green” each SP operates and then a community incentive structure that rewards those who have a higher score.

EcoSoul is that solution. A community reputation system for FIL Storage Providers which brings their green operations to life with a concrete, metric-driven "green reputation score", community NFT that stores those scores on-chain, and a leaderboard to compare scores.


### MVP user experience:
- create a certificate NFT for storage providers on the filecoin network, like an honor system to incentivize them to stay env friendly
- this will likely be a non-transferrable SBT (soul-bound token) which acts as a verified certification of your "environmental score"
- we can further expand this idea to create a token that tracks any individual's environmental score which result from their env-friendly actions
- every SP can mint the network NFT, auto-update the NFT based on data from filecoin's api endpoints
- stretch demo: (community NFT) e.g. if a user brings a reusable bag to the grocery store, they can be rewarded in sustainability points

### Tech stack:

- NextJS
- RainbowKit
- Wagmi Hooks
- IPFS (Pinata, Fleek)
- Firebase
- Hardhat
