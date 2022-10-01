// for help check below:
// https://github.com/madrugada-labs/candidate-staking/blob/master/tests/candidate_staking.ts#L158
// the .ts file line 384

import express from 'express'
import { getDetails, getBalance, createProject, addSignatories, removeSignatories, createTransfer, changeTimeLimit, changeThreshold } from './js/sc-api.js'
import tokenMint from './config/mint.json' assert { type: 'json' }
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
const app = express()
const port = 4000
const __wallet = "3tNtYBDamHzy5G54pybYYCEREJdVBCyMrHVDAC8ccA5e";
const __projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728'


const logError = (err, res) => {
  console.log("[-----------ERROR-----------]\r", err)
  if (res)
    res.status(500).send(err)
}

app.get('/', async (req, res) => {
  try {
    const daoDetails = await getDetails(__wallet, __projectId)
    res.status(200).send(daoDetails)
  } catch (err) {
    logError(err, res);
  }
})

app.get('/details', async (req, res) => {
  try {
    const wallet = req.headers["x-wallet"]
    const projectId = req.headers["x-project-id"]
    const daoDetails = await getDetails(wallet, projectId)
    res.status(200).send(daoDetails)
  } catch (err) {
    logError(err, res);
  }
})
// user wallet: 3tNtYBDamHzy5G54pybYYCEREJdVBCyMrHVDAC8ccA5e 
// admin wallet: GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg
app.get('/walletbalance', async (req, res) => {
  try {
    const wallet = req.headers["x-wallet"]
    console.log('log /walletbalance wallet: ' + wallet);  
    const balance = await getBalance('3tNtYBDamHzy5G54pybYYCEREJdVBCyMrHVDAC8ccA5e', tokenMint)
    res.status(200).send(balance)
  } catch (err) {
    logError(err, res);
  }
})

app.post('/project', async (req, res) => {
  try {
    const authorityWallet = req.headers["x-wallet"]
    const transferFeeWallet = req.headers["x-fee-wallet"]
    const transferFee = req.headers["x-transfer-fee"]
    const project = await createProject(authorityWallet, tokenMint, transferFee, transferFeeWallet)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

app.get('/createproject', async (req, res) => {
  try {
    //const authorityWallet = "34JTPyR8b9hzkQbpow2R46iv2ZytDXW88UH5XpV1xonZ"
    const authorityWallet = "FUMWGS2GkQcaUsYHCQVa41wxJCYMYf28yeox2joChmT4" //alice
    console.log('log authorityWallet: ' + authorityWallet);    
    const authorityKeyPair = Keypair.fromSecretKey(
      bs58.decode(
        "472ZS33Lftn7wdM31QauCkmpgFKFvgBRg6Z6NGtA6JgeRi1NfeZFRNvNi3b3sh5jvrQWrgiTimr8giVs9oq4UM5g"
      )
    );
    const transferFeeWallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg" // admin
    console.log('log transferFeeWallet: ' + transferFeeWallet);    
    const transferFee = 1 
    console.log('log transferFee: ' + transferFee);
    console.log('log token mint: ' + tokenMint);
    const project = await createProject(authorityWallet, tokenMint, transferFee, transferFeeWallet, authorityKeyPair)
    console.log('log project: ' + project);
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

/*
create api returns
{"projectId":"1c5bd71f-4486-4196-b458-7384c465a05f","tokenMint":"AmA4TR9ipSJb7rsPm7qpyzwcJVVbdCrjqSJYDkWQzor7","transferFee":1,"transferFeeWallet":"GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg","authorityWallet":"FUMWGS2GkQcaUsYHCQVa41wxJCYMYf28yeox2joChmT4"}
*/
app.get('/addsignatories', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const signatory = "7pTRjd48ZshMNevo5XnqrKXRrBLMdhFh36gJFcrvMjKh" // bob
    // const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728' // works too
    const projectId = '1c5bd71f-4486-4196-b458-7384c465a05f' // from create project api called by alice
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await addSignatories(adminwallet, signatory, projectId)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

app.get('/removesignatories', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const signatory = "7pTRjd48ZshMNevo5XnqrKXRrBLMdhFh36gJFcrvMjKh"
    // const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728' // works
    const projectId = '1c5bd71f-4486-4196-b458-7384c465a05f'
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await removeSignatories(adminwallet, signatory, projectId)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})


app.get('/createtransfer', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const receiver = "3tNtYBDamHzy5G54pybYYCEREJdVBCyMrHVDAC8ccA5e"                      
    const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728'
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await createTransfer(adminwallet, receiver, projectId, 0.1)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})


app.get('/changeThreshold', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const threshold = 1
    const currentTimestamp = new Date().getTime() / 1000;
    // const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728' // works
    const projectId = '1c5bd71f-4486-4196-b458-7384c465a05f'
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await changeThreshold(adminwallet, threshold, currentTimestamp, projectId)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

app.get('/changeTimelimit', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const timeLimit = 1000
    // const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728' // works
    const projectId = '1c5bd71f-4486-4196-b458-7384c465a05f'
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await changeTimeLimit(adminwallet, timeLimit, projectId)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

app.listen(port, () => {
  console.log(`DAOStreet Smart Contract Service listening on port ${port}`)
})