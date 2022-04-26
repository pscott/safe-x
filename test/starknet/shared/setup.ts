import { starknet } from "hardhat"
import { SplitUint256 } from "./types"
import { StarknetContract } from "hardhat/types"

export const EXECUTE_METHOD = "execute"
export const PROPOSAL_METHOD = "propose"
export const VOTE_METHOD = "vote"
export const GET_PROPOSAL_INFO = "get_proposal_info"
export const GET_VOTE_INFO = "get_vote_info"
export const VOTING_DELAY = BigInt(0)
export const VOTING_DURATION = BigInt(20)
export const VITALIK_ADDRESS = BigInt(
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
)
export const VITALIK_ADDRESS2 = BigInt(
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96046"
)
export const VITALIK_ADDRESS3 = BigInt(
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96047"
)
export const VITALIK_ADDRESS4 = BigInt(
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96048"
)
export const VITALIK_ADDRESS5 = BigInt(
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96049"
)
export const VITALIK_STRING_ADDRESS = VITALIK_ADDRESS.toString(16)

export async function setup(flavor: number) {
  const vanillaSpaceFactory = await starknet.getContractFactory(
    "./contracts/starknet/space/space.cairo"
  )
  const vanillaVotingStategyFactory = await starknet.getContractFactory(
    "./contracts/starknet/strategies/whitelist.cairo"
  )
  const vanillaAuthenticatorFactory = await starknet.getContractFactory(
    "./contracts/starknet/authenticator/authenticator.cairo"
  )
  let relayer_str;
  if (flavor == 0) {
    relayer_str = "./contracts/starknet/execution/zodiac_relayer.cairo"
  } else {
    relayer_str = "./contracts/starknet/execution/starknet_relayer.cairo"
  }

  const zodiacRelayerFactory = await starknet.getContractFactory(relayer_str);

  const whitelist = [
    VITALIK_ADDRESS,
    VITALIK_ADDRESS2,
    VITALIK_ADDRESS3,
    VITALIK_ADDRESS4,
    VITALIK_ADDRESS5,
  ]

  const deployments = [
    vanillaAuthenticatorFactory.deploy(),
    vanillaVotingStategyFactory.deploy({ _whitelist: whitelist }),
    zodiacRelayerFactory.deploy(),
  ]

  console.log("Deploying auth, voting and zodiac relayer contracts...")
  const contracts = await Promise.all(deployments)
  const vanillaAuthenticator = contracts[0] as StarknetContract
  const vanillaVotingStrategy = contracts[1] as StarknetContract
  const relayerContract = contracts[2] as StarknetContract

  const voting_strategy = BigInt(vanillaVotingStrategy.address)
  const authenticator = BigInt(vanillaAuthenticator.address)
  const relayer = BigInt(relayerContract.address)
  const QUORUM = 3

  // This should be declared along with the other const but doing so will make the compiler unhappy as `SplitUint256`
  // will be undefined for some reason?
  const PROPOSAL_THRESHOLD = SplitUint256.fromUint(BigInt(1))

  console.log("Deploying space contract...")
  const vanillaSpace = (await vanillaSpaceFactory.deploy({
    _voting_delay: VOTING_DELAY,
    _voting_duration: VOTING_DURATION,
    _proposal_threshold: PROPOSAL_THRESHOLD,
    _executor: relayer,
    _quorum: QUORUM,
    _voting_strategy: voting_strategy,
    _authenticator: authenticator,
  })) as StarknetContract
  console.log("deployed!")

  return {
    vanillaSpace,
    vanillaAuthenticator,
    vanillaVotingStrategy,
    relayerContract,
  }
}
