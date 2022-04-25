import Link from "next/link"

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to safe-x</h1>
      <Link href={"space-factory"}>
        <a className="createSpaceLink">Create a space</a>
      </Link>
    </div>
  )
}

export default Home
