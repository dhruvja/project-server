// for help check below:
// https://github.com/madrugada-labs/candidate-staking/blob/master/tests/candidate_staking.ts#L158
// the .ts file line 384

import express from 'express'
import { getDetails, getBalance, createProject, addSignatories } from './js/sc-api.js'
import tokenMint from './config/mint.json' assert { type: 'json' }
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
    console.log('deepak /walletbalance wallet: ' + wallet);  
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

app.get('/addsignatories', async (req, res) => {
  try {
    const adminwallet = "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg"
    const signatory = "3tNtYBDamHzy5G54pybYYCEREJdVBCyMrHVDAC8ccA5e"
    const projectId = '8d374d4f-5263-4fa3-822a-3811ed83d728'
    //const project = await addSignatories(authorityWallet, __projectId)
    const project = await addSignatories(adminwallet, signatory, projectId)
    res.status(200).send(project)
  } catch (err) {
    // const err = error.errorLogs[0].split("Error Message");
    logError(err, res);
  }
})

app.listen(port, () => {
  console.log(`DAOStreet Smart Contract Service listening on port ${port}`)
})