const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');
const keypair = Keypair.generate();
console.log('Program ID:', keypair.publicKey.toBase58());
console.log('Secret Key (base58):', bs58.encode(keypair.secretKey));