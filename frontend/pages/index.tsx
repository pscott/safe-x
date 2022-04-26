import Link from "next/link"
import React from "react"

const CoolTable: React.FC = () => {
  return (
    <table className="tablething">
      <thead>
        <tr>
          <th>Legacy Gnosis Safe </th>
          <th>Safe-X</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>old ‍🦯👴</td>
          <td>new 😎</td>
        </tr>
        <tr>
          <td>gas: ~10$ per signature 💰</td>
          <td>super cheap 🛍</td>
        </tr>
        <tr>
          <td>~4$ to execute quorum 😐</td>
          <td>~4$ too 😐</td>
        </tr>
        <tr>
          <td>totally public 👀👀👀</td>
          <td>wen private starknet...private multisig 🕵️</td>
        </tr>
      </tbody>
    </table>
  )
}

const Home: React.FC = () => {
  return (
    <div className="page-layout">
      <h1>Welcome to Safe-X</h1>
      <h2>Safe-X is an efficient multisignature safe manager. </h2>
      <Link href={"space-factory"}>
        <button>Create a space</button>
      </Link>
      <CoolTable />
    </div>
  )
}

export default Home
