import { useStarknet } from "@starknet-react/core"
import Link from "next/link"

const Home: React.FC = () => {
  const {account} = useStarknet()
  return (
    <div>
      <h1>Welcome to safe-x</h1>
      {account === undefined
        ? <p>Please connect your Argent wallet</p>
        : <p>Hello {account}</p>}
      <Link href={"space-factory"}>
        <a className="createSpaceLink">Create a space</a>
      </Link>
    </div>
  )
}

export default Home
