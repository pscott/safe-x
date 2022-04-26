import { Field, Form, Formik } from "formik"
import { useStarknet } from "@starknet-react/core"
import Link from "next/link"

import relayerCompiled from "../starknet-artifacts/contracts/starknet/execution/starknet_relayer.cairo/starknet_relayer.json"
import authenticatorCompiled from "../starknet-artifacts/contracts/starknet/authenticator/authenticator.cairo/authenticator.json"
import spaceCompiled from "../starknet-artifacts/contracts/starknet/space/space.cairo/space.json"

import { CompiledContract, ContractFactory, Provider, Abi } from "starknet"
import { useState } from "react"

const SpaceForm: React.FC<any> = (props) => {
  return (
    <Formik
      initialValues={{
        whitelistAddress: "",
        delay: "",
        duration: "",
        proposalThreshold: "",
        quorum: "",
      }}
      onSubmit={(values) => props.deploySpace(values)}
    >
      {() => (
        <div>
          <Form>
            <p>whitelistAddress</p>
            <Field
              name="whitelistAddress"
              placeholder="0x57736560d694debafd8f346b..."
              className="main"
            />
            <p>delay</p>
            <Field name="delay" placeholder="5" className="main" />
            <p>duration</p>
            <Field name="duration" placeholder="20" className="main" />
            <p>proposalThreshold</p>
            <Field name="proposalThreshold" placeholder="0" className="main" />
            <p>quorum</p>
            <Field name="quorum" placeholder="3" className="main" />
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

    const relayerContract = await relayer.deploy()
    const authenticatorContract = await relayer.deploy()

    /*{
      whitelistAddress: "",
      delay: "",
      duration: "",
      proposalThreshold: "",
      quorum: "",
    }*/

    /*_voting_delay : felt, _voting_duration : felt, _proposal_threshold : Uint256,
        _quorum : felt, _executor : felt, _voting_strategy : felt, _authenticator : felt)*/

    const space = new ContractFactory(
      spaceCompiled as CompiledContract,
      library as Provider
    )

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
        <div>loading... please be patient</div>
      ) : (
        <SpaceForm deploySpace={deploySpace} />
      )}
      {spaceAddress && (
        <div>
          <p>Here you go, click here to get to your space!</p>
          <Link href={`/space/${spaceAddress}`}>
            <a>{spaceAddress}</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default SpaceFactory
