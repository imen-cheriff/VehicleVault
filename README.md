# VehicleVault

VehicleVault is a decentralized marketplace for listing, buying, and transferring vehicles as on-chain assets. Every listing, sale, and ownership transfer is recorded on a Solidity smart contract — the frontend is just a window into it.

![VehicleVault dashboard](./public/VehicleVault%20Dashboard.png)

## What it does

- **List a vehicle** — set a name, description, price in ETH, and image, and it's published to the marketplace
- **Browse listings** — every item currently for sale is shown with its price and current owner
- **Filter listings** — narrow results by name or price
- **Purchase** — buy any listed item that isn't already yours, paid directly in ETH through the contract
- **Manage your garage** — see everything you own, and transfer any item to another wallet address by entering their address and confirming

## Built with

| Layer | Choice |
|---|---|
| Frontend | React |
| Chain interaction | ethers.js |
| Smart contract | Solidity |
| Styling | Plain CSS |

## Before you start

You'll need:

- Node.js and npm
- A browser wallet (MetaMask or similar)
- Access to a deployed instance of the marketplace contract — either your own deployment or one someone has shared with you

The contract expects: `listItem`, `purchaseItem`, `transferItem`, `items`, `itemCount`, `getItemsByOwner`, and `owner`. If you're deploying fresh, your Solidity contract needs to expose all of these.

## Setting it up locally

**1. Clone it**

```bash
git clone https://github.com/<your-username>/vehiclevault.git
cd vehiclevault
```

**2. Install packages**

```bash
npm install
```

**3. Point it at your contract**

Copy the example env file and drop in your own deployed contract address — this keeps your address out of the repo history:

```bash
cp .env.example .env
```

Then open `.env` and set:

```
REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

**4. Run it**

```bash
npm start
```

The app opens at `http://localhost:3000`. MetaMask will prompt you to connect a wallet on load — you'll need to be on the same network your contract is deployed to.

## Using the app

**Connecting** — approve the MetaMask prompt when the page loads. Your address appears top-right; if it matches the contract's deployer, you'll see "Owner Account" instead.

**Listing something** — fill out the form at the top (name, optional description, price in ETH, and an image URL) and hit *List Item*. This sends a transaction, so confirm it in your wallet.

**Buying something** — every card under *Items for Sale* that isn't already yours shows a *Purchase* button. Clicking it sends the listed price in ETH to the seller through the contract.

**Transferring something you own** — under *Your Own Items*, drop the recipient's wallet address into the field on the item's card and hit *Transfer*.

**Filtering** — click *Show Filters* to reveal a price range slider and a name search; *Clear Filters* resets both.

## How it's organized

```
src/
├── App.js       # all component logic and contract calls
├── App.css      # app styling
└── index.js     # React entry point
```

## Security note

Never commit a `.env` file or hardcode a private key anywhere in this project. `.env` is already listed in `.gitignore` — keep it that way.

## License

MIT — do what you like with it, just don't hold me liable for it.