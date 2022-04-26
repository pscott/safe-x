import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from 'next/link'

import { getProposal, getSpace } from "../../../src/service/state-updater"

import { Proposal, State } from "../../../src/types"
import { useRouter } from "next/router"

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
      <ProposalContainer proposal={proposal} />
    </div>
  )
}

export default ProposalPage
