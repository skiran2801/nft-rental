async function main() {
  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy();
  await testNFT.deployed();

  console.log("TestNFT deployed to:", testNFT.address);

  // Mint some test NFTs
  await testNFT.mintBatch(5);
  console.log("Minted 5 test NFTs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 