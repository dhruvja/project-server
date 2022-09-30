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

const options = [
  {
    key: "bob",
    text: "7pTRjd48ZshMNevo5XnqrKXRrBLMdhFh36gJFcrvMjKh",
    value: "7pTRjd48ZshMNevo5XnqrKXRrBLMdhFh36gJFcrvMjKh",
  },
  {
    key: "cas",
    text: "5MPpntM4apPSHWJhLX8xaNnWTd8zB8iGBUgzLL8arvvC",
    value: "5MPpntM4apPSHWJhLX8xaNnWTd8zB8iGBUgzLL8arvvC",
  },
  {
    key: "admin",
    text: "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg",
    value: "GiUWC6Bx55syrpvxeiCZj9fADLyTEvv2e8kVqneuBVBg",
  },
];

const newSigs = [
  {
    key: "wallet 1",
    text: "AGdZqUDzmXZYMkmv17d2MevwsNyNYkLjUsbq19eZcawg",
    value: "AGdZqUDzmXZYMkmv17d2MevwsNyNYkLjUsbq19eZcawg",
  },
  {
    key: "wallet 2",
    text: "E5YMfUvCghB6Ynjx1kAREceoUdGn4SjATp9ohzKwua6J",
    value: "E5YMfUvCghB6Ynjx1kAREceoUdGn4SjATp9ohzKwua6J",
  },
  {
    key: "wallet 3",
    text: "4nBkhiwMHrgBeeWrEH85rquhBZMUatmTjgcAkmJUcjoK",
    value: "4nBkhiwMHrgBeeWrEH85rquhBZMUatmTjgcAkmJUcjoK",
  },
];

function Stake() {
  // unused object
  // port all the methods of this object to individually exported methods
  // we will eventually want to remove this and just use the individual methods
  //
  // const [quizzes, setQuizzes] = useState([]);
  // const [wallet, setWallet] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [present, setPresent] = useState(false);
  // const [initialise, setInitialise] = useState(false);
  // const [redirect, setRedirect] = useState(false);
  // const [index, setIndex] = useState(0);
  // const [connected, setConnected] = useState(false);
  // const [formValues, setFormValues] = useState({
  //   mintTokens: "",
  //   depositTokens: "",
  //   transferTokens: "",
  //   reciever: "",
  //   newThreshold: "",
  //   newTimeout: "",
  //   percentTransfer: "",
  //   newSigs: "",
  //   initialSigs: "",
  // });
  // const [totalTokens, setTotalTokens] = useState(0);
  // const [initialSignatories, setInitialSignatories] = useState([]);
  // const [newSignatories, setNewSignatories] = useState([]);
  // const [oldSignatories, setOldSignatories] = useState([]);
  // const [threshold, setThreshold] = useState(0);
  // const [signatory, setSignatory] = useState(null);
  // const [votersPresent, setVoterPresent] = useState(false);
  // const [voters, setVoters] = useState([]);
  // const [selectedPresent, setSelectedPresent] = useState(false);
  // const [selectedTransfer, setSelectedTransfer] = useState("");
  // const [selectedProject, setSelectedProject] = useState("");
  // const [jobError, setJobError] = useState(true);
  // const [applicationError, setApplicationError] = useState(true);
  // const [allData, setAllData] = useState({});
  // const [error, setError] = useState({
  //   state: false,
  //   message: "",
  // });
  // const [success, setSuccess] = useState({
  //   state: false,
  //   message: "",
  // });
  // const [sigs, setSigs] = useState([]);
  // const [adminBalance, setAdminBalance] = useState(0);

  // // const {sendTransaction} = useWallet();

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      __solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const getBalance = async (wallet) => {
    const tokenMintKey = new anchor.web3.PublicKey(tokenMint);

    let userTokenAccount = await spl.getAssociatedTokenAddress(
      tokenMintKey,
      wallet,
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    let adminTokenAccount = await spl.getAssociatedTokenAddress(
      tokenMintKey,
      new PublicKey(options[2].value),
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const balance = await spl.getAccount(connection, userTokenAccount);
      const adminBalanceLeft = await spl.getAccount(connection, adminTokenAccount);
      console.log((parseInt(balance.amount)/1000000).toString());
      setTotalTokens((parseInt(balance.amount)/1000000).toString());
      setAdminBalance((parseInt(adminBalanceLeft.amount)/1000000).toString())
    } catch (error) {
      console.log(error);
    }
  };

  const checkSolanaWalletExists = async () => {
    const { solana } = window;

    if (solana && solana.isPhantom) {
      try {
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(response.publicKey.toString());
        setWallet(response.publicKey);
        setConnected(true);
        getBalance(response.publicKey);
      } catch (error) {
        const response = await solana.connect();
        console.log(response.publicKey.toString());
        setWallet(response.publicKey);
        setConnected(true);
        getBalance(response.publicKey);
      }
    }
  };

  const getVoters = async (projectId) => {
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const state = await program.account.projectParameter.fetch(projectPDA);

    let x = state.signatories;

    let y = x.map((val, index) => {
      console.log(val.key);
      return {
        key: val.key.toBase58(),
        text: val.key.toBase58(),
        value: val.key.toBase58(),
      };
    });

    setSigs(y);

    console.log(state.transferAmount.reciever.toBase58());

    setVoters(state.signatories);
    setAllData(state);
    setVoterPresent(true);
  };

  const mintTokenToAccount = async () => {
    setLoading(true);

    const tokenMintKey = new anchor.web3.PublicKey(tokenMint);
    let userTokenAccount = await spl.getAssociatedTokenAddress(
      tokenMintKey,
      wallet,
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    await getTokenAccount(userTokenAccount, tokenMintKey);

    let recentBlockhash = await connection.getRecentBlockhash();
    let transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: wallet,
    });

    transaction.feePayer = wallet;

    transaction.add(
      spl.createMintToInstruction(
        tokenMintKey,
        userTokenAccount,
        baseAccount.publicKey,
        formValues.mintTokens*1000000,
        [],
        spl.TOKEN_PROGRAM_ID
      )
    );

    transaction.sign(baseAccount);
    let sign = await __solana.signTransaction(transaction);
    let signature = await connection.sendRawTransaction(sign.serialize());
    const confirmed = await connection.confirmTransaction(signature);

    await getBalance(wallet);
    setLoading(false);
  };

  const getTokenAccount = async (userTokenAccount, tokenMintKey) => {
    try {
      const tokenAccount = await spl.getAccount(connection, userTokenAccount);
    } catch (error) {
      let recentBlockhash = await connection.getRecentBlockhash();
      let transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: wallet,
      });
      transaction.add(
        spl.createAssociatedTokenAccountInstruction(
          wallet,
          userTokenAccount,
          wallet,
          tokenMintKey,
          spl.TOKEN_PROGRAM_ID,
          spl.ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      let sign = await __solana.signTransaction(transaction);
      let signature = await connection.sendRawTransaction(sign.serialize());
      let result = await connection.confirmTransaction(
        signature,
        "This is my transaction"
      );

      console.log(result);
    }
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const initializeGeneral = async () => {
    const provider = getProvider();
    const program = new Program(general, generalProgramID, provider);

    const [generalPDA, generalBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("general1")],
        program.programId
      );

    const USDCMint = new PublicKey(tokenMint);

    try {
      await program.methods
        .initialize()
        .accounts({
          baseAccount: generalPDA,
          authority: wallet,
          tokenMint: USDCMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      setSuccess({
        state: true,
        message: "You have successfully created a general program",
      });

      setError({
        state: false,
        message: "",
      });
    } catch (error) {
      const state = await program.account.generalParameter.fetch(generalPDA);
      console.log(state.tokenMint, state.authority);
    }
  };

  const createProject = async () => {
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);
    const percentTransfer = 2;

    let projectId = uuidv4();

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const [projectPoolPDA, projectPoolBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("pool"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const USDCMint = new PublicKey(tokenMint);

    try {
      const tx = await program.methods
        .initialize(projectId, formValues.percentTransfer)
        .accounts({
          baseAccount: projectPDA,
          projectPoolAccount: projectPoolPDA,
          tokenMint: USDCMint,
          authority: wallet,
          admin: options[2].value,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();
      console.log(tx);
      const state = await program.account.projectParameter.fetch(projectPDA);
      console.log(state.authority.toBase58());
      await getDetails(selectedTransfer, selectedProject);
      setSuccess({
        state: true,
        message:
          "You have successfully created a project with project id " +
          projectId,
      });

      setError({
        state: false,
        message: "",
      });
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }
  };

  const addInitialSignatories = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const timeLimit = 60 * 60 * 24; // 1 day

    const thresholdInNumber = parseInt(threshold);

    console.log(typeof thresholdInNumber);

    const sigs = formValues.initialSigs.split(",");
    if (sigs.length == 1) sigs[0] = new PublicKey(formValues.initialSigs);
    else {
      for (let i = 0; i < sigs.length; i++) {
        sigs[i] = new PublicKey(sigs[i]);
      }
    }

    // initialSignatories.find((val, index) => {
    //   sigs[index] = new PublicKey(val);
    // })

    for (let i = 0; i < initialSignatories.length; i++) {
      sigs[i] = new PublicKey(initialSignatories[i]);
    }

    console.log(sigs);

    try {
      const tx = await program.methods
        .addInitialSignatories(
          projectBump,
          projectId,
          sigs,
          thresholdInNumber,
          timeLimit
        )
        .accounts({
          baseAccount: projectPDA,
        })
        .rpc();
      setSuccess({
        state: true,
        message:
          "You have successfully added the initial signatories and set the threshold",
      });

      setError({
        state: false,
        message: "",
      });
      console.log(tx);
    } catch (error) {
      console.log(error);
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
    }

    await getVoters(selectedProject);

    setLoading(false);
  };

  const createAddSignatory = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const sigs = formValues.newSigs.split(",");
    if (sigs.length == 1) sigs[0] = new PublicKey(formValues.newSigs);
    else {
      for (let i = 0; i < sigs.length; i++) {
        sigs[i] = new PublicKey(sigs[i]);
      }
    }

    console.log(sigs);

    try {
      const tx = await program.methods
        .addNewSignatoryProposal(projectBump, projectId, sigs)
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();

      setSuccess({
        state: true,
        message:
          "You have successfully created a proposal to add the signatories",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      console.log(error);

      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
    }

    setLoading(false);
  };

  const createDeleteSignatory = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    let sigs = oldSignatories;

    for (let i = 0; i < oldSignatories.length; i++) {
      sigs[i] = new PublicKey(oldSignatories[i]);
    }

    console.log(sigs);

    try {
      const tx = await program.methods
        .removeSignatoryProposal(projectBump, projectId, sigs)
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();

      setSuccess({
        state: true,
        message:
          "You have successfully created a proposal to delete the signatories",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }

    setLoading(false);
  };

  const createNewThreshold = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const currentTimestamp = new Date().getTime() / 1000;

    try {
      const tx = await program.methods
        .changeThresholdProposal(
          projectBump,
          projectId,
          formValues.newThreshold,
          currentTimestamp
        )
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();
      setSuccess({
        state: true,
        message:
          "You have successfully created a proposal for changing the threshold",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }

    setLoading(false);
  };

  const createNewTimeout = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const timeLimit = parseInt(formValues.newTimeout);

    try {
      const tx = await program.methods
        .changeTimeLimitProposal(projectBump, projectId, timeLimit)
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();

      setSuccess({
        state: true,
        message: "You have deposited successfully",
      });

      setError({
        state: false,
        message: "",
      });
      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }

    setLoading(false);
  };

  const depositTokens = async () => {
    setLoading(true);
    const provider = getProvider();
    const projectProgram = new Program(project, projectProgramID, provider);
    const generalProgram = new Program(general, generalProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        projectProgram.programId
      );

    const [projectPoolPDA, projectPoolBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("pool"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        projectProgram.programId
      );

    const [generalPDA, generalBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("general1")],
        generalProgram.programId
      );

    const USDCMint = new PublicKey(tokenMint);

    let userTokenAccount = await spl.getAssociatedTokenAddress(
      USDCMint,
      wallet,
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    let adminTokenAccount = await spl.getAssociatedTokenAddress(
      USDCMint,
      new PublicKey(options[2].value),
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const tx = await projectProgram.methods
        .depositFunds(
          projectId,
          projectBump,
          projectPoolBump,
          generalBump,
          formValues.depositTokens*1000000
        )
        .accounts({
          baseAccount: projectPDA,
          generalAccount: generalPDA,
          projectPoolAccount: projectPoolPDA,
          tokenMint: USDCMint,
          authority: wallet,
          walletToWithdrawFrom: userTokenAccount,
          adminTokenWallet: adminTokenAccount,
          generalProgram: generalProgram.programId,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      setSuccess({
        state: true,
        message: "You have deposited successfully",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");
      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }

    setLoading(false);
  };

  const createNewTransfer = async () => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    const USDCMint = new PublicKey(tokenMint);

    let recieverTokenAccount = await spl.getAssociatedTokenAddress(
      USDCMint,
      new PublicKey(formValues.reciever),
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .transferAmountProposal(
          projectBump,
          projectId,
          formValues.transferTokens*1000000,
          recieverTokenAccount
        )
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();

      setSuccess({
        state: true,
        message: "You have created a transfer successfully",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");

      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(error.errorLogs[0]);
      console.log(error);
    }

    setLoading(false);
  };

  const signTransfer = async () => {
    setLoading(true);
    const provider = getProvider();
    const projectProgram = new Program(project, projectProgramID, provider);
    const generalProgram = new Program(general, generalProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        projectProgram.programId
      );

    const [projectPoolPDA, projectPoolBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("pool"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        projectProgram.programId
      );

    const [generalPDA, generalBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("general1")],
        generalProgram.programId
      );

    const USDCMint = new PublicKey(tokenMint);

    let recieverTokenAccount = await spl.getAssociatedTokenAddress(
      USDCMint,
      new PublicKey(formValues.reciever),
      false,
      spl.TOKEN_PROGRAM_ID,
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const tx = await projectProgram.methods
        .signTransfer(generalBump, projectBump, projectPoolBump, projectId)
        .accounts({
          baseAccount: projectPDA,
          generalAccount: generalPDA,
          projectPoolAccount: projectPoolPDA,
          tokenMint: USDCMint,
          authority: wallet,
          walletToWithdrawFrom: recieverTokenAccount,
          generalProgram: generalProgram.programId,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      setSuccess({
        state: true,
        message: "You have Successfully signed the transfer",
      });

      setError({
        state: false,
        message: "",
      });

      console.log(tx);
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");

      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });

      console.log(error);
    }

    setLoading(false);
  };

  const sign = async (key) => {
    setLoading(true);
    const provider = getProvider();
    const program = new Program(project, projectProgramID, provider);

    const projectId = selectedProject;

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        program.programId
      );

    try {
      const tx = await program.methods
        .signProposal(projectBump, projectId, key)
        .accounts({
          baseAccount: projectPDA,
          authority: wallet,
        })
        .rpc();
      console.log(tx);
      setSuccess({
        state: true,
        message: "You have Successfully signed",
      });

      setError({
        state: false,
        message: "",
      });
    } catch (error) {
      const err = error.errorLogs[0].split("Error Message");

      setSuccess({
        state: false,
        message: "",
      });

      setError({
        state: true,
        message: err[1],
      });
      console.log(Object.keys(error));
      console.log(error.errorLogs[0]);
    }

    await getVoters(selectedProject);

    setLoading(false);
  };

  const getDetails = async (projectId) => {
    console.log('get details 1')
    const provider = getProvider();
    const projectProgram = new Program(project, projectProgramID, provider);

    console.log(projectId);

    const [projectPDA, projectBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("project"),
          Buffer.from(projectId.substring(0, 18)),
          Buffer.from(projectId.substring(18, 36)),
        ],
        projectProgram.programId
      );

    try {
      const projectState = await projectProgram.account.projectParameter.fetch(
        projectPDA
      );
      console.log('Project State:', projectState)
      setJobError(true);
    } catch (error) {
      setJobError(false);
      console.log(error);
    }
  };

  const selectApplication = async (projectId) => {
    setSelectedProject(projectId);
    setSelectedPresent(true);
    await getDetails(projectId);
    await getVoters(projectId);

    console.log(projectId);
  };
}
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

export const createProjectDeepak = async (authorityWallet, tokenMint, transferFee, transferFeeWallet) => {
  console.log('deepak createProjectDeepak');
  //console.log('projectid: ' + projectId);
  console.log('authorityWallet: ' + authorityWallet);
  console.log('tokenMint: ' + tokenMint);
  console.log('transferFee: ' + transferFee);
  console.log('transferFeeWallet: ' + transferFeeWallet);

  // const provider = getProvider(new Wallet(authorityWallet));
  // const provider = getProvider(authorityWallet);
  const path = "https://api.devnet.solana.com";
  console.log(network, path);
  const provider = anchor.AnchorProvider.local(network);
  anchor.setProvider(provider);
  const program = new anchor.Program(project, projectProgramID, provider);

  let projectId = uuidv4();  

  const [projectPDA, projectBump] = await findProgramAddress("project", projectId, program);
  const [projectPoolPDA, projectPoolBump] = await findProgramAddress("pool", projectId, program);

  const adminPrivate = '2HKjYz8yfQxxhRS5f17FRCx9kDp7ATF5R4esLnKA4VaUsMA5zquP5XkQmvv9J5ZUD6wAjD4iBPYXDzQDNZmQ1eki';
  const admin = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(adminPrivate))
    );  
  console.log('admin public key: ' + admin.publicKey); 
  const adminWallet = new PublicKey(transferFeeWallet);

  // const USDCMint = new PublicKey(tokenMint); // Deepak - is this needed?

    const tx = await program.methods
      .initialize(projectId, transferFee)
      .accounts({
        baseAccount: projectPDA,
        projectPoolAccount: projectPoolPDA,
        tokenMint: tokenMint,
        authority: admin.publicKey,
        admin: adminWallet,
        systemProgram: SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
      return {
        projectId,
        tokenMint,
        transferFee,
        transferFeeWallet,
        authorityWallet
      }

/*
   const state = await program.account.projectParameter.fetch(
      projectPDA
    );

    console.log(state)
*/
};

export const createProject = async (authorityWallet, tokenMint, transferFee, transferFeeWallet) => {
  const provider = getProvider(new Wallet(authorityWallet));
  const program = new Program(project, projectProgramID, provider);

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
        tokenMint: tokenMint,
        authority: authorityWallet,
        admin: transferFeeWallet,
        systemProgram: SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
      return {
        projectId,
        tokenMint,
        transferFee,
        transferFeeWallet,
        authorityWallet
      }
        // console.log(tx);
    // const state = await program.account.projectParameter.fetch(projectPDA);
    // console.log(state.authority.toBase58());
    // await getDetails(selectedTransfer, selectedProject);
    // setSuccess({
    //   state: true,
    //   message:
    //     "You have successfully created a project with project id " +
    //     projectId,
    // });

    // setError({
    //   state: false,
    //   message: "",
    // });
  // } catch (error) {
  //   const err = error.errorLogs[0].split("Error Message");
  //   throw err[1];
    // setSuccess({
    //   state: false,
    //   message: "",
    // });

    // setError({
    //   state: true,
    //   message: err[1],
    // });
    // console.log(error.errorLogs[0]);
    // console.log(error);
  // }
};


// export default test;
