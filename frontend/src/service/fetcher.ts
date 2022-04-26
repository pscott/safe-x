import { Account, Proposal, Space } from "../types"

const randomhex = () => Math.floor(Math.random() * 16).toString(16)

const randomEthWallet = () => {
  const randoms = []
  for (let i = 0; i < 40; i++) randoms.push(randomhex())
  return `0x${randoms.join("")}`
}

const fudgeProposal = (id: number): Proposal => {
  const nSigners = Math.floor(Math.random() * 5)
  const signers: Account[] = []
  for (let i = 0; i < nSigners; i++)
    signers.push({ address: randomEthWallet() })
  return { id, signers }
}

export const fetchSpace = async (spaceAddress: string): Promise<Space> => {
  const fudgeProposals = [0, 1, 2, 3, 4, 5].map((n) => fudgeProposal(n))

  const space: Space = {
    address: spaceAddress,
    proposals: fudgeProposals,
    whitelist: [
      { address: "0x117Fa00bb08f39E52b04027cCF5BB9935C83C177" },
      { address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b" },
      { address: "0x8a03e0dab7e83076af7200b09780af7856f0298d" },
    ],
  }
  return space
}

export const fetchProposal = async (
  spaceAddress: string,
  proposalId: number
): Promise<{ spaceAddress: string; proposal: Proposal }> => {
  const proposal: Proposal = {
    id: proposalId,
    signers: [
      { address: "0x117Fa00bb08f39E52b04027cCF5BB9935C83C177" },
      { address: "0xab5801a7d398351b8be11c439e05c5b3259aec9b" },
      { address: "0x8a03e0dab7e83076af7200b09780af7856f0298d" },
    ],
  }
  return { spaceAddress, proposal }
}
