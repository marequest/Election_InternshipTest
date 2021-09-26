const WakandaContract = artifacts.require("WakandaContract");
const WKND = artifacts.require("WKND");

module.exports = async function(deployer) {
    deployer.deploy(WKND);
    // const wkndContract = await WKND.deployed();

    deployer.deploy(WakandaContract);
};