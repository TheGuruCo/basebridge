// basebridge-ui/netlify/functions/publish.js

require("dotenv").config();
const { MerkleTree } = require("merkletreejs");
const keccak256      = require("keccak256");
const { utils, Wallet, Contract, JsonRpcProvider } = require("ethers");

// Load balances bundled alongside the function
const balances = require("./balances.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Build Merkle root
  const leaves = balances.map((b) =>
    utils.solidityKeccak256(
      ["address", "uint256"],
      [b.address, b.amount]
    )
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();
  const timestamp = Math.floor(Date.now() / 1000);

  // Send commit to Base Sepolia
  const provider = new JsonRpcProvider(process.env.BASEGOERLI_RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const bridge = new Contract(
    process.env.BASEBRIDGE_ADDRESS,
    ["function commit(bytes32 root, uint256 timestamp)"],
    wallet
  );

  try {
    const tx = await bridge.commit(root, timestamp);
    await tx.wait();
    return {
      statusCode: 200,
      body: JSON.stringify({ txHash: tx.hash, root, timestamp }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: err.toString() };
  }
};
