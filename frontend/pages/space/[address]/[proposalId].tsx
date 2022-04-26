import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"

import { getProposal, getSpace } from "../../../src/service/state-updater"

import { Proposal, State } from "../../../src/types"
import { useRouter } from "next/router"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector as Web3InjectedConnector } from "@web3-react/injected-connector"
import { ethers } from "ethers"
import { useContract, useStarknetInvoke } from "@starknet-react/core"
import authenticatorAbi from "../../../starknet-artifacts/contracts/starknet/authenticator/authenticator.cairo/authenticator_abi.json"
import { Abi } from "starknet"

const SignButton: React.FC<{ spaceAddress: string }> = ({ spaceAddress }) => {
  const web3React = useWeb3React()
  const { contract } = useContract({
    abi: authenticatorAbi as Abi,
    address: spaceAddress,
  })
  const invoke = useStarknetInvoke({ contract, method: "execute" })

  const { activate, account } = web3React

  const handleSign = async () => {
    if (!web3React.account) return
    // @ts-ignore
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner(
      web3React.account
    )

    const signature = await signer.signMessage("This is a test message")
    console.log("alright")
    const invokeResult = await invoke.invoke({ args: [] })
    console.log("done")
    console.log(invokeResult)
  }
  const connectToWeb3 = () => {
    const injected = new Web3InjectedConnector({ supportedChainIds: [5] })
    activate(injected)
    // @ts-ignore
    window.ethereum.enable()
  }

  useEffect(() => {
    connectToWeb3()
  }, [])

  return <button onClick={handleSign}>Sign transaction {account}</button>
}

const ProposalContainer: React.FC<{ proposal: Proposal | undefined }> = ({
  proposal,
}) => {
  if (proposal === undefined) return <div>loading</div>
  return (
    <div className="proposal">
      <h1>Proposal #{proposal.id}</h1>
      <div>
        {proposal.signers.map((signer) => {
          return <div key={signer.address}>{signer.address}</div>
        })}
      </div>
    </div>
  )
}

const ProposalPage: React.FC = () => {
  const router = useRouter()
  const { address, proposalId } = router.query
  const dispatch = useDispatch()
  const { spaceMap } = useSelector<State, State>((state) => state)
  const space = spaceMap[address as string]
  const proposal = space ? space.proposals[Number(proposalId)] : undefined

  useEffect(() => {
    if (space === undefined) {
      getSpace(dispatch, address as string)
    } else if (proposal === undefined) {
      getProposal(dispatch, address as string, Number(proposalId))
    }
  }, [address, proposalId, space])

  return (
    <div>
      <p>
        welcome to proposal {proposalId} in space {address}
      </p>
      <SignButton spaceAddress={address as string} />
      <ProposalContainer proposal={proposal} />
    </div>
  )
}

export default ProposalPage
