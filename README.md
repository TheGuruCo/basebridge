
```markdown
# BaseBridge
a crisp demo of how Coinbase Prime/Custody clients could get transparent, on‐chain proof‐of‐reserves on Base.

**On‐chain Proof‐of‐Reserves demo on Base Sepolia**  
A minimal Hardhat + React + Netlify Functions app that:
1. Deploys a `BaseBridge` smart contract (emits `ReserveCommitted` events).
2. Builds & publishes a Merkle‐root of off‐chain balances.
3. Displays mock balances and the latest on‐chain commitment in a polished React UI.

---

## 🛠 Project Structure

```

basebridge/
├─ contracts/                Solidity contract (`BaseBridge.sol`)
├─ scripts/                  Hardhat deploy script (`deploy.js`)
├─ data/                     Mock balances JSON (balances.json)
├─ publish.js                Local Merkle‐publisher script
├─ config.js                 Contract address reference
├─ basebridge-ui/            React UI & Netlify functions
│  ├─ public/balances.json   Copy of mock balances
│  ├─ src/                   React source (`App.js`, `App.css`)
│  └─ netlify/functions/     Serverless function (`publish.js`)
├─ .env                      Hardhat env (RPC URL, PRIVATE\_KEY)
└─ netlify.toml              Netlify build + functions config

````

---

## Prerequisites

- **Node.js & npm**  
- **A Base Sepolia testnet account** (e.g. via Coinbase Wallet)  
- **Goerli/Sepolia ETH** from a free faucet  
- **Git & GitHub** for repo hosting  

---

## Local Setup

1. **Clone & install**  
   ```bash
   git clone https://github.com/your-username/basebridge.git
   cd basebridge
   npm install
````

2. **Configure environment**

   ```bash
   # in ./basebridge/.env
   BASEGOERLI_RPC_URL=https://base-sepolia-rpc.publicnode.com
   PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
   ```

3. **Compile & deploy contract**

   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network basegoerli
   ```

4. **Publish a Merkle‐root locally (test)**

   ```bash
   node publish.js
   ```

5. **Run the React UI**

   ```bash
   cd basebridge-ui
   npm install
   npm start
   ```

---

## Deploy to Netlify

1. Push this repo to GitHub (you’ve done that).
2. In Netlify:

   * **Connect** your GitHub `basebridge` repo.
   * **Build command**: `npm run build`
   * **Publish directory**: `basebridge-ui/build`
   * **Functions directory**: `basebridge-ui/netlify/functions`
3. **Set Netlify env vars** (Site settings → Environment):

   * `BASEGOERLI_RPC_URL`
   * `PRIVATE_KEY`
   * `BASEBRIDGE_ADDRESS`
4. Trigger a deploy. Your site (with `/publish` Lambda) will be live.

---

## Next Steps

* Wire the React “Publish Now” button to `fetch("/.netlify/functions/publish", { method: "POST" })`.
* Show a loading spinner / toast on success.
* Share your Netlify URL with recruiters!

---

> 

---