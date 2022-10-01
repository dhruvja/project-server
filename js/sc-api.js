// import bs58 from 'bs58'
import { v4 as uuidv4 } from 'uuid'
import bs58 from "bs58"
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { Program, AnchorProvider, Wallet } from "@project-serum/anchor";
import * as anchor from '@project-serum/anchor'

import general from '../idl/general.json' assert { type: 'json' }
import project from '../idl/project.json' assert { type: 'json' }
import kp from '../config/keypair.json' assert { type: 'json' }
import tokenMint from '../config/mint.json' assert { type: 'json' }
import data from '../config/data.json' assert { type: 'json' }

const __solana = "";
// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const generalProgramID = new PublicKey(general.metadata.address);
const projectProgramID = new PublicKey(project.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

const connection = new Connection(network, opts.preflightCommitment);

// Following methods added by Derick
//
// helpers for individually exported methods
const  getProvider = (wallet) => {
  const provider = new AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment
  );
  return provider;
}

async function findProgramAddress(programType, projectId, program) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(programType),
      Buffer.from(projectId.substring(0, 18)),
      Buffer.from(projectId.substring(18, 36)),
    ],
    program.programId
  );
}

// individually exported methods
export const getDetails =  async (wallet, projectId) => {
  console.log('deepak get details')
  console.log('projectId: ' + projectId);
  console.log('wallet: ' + wallet);
  const provider = getProvider(wallet);
  const projectProgram = new Program(project, projectProgramID, provider);
  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, projectProgram);
  return await projectProgram.account.projectParameter.fetch(projectPDA);
}

export const getBalance = async (wallet, tokenMint) => {
  console.log('deepak getBalance')
  console.log('tokenMint: ' + tokenMint);
  console.log('wallet: ' + wallet);  
  const mint = new PublicKey(tokenMint);
  const owner = new PublicKey(wallet);
  const account = await spl.getAssociatedTokenAddress(
    mint,
    owner,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const balance = await spl.getAccount(connection, account);
  return {
    mint,
    owner,
    account,
    balance: parseInt(balance.amount)/1000000
  }
}

export const addSignatories = async (authorityWallet, signatory, projectId) => {
  console.log('deepak addSignatories');
  console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('signatory: ' + signatory);

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  //let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey);  
  const sigs = [
    new PublicKey(signatory),
  ];  
  // const sigs = new PublicKey(authorityWallet);
  // const USDCMint = new PublicKey(tokenMint);
  // try {
    const tx = await program.methods
      .addNewSignatoryProposal(projectBump, projectId, sigs)
      .accounts({
        baseAccount: projectPDA,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log(tx);

   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)

};

export const createTransferDeepak = async (authorityWallet, receiver, projectId, amount) => {
  console.log('deepak createTransferDeepak');
  console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('receiver: ' + receiver);

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  //let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey);  

    const tx = await program.methods
      .transferAmountProposal(projectBump, projectId, amount, new PublicKey(receiver))
      .accounts({
        baseAccount: projectPDA,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log(tx);

   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)

};

export const createProject = async (authorityWallet, tokenMint, transferFee, transferFeeWallet, authorityKeyPair) => {
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  let projectId = uuidv4();

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

// const USDCMint = new PublicKey(tokenMint);
  // try {
    const tx = await program.methods
      .initialize(projectId, transferFee)
      .accounts({
        baseAccount: projectPDA,
        projectPoolAccount: projectPoolPDA,
        tokenMint: new PublicKey(tokenMint),
        authority: new PublicKey(authorityWallet),
        admin: new PublicKey(transferFeeWallet),
        systemProgram: SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([authorityKeyPair])
      .rpc();
      return {
        projectId,
        tokenMint,
        transferFee,
        transferFeeWallet,
        authorityWallet
      }
};


// export default test;

export const removeSignatoriesdeepak = async (authorityWallet, signatory, projectId) => {
  console.log('deepak removeSignatoriesdeepak');
  console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('signatory: ' + signatory);

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  //let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey);  
  const sigs = [
    new PublicKey(signatory),
  ];  
  // const sigs = new PublicKey(authorityWallet);
  // const USDCMint = new PublicKey(tokenMint);
  // try {
    const tx = await program.methods
      .removeSignatoryProposal(projectBump, projectId, sigs)
      .accounts({
        baseAccount: projectPDA,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log(tx);

   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)

};

export const changeThresholddeepak = async (authorityWallet, threshold, currentTimestamp, projectId) => {
  console.log('deepak changeThresholddeepak');
  console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('threshold: ' + threshold);
  console.log('currentTimestamp: ' + currentTimestamp);  

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  //let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey);  

    const tx = await program.methods
      .changeThresholdProposal(projectBump, projectId, threshold, currentTimestamp)
      .accounts({
        baseAccount: projectPDA,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log(tx);

   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)

};

export const changeTimeLimit = async (authorityWallet, timelimit, projectId) => {
  console.log('deepak changeThresholddeepak');
  console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('timelimit: ' + timelimit);

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  //let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey);  

    const tx = await program.methods
      .changeTimeLimitProposal(projectBump, projectId, timelimit)
      .accounts({
        baseAccount: projectPDA,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    console.log(tx);

   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)

};

