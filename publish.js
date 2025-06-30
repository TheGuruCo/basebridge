// publish.js
require("dotenv").config();
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("ethers");
const { BASEBRIDGE_ADDRESS } = require("./config");

// 1. Load mock balances
const balances = require("./data/balances.json");

// 2. Build Merkle leaves: keccak256(address + amount)
const leaves = balances.map(b =>
  ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [b.address, b.amount]
  )
);
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

// 3. Compute root and timestamp
const root = tree.getHexRoot();
const timestamp = Math.floor(Date.now() / 1000);

console.log("👉 Merkle root:", root);
console.log("👉 Timestamp:", timestamp);

// 4. Connect to Base Sepolia via ethers
const provider = new ethers.providers.JsonRpcProvider(
  process.env.BASEGOERLI_RPC_URL
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 5. Prepare the contract interface
const ABI = [
  "function commit(bytes32 root, uint256 timestamp)"
];
const bridge = new ethers.Contract(BASEBRIDGE_ADDRESS, ABI, wallet);

// 6. Send the commit transaction
async function publish() {
  console.log("⏳ Sending commit tx...");
  const tx = await bridge.commit(root, timestamp);
  console.log("✅ Tx sent — hash:", tx.hash);
  console.log("⏱ Waiting for confirmation...");
  await tx.wait();
  console.log("🎉 Commit confirmed!");
}

publish().catch(console.error);
