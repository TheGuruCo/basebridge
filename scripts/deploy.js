const hre = require("hardhat");

async function main() {
  // Compile & deploy BaseBridge
  const Factory = await hre.ethers.getContractFactory("BaseBridge");
  const bridge = await Factory.deploy();
  await bridge.deployed();

  console.log("✅ BaseBridge deployed to:", bridge.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
