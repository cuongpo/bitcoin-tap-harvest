// Script to deploy the BitcoinGameToken contract
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying BitcoinGameToken...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get the contract factory
  const BitcoinGameToken = await ethers.getContractFactory("BitcoinGameToken");
  
  // Deploy the contract
  const token = await BitcoinGameToken.deploy();
  
  console.log("Transaction hash:", token.deployTransaction.hash);
  
  // Wait for deployment to finish
  await token.deployed();
  
  // Get the contract address
  const tokenAddress = token.address;
  
  console.log(`BitcoinGameToken deployed to: ${tokenAddress}`);
  console.log("Token Name:", await token.name());
  console.log("Token Symbol:", await token.symbol());
  console.log("Total Supply:", await token.totalSupply());
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
