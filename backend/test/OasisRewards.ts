import { expect } from "chai";
import { ethers } from "hardhat";
import {Quiz, Quiz__factory} from "../typechain-types";
import {getDefaultProvider, JsonRpcProvider, toBigInt} from "ethers";
import { Console } from "console";

describe("OasisReward", function () {   
    let oasisReward;
    let owner;
    let addr1;

    async function deployNFT() {
        const Reward_factory = await ethers.getContractFactory("OasisReward");
        const oasisReward = await Reward_factory.deploy("Oasis Reward", "OASIS",
            {
            gasLimit: 3_000_000, // https://github.com/oasisprotocol/sapphire-paratime/issues/319
          }
        );
        await oasisReward.waitForDeployment();
        return { oasisReward };
      }
    it("Should generate base64 NFT successfully", async function () {
        const {oasisReward} = await deployNFT();

        // Compare the generated SVG base64 images
        const svg = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="50" fill="red" /></svg>';
        const base64EncodedSVG_test = Buffer.from(svg).toString('base64');

        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);
        expect(base64EncodedSVG.replace("data:image/svg+xml;base64,", "")).to.equal(base64EncodedSVG_test.replace("data:image/svg+xml;base64,", ""));
      });
    
      it("Should mint NFT successfully", async function () {
        [owner, addr1] = await ethers.getSigners();
        const {oasisReward} = await deployNFT();
        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);

        await oasisReward.mint(addr1.address, base64EncodedSVG);
        expect(await oasisReward.totalSupply()).to.equal(BigInt(1));
      });
    
    it("Should fail to mint NFT from non-owner account", async function () {
        const {oasisReward} = await deployNFT();
        [owner, addr1] = await ethers.getSigners();
        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);
        // console.log(await oasisReward.connect(addr1).mint(addr1.address, base64EncodedSVG));
        await expect(oasisReward.connect(addr1).mint(addr1.address, base64EncodedSVG))
            .to.be.revertedWith("Owner address not tx.origin");
    });
});