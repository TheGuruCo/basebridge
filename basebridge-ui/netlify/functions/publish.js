// basebridge-ui/netlify/functions/publish.js
require("dotenv").config();
const { MerkleTree } = require("merkletreejs");
const keccak256      = require("keccak256");
const { ethers }     = require("ethers");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 1. Load balances from our public folder
  const balances = require(`${__dirname}/../../public/balances.json`);

  // 2. Build the Merkle tree
  const leaves = balances.map(b =>
    ethers.utils.solidityKeccak256(
      ["address","uint256"],
      [b.address, b.amount]
    )
  );
  const tree      = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root      = tree.getHexRoot();
  const timestamp = Math.floor(Date.now() / 1000);

  // 3. Send commit to Base Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.BASEGOERLI_RPC_URL);
  const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const bridge   = new ethers.Contract(
    process.env.BASEBRIDGE_ADDRESS,
    ["function commit(bytes32 root, uint256 timestamp)"],
    wallet
  );

  try {
    const tx = await bridge.commit(root, timestamp);
    await tx.wait();
    return {
      statusCode: 200,
      body: JSON.stringify({ txHash: tx.hash, root, timestamp })
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: e.toString() };
  }
};
