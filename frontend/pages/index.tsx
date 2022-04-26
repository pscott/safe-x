import { useStarknet } from "@starknet-react/core"
import Link from "next/link"
import Image from "next/image"
import React from "react"
// @ts-ignore
import mypic from "./logo.svg"

const Home: React.FC = () => {
  const { account } = useStarknet()
  return (
    <div className="page-layout">
      {account === undefined ? (
        <p>Please connect your Argent wallet</p>
      ) : (
        <p>Connected to {account}</p>
      )}

      <h1>Welcome to Safe-X</h1>
      <h2>Safe-X is an efficient multisignature safe manager. </h2>
      <Link href={"space-factory"}>
        <button>Create a space</button>
      </Link>
    </div>
  )
}

export default Home
