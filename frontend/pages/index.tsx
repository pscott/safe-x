import Link from "next/link"
import React from "react"

const Home: React.FC = () => {
  return (
    <div className="page-layout">
      <h1>Welcome to Safe-X</h1>
      <h2>Safe-X is an efficient multisignature safe manager. </h2>
      <Link href={"space-factory"}>
        <button>Create a space</button>
      </Link>
    </div>
  )
}

export default Home
