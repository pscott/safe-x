import { Field, Form, Formik } from "formik"
import { useStarknet } from "@starknet-react/core"
import Link from "next/link"

import relayerCompiled from "../starknet-artifacts/contracts/starknet/execution/starknet_relayer.cairo/starknet_relayer.json"
import authenticatorCompiled from "../starknet-artifacts/contracts/starknet/authenticator/authenticator.cairo/authenticator.json"
import spaceCompiled from "../starknet-artifacts/contracts/starknet/space/space.cairo/space.json"

import { CompiledContract, ContractFactory, Provider, Abi } from "starknet"
import { useState } from "react"

const getSavings = (people: number): number => {
  const fullcost = people * 10
  return fullcost - 4
}

const SpaceForm: React.FC<any> = (props) => {
  return (
    <Formik
      initialValues={{
        whitelistAddress: "",
        quorum: 3,
      }}
      onSubmit={(values) => props.deploySpace(values)}
    >
      {({ values }) => (
        <div>
          <Form>
            <p>Whitelist Contract Address</p>
            <Field
              name="whitelistAddress"
              placeholder="0x57736560d694debafd8f346b..."
              className="main"
            />
            <p>Threshold</p>
            <Field
              type={"number"}
              name="quorum"
              placeholder="3"
              className="main"
            />
            <p>Wow, you're saving about...</p>{" "}
            <h1>
              {getSavings(values.quorum)}${" "}
              {"💸".repeat(Math.floor(values.quorum / 10))}
            </h1>
            <p />
            <button type="submit">Deploy</button>
          </Form>
        </div>
      )}
    </Formik>
  )
}

const SpaceFactory: React.FC = () => {
  const { account, library } = useStarknet()
  const [loading, setLoading] = useState<boolean>()
  const [spaceAddress, setSpaceAddress] = useState<string>()
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])

  const deploySpace = async (values: any) => {
    setLoading(true)
    // get all the other dependency contracts deployed
    const relayer = new ContractFactory(
      relayerCompiled as CompiledContract,
      library as Provider
    )
    const authenticator = new ContractFactory(
      authenticatorCompiled as CompiledContract,
      library as Provider
    )
    setLoadingMessages(["Deploying relayer..."])
    const relayerContract = await relayer.deploy()
    setLoadingMessages([
      "Deploying relayer... ✔️",
      "Deploying authenticator...",
    ])
    const authenticatorContract = await authenticator.deploy()

    const space = new ContractFactory(
      spaceCompiled as CompiledContract,
      library as Provider
    )

    setLoadingMessages([
      "Deploying relayer... ✔️",
      "Deploying authenticator... ✔️",
      "Deploying space contract... almost there!",
    ])
    const spaceAddress = await space.deploy([
      values.delay,
      values.duration,
      0,
      values.proposalThreshold,
      values.quorum,
      relayerContract.address,
      values.whitelist,
      authenticatorContract.address,
    ])

    setLoadingMessages([
      "Deploying relayer... ✔️",
      "Deploying authenticator... ✔️",
      "Deploying space contract... almost there! ✔️",
    ])

    setSpaceAddress(spaceAddress.address)
  }

  return (
    <div className="spaceFactory">
      <h1>Create a space</h1>
      First go to the <Link href={"/whitelist-factory"}>whitelist factory</Link>
      , you will deploy the whitelist. You will get an address from it, paste it
      below to deploy the space.
      <p></p>
      {loading ? (
        <div>
          {spaceAddress === undefined && (
            <img
              src={
                "https://icon-library.com/images/loading-icon-transparent-background/loading-icon-transparent-background-12.jpg"
              }
              height={200}
            />
          )}
          {loadingMessages.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
      ) : (
        <SpaceForm deploySpace={deploySpace} />
      )}
      {spaceAddress && (
        <div>
          <p>🎊 🎊 🎊 Here you go, click here to get to your space!</p>
          <Link href={`/space/${spaceAddress}`}>
            <a>{spaceAddress}</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default SpaceFactory
