import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import Link from "next/link"

import { getSpace } from "../../../src/service/state-updater"
import { Account, Proposal, Space, State } from "../../../src/types"

const Proposals: React.FC<{ spaceAddress: string; proposals: Proposal[] }> = ({
  spaceAddress,
  proposals,
}) => {
  return (
    <div>
      {proposals.map((proposal) => {
        return (
          <div key={proposal.id} className="proposalLink">
            <Link href={`/space/${spaceAddress}/${proposal.id}`}>
              <a>Proposal #{proposal.id}</a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

const Whitelist: React.FC<{ whitelist: Account[] }> = ({ whitelist }) => {
  return (
    <div className="whitelist">
      {whitelist.map((account) => {
        return (
          <div className="whitelistElement" key={account.address}>
            {account.address}
          </div>
        )
      })}
    </div>
  )
}

const SpaceContainer: React.FC<{ space: Space | undefined }> = ({ space }) => {
  if (space === undefined) return <div>loading</div>

  return (
    <div className="space">
      <p>this is the space address {space.address}</p>
      <h1>Whitelist</h1>
      <Whitelist whitelist={space.whitelist} />
      <Proposals proposals={space.proposals} spaceAddress={space.address} />
    </div>
  )
}

const SpacePage: React.FC = () => {
  const router = useRouter()
  const { address } = router.query
  const { spaceMap } = useSelector<State, State>((state) => state)
  const dispatch = useDispatch()
  useEffect(() => {
    if (space === undefined) {
      getSpace(dispatch, address as string)
    }
  }, [address])
  if (address === undefined) return null

  const space = spaceMap[address as string]

  return (
    <div>
      <SpaceContainer space={space} />
    </div>
  )
}

export default SpacePage
