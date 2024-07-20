import { expect } from "chai";
import { ethers } from "hardhat";
import { Quiz, Quiz__factory } from "../typechain-types";
import { getDefaultProvider, JsonRpcProvider, toBigInt } from "ethers";
import { Console } from "console";

describe("OasisReward", function () {
    let oasisReward;
    let owner;
    let addr1;

    async function deployQuiz() {
        const Quiz_factory = await ethers.getContractFactory("Quiz");
        const quiz = await Quiz_factory.deploy({
            gasLimit: 10_000_000, // https://github.com/oasisprotocol/sapphire-paratime/issues/319
            value: ethers.parseEther("10.00"),
        }
        );
        await quiz.waitForDeployment();
        return { quiz };
    }
    async function deployNFT() {
        const Reward_factory = await ethers.getContractFactory("OasisReward");
        const oasisReward = await Reward_factory.deploy("Oasis Reward", "OASIS",
            {
                gasLimit: 10_000_000, // https://github.com/oasisprotocol/sapphire-paratime/issues/319
            }
        );
        await oasisReward.waitForDeployment();
        return { oasisReward };
    }
    async function addQuestions(quiz: Quiz) {
        await quiz.addQuestion("What's the European highest peak?", ["Mont Blanc", "Triglav", "Mount Everest", "Saint Moritz", "Sv. Jošt nad Kranjem"]);
        await quiz.addQuestion("When was the Bitcoin whitepaper published?", ["2009", "2000", "2006", "2012", "2014", "2023"]);
      }
    async function addCoupons(quiz: Quiz) {
        await quiz.addCoupons(["testCoupon1", "testCoupon2"]);
      }
    it("Should generate base64 NFT successfully", async function () {
        const { oasisReward } = await deployNFT();

        // Compare the generated SVG base64 images
        const svg = '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="50" fill="red" /></svg>';
        const base64EncodedSVG_test = Buffer.from(svg).toString('base64');

        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);
        expect(base64EncodedSVG.replace("data:image/svg+xml;base64,", "")).to.equal(base64EncodedSVG_test.replace("data:image/svg+xml;base64,", ""));
    });

    it("Should mint NFT successfully", async function () {
        [owner, addr1] = await ethers.getSigners();
        const { oasisReward } = await deployNFT();
        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);

        await oasisReward.mint(addr1.address, base64EncodedSVG);
        expect(await oasisReward.totalSupply()).to.equal(BigInt(1));
    });

    it("should deploy, set questions, answer correctly, and claim reward", async function () {
        // Deploy the contract
        const OasisRewards = deployNFT();
        const { quiz } = await deployQuiz();

        // Set questions (assuming a function exists for this)
        // Replace "question1", "question2" with actual questions and answers
        await addQuestions(quiz);

        // Answer questions correctly (assuming a function exists for this)
        // This step might vary greatly depending on your contract's logic
        await oasisRewards.answerQuestions(["answer1", "answer2"]);

        // Claim reward
        const tx = await oasisRewards.claimReward();

        // Assertions
        // Example: Check if an NFT was minted to the caller
        // This will depend on your contract's events and functions
        await expect(tx).to.emit(oasisRewards, "RewardClaimed").withArgs(/* expected args */);

        // Further checks can include verifying the owner of the NFT, the total supply, etc.
    });


    it("Should mint from whitelisted quiz", async function () {
        const { oasisReward } = await deployNFT();
        [owner, addr1] = await ethers.getSigners();
        const { quiz } = await deployQuiz();
        const base64EncodedSVG = await oasisReward.generateComplexSVG(1);
        // console.log(await oasisReward.connect(addr1).mint(addr1.address, base64EncodedSVG));
        await expect(oasisReward.connect(addr1).mint(addr1.address, base64EncodedSVG))
            .to.be.revertedWith("Owner address not tx.origin");
    });
});