const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const solidityRegexWithGT = /pragma solidity \>*\=*\^*\d+\.\d+\.\d+ \<*\^*\d+\.\d+\.\d+/


const verifierRegex = /contract Verifier/
const pverifierRegex = /contract PlonkVerifier/


let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
content = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped);

content = fs.readFileSync("./contracts/Multiplier3PlonkVerifier.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegexWithGT, 'pragma solidity ^0.8.0');
bumped = bumped.replace(pverifierRegex, 'contract Multiplier3PlonkVerifier');

fs.writeFileSync("./contracts/Multiplier3PlonkVerifier.sol", bumped);