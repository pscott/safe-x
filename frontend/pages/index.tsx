import { useStarknet, useStarknetCall } from "@starknet-react/core"
import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import mypic from "./logo.svg"

const Home: React.FC = () => {
  const { account } = useStarknet()
  return (
    <div className="page-layout">
      <h3>
        <Image src={mypic} />
      </h3>
      <style global jsx>{`
        body {
          font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue",
            "Helvetica", "Arial", sans-serif;
          background: linear-gradient(
            to left top,
            rgb(253, 103, 140),
            rgb(201, 201, 201),
            white,
            rgb(191, 191, 191),
            white,
            rgb(253, 103, 140)
          );
          background-attachment: fixed;
        }
        div {
          text-align: center;
        }
        h3 {
          text-align: left;
          position: fixed;
          top: 0px;
        }
        h4 {
          text-align: right;
        }
        p {
          text-align: right;
        }
        button {
          background-color: black; /* Green */
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
        }
      `}</style>
      {account === undefined ? (
        <p>Please connect your Argent wallet</p>
      ) : (
        <p>Connected to {account}</p>
      )}

      <h1>Welcome to Safe-X</h1>
      <h2>Safe-X is an effecient multisignature safe manager. </h2>
      <Link href={"space-factory"}>
        <button>Create a space</button>
      </Link>
    </div>
  )
}

export default Home
