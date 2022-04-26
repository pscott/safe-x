import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, ContractFactory } from "ethers"
import { starknet, network, ethers } from "hardhat"
import { FOR, SplitUint256 } from "../starknet/shared/types"
import {
  StarknetContractFactory,
  StarknetContract,
  HttpNetworkConfig,
} from "hardhat/types"
import { stark } from "starknet"
import {hash} from "starknet"
import { strToShortStringArr } from "@snapshot-labs/sx"
import { _TypedDataEncoder } from "@ethersproject/hash"
import { EIP712_TYPES } from "../ethereum/shared/utils"
import {
  VITALIK_ADDRESS,
  VITALIK_STRING_ADDRESS,
  setup,
  EXECUTE_METHOD,
  PROPOSAL_METHOD,
  VOTE_METHOD,
  VITALIK_ADDRESS2,
  VITALIK_ADDRESS3,
} from "../starknet/shared/setup"
import { expectAddressEquality } from "../starknet/shared/helpers"
import { toBN } from 'starknet/dist/utils/number';


const { getSelectorFromName } = stark



function createExecutionHash(arr: Array<bigint>): {
  executionHash: SplitUint256
} {
  let bigNumberish = arr.map(e => toBN('0x' + e.toString(16)));


  const pedersen_hash = hash.computeHashOnElements(bigNumberish)

  const executionHash = new SplitUint256(BigInt(pedersen_hash), BigInt("0"))
  console.log(executionHash)
  return {
    executionHash,
  }
}

describe("Create proposal, cast vote, and send execution to l1", function () {
  this.timeout(12000000)
  let spaceContract: StarknetContract
  let authContract: StarknetContract
  let votingContract: StarknetContract
  let starknetRelayer: StarknetContract

  before(async function () {
    ({
      vanillaSpace: spaceContract,
      vanillaAuthenticator: authContract,
      vanillaVotingStrategy: votingContract,
      relayerContract: starknetRelayer,
    } = await setup(1))
  })

  it("should execute on l2", async () => {
    this.timeout(1200000)
    const metadata_uri = strToShortStringArr(
      "Hello and welcome to Snapshot X. This is the future of governance."
    )
    const dummyFactory = await starknet.getContractFactory("./contracts/starknet/testContracts/dummy.cairo");
    const dummyContract = await dummyFactory.deploy()

    // Dummy tx
    const tx1 = {
      to: BigInt(dummyContract.address),
      selector: BigInt(getSelectorFromName("temp")),
      calldata: [BigInt("1"), BigInt("2")],
    }

    // Dummy tx 2
    const tx2 = {
      to: BigInt(dummyContract.address),
      selector: BigInt(getSelectorFromName("temp")),
      calldata: [BigInt("3"), BigInt("4")],
    }

    const txs = [tx1.to, tx1.selector, BigInt(tx1.calldata.length), ...tx1.calldata, tx2.to, tx2.selector, BigInt(tx2.calldata.length), ...tx2.calldata]
    const { executionHash } = createExecutionHash(txs)
    const proposer_address = VITALIK_ADDRESS
    const proposal_id = BigInt(1)
    const voting_params: Array<bigint> = []
    const eth_block_number = BigInt(1337)
    const execFactory = await starknet.getContractFactory("./contracts/starknet/execution/starknet_executor.cairo");
    const starknet_executor = await execFactory.deploy({_execution_relayer: BigInt(starknetRelayer.address)})
    const execution_params: Array<bigint> = [BigInt(starknet_executor.address), ...txs, BigInt(txs.length)]
    const calldata = [
      proposer_address,
      executionHash.low,
      executionHash.high,
      BigInt(metadata_uri.length),
      ...metadata_uri,
      eth_block_number,
      BigInt(voting_params.length),
      ...voting_params,
      BigInt(execution_params.length),
      ...execution_params,
    ]
    console.log(calldata)

    // -- Creates a proposal --
    await authContract.invoke(EXECUTE_METHOD, {
      to: BigInt(spaceContract.address),
      function_selector: BigInt(getSelectorFromName(PROPOSAL_METHOD)),
      calldata,
    })
    console.log("Proposal created")

    // -- Casts a vote FOR 1/3 --
    {
      const voter_address = proposer_address
      const votingParams: Array<BigInt> = []
      await authContract.invoke(EXECUTE_METHOD, {
        to: BigInt(spaceContract.address),
        function_selector: BigInt(getSelectorFromName(VOTE_METHOD)),
        calldata: [
          voter_address,
          proposal_id,
          BigInt(votingParams.length),
          ...votingParams,
        ],
      })
      console.log("1/3")
    }

    // -- Casts a vote FOR 2/3--
    {
      const votingParams: Array<BigInt> = []
      await authContract.invoke(EXECUTE_METHOD, {
        to: BigInt(spaceContract.address),
        function_selector: BigInt(getSelectorFromName(VOTE_METHOD)),
        calldata: [
          VITALIK_ADDRESS2,
          proposal_id,
          BigInt(votingParams.length),
          ...votingParams,
        ],
      })
      console.log("2/3")
    }

    // -- Casts a vote FOR 3/3--
    {
      const voter_address = proposer_address
      const votingParams: Array<BigInt> = []
      await authContract.invoke(EXECUTE_METHOD, {
        to: BigInt(spaceContract.address),
        function_selector: BigInt(getSelectorFromName(VOTE_METHOD)),
        calldata: [
          VITALIK_ADDRESS3,
          proposal_id,
          BigInt(votingParams.length),
          ...votingParams,
        ],
      })
      console.log("3/3")
    }

    // -- Finalize proposal and send execution hash to L1 --
    {
      await spaceContract.invoke("finalize_proposal", {
        proposal_id: proposal_id,
        execution_params: execution_params,
      })
    }
  })
})
