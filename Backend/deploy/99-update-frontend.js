const { network, ethers } = require("hardhat");
const {frontEndContractsFile, frontEndAbiFile} = require("../helper-hardhat-config")
const fs = require("fs")

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        await updateAbi()
        await updateContractAddress()
    }
}

async function updateContractAddress() {
    const lottery = await ethers.getContract("Lottery")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if(chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(lottery.address)) {
            contractAddresses[chainId].push(lottery.address)
        }
    } else {
        contractAddresses[chainId] = [lottery.address]
    }
    
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    console.log("\nContract Address:  ", lottery.address, "\n\n")
    fs.writeFileSync(frontEndAbiFile, lottery.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
