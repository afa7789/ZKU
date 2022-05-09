const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof (o) == "string") && (/^[0-9]+$/.test(o))) {
        return BigInt(o);
    } else if ((typeof (o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o))) {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o === null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // create a prover with such statements and files
        const { proof, publicSignals } = await groth16.fullProve(
            { "a": "1", "b": "2" },
            "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm",
            "contracts/circuits/HelloWorld/circuit_final.zkey"
        );

        // a log of what we are trying to proove
        console.log('\t1x2 =', publicSignals[0]);

        // creates calldata ( contract type of receiver parameter) to be sent to the solidity verifier.
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

        // creates an array of arguments with the calldata to be sent to the solidity verifier.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        // set those parameters and send'em to the verifier
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });

});


describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        // create a prover with such statements and files
        const { proof, publicSignals } = await groth16.fullProve(
            { "a": "1", "b": "2","c":"3" },
            "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm",
            "contracts/circuits/Multiplier3/circuit_final.zkey"
        );
        // a log of what we are trying to proove
        console.log('\t1x2x3 =', publicSignals[0]);
        
        // creates calldata ( contract type of receiver parameter) to be sent to the solidity verifier.
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // creates an array of arguments with the calldata to be sent to the solidity verifier.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        // set those parameters and send'em to the verifier
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory('Multiplier3PlonkVerifier')
        verifier = await Verifier.deploy()
        await verifier.deployed()
    });

    it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await plonk.fullProve(
            { "a": '1', "b": '2', "c": '3' },
            'contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm',
            'contracts/circuits/Multiplier3_plonk/circuit_final.zkey',
          )
    
        console.log('1x2x3 =', publicSignals[0])

        const editedPublicSignals = unstringifyBigInts(publicSignals)
        const editedProof = unstringifyBigInts(proof)
        const calldata = await plonk.exportSolidityCallData(
          editedProof,
          editedPublicSignals,
        )

        const argv = calldata.split(',')
        // console.log(argv)
        expect(await verifier.verifyProof( argv[0], JSON.parse(argv[1]))).to.be.true
    });

    it('Should return false for invalid proof', async function () {
        const a = '0x01154072efddf74c359185049a1fff555846be2b0b21a0ac9a5e78e03c6882870ce4abf609952d2a37411ccd3c04d200ac22bdd717d76ddb2fc5242a6940470929978ca136db9ce3f38f1b712b9d876d386b456518535a44399edd19f2cb76f82e0e64cbafbc892ffc5e756e58cd7ed72444a7b00d676c20418d57da280a3cfc038cc89fe6cbe352a9e2272b5515b73d6ebefc5c7f7ea567395c869d952e487b1d0e11e227760feadaa862347000054ec22448491d8c57ae89ae0115eb47828c0fb39c5a5631894fc404e10c18c5274309dd7e4feb16282721c0820c69e854ae2d9236c2b942a241694be237d2a1bc6d7a33fd0c9faecf516edfeac0fcb662eb1289f1558aac16b0ffdfcae082bfe0a365068ec251a3cbc76146ea83e0dcd06d117cd02ce30494f69bbe172a9f56b7f35aa83d18ccacad1c01423e5a5bc2e7e90bec4e33e77a9203e2d872a7cc5dab8e015b83ed9440e1492ce2ad59fa5aad8500021f6617956a7cc5d319fdcbba0352b0ec6d054d67a2b71c1f27f3b561edbe10353a15ea65aff75d97e481494753a5d0168b9f2edeab905ac5e4964e50b5f20d1f384b6ef06aa4a3e598cdf7e1ec64e13c42e02e3ce0797c5d18471659bcda29dbdf1aa3ebcd3c1b912bf0d9f0e8181069fcf0345f1ffca3a6f869364c31271befbace6358bb278c0fb152f4a79e1f4238414a779b1d21da874f1dbe5342572e068e12780d784b1514aa68f2065f3de5609bbfae4ec2c441b71b4707a174860da64ba6efef6f9770570e29282428c53e7dbcbd6ccfd407a8d88bb43bea89242a92312b28e1fa6d3be5f80610efa015809bbf0414a65784c0998bed2a9213340b539b45f26204950b3467453deb9d10196d50d77dfaebe39be971d45ce3eaec253d88b438da22f8c9abda62da5d65eea176c157a3e8384c907d6752a361a84918e962c85f82576a49316bbcfb03670242f4557183d9bebcacbc4ec789584ca60f3c65cacd8d440f8c574a153cb309a0230247b610e56c39ac81fe4b3fb839ae18d4d3bc41ed10d0506c823e1306ec3689f0c7f0e6f67471f3c36dccffe180321032ba119afc6b5c35f427a4015f459ca382a1231d5adc82894ab3102fd648b7'
        const b = ['0x0000000000000000000000000000000000000000000000000000000000000000']

        expect(await verifier.verifyProof(a, b)).to.be.false
    })
});