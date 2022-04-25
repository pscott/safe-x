import React from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import Link from "next/link"

import whitelistContract from "../starknet-artifacts/contracts/starknet/strategies/whitelist.cairo/whitelist.json"
import whitelistAbi from "../starknet-artifacts/contracts/starknet/strategies/whitelist.cairo/whitelist_abi.json"
import { useStarknet } from "@starknet-react/core"
import { ContractFactory } from "starknet"
import { CompiledContract } from "starknet"
import { Provider } from "starknet"
import { Abi } from "starknet"
import { BigNumberish } from "starknet/dist/utils/number"

export const AddressList: React.FC<{
  deploy: (addresses: BigNumberish[]) => Promise<void>
}> = ({ deploy }) => (
  <div>
    <Formik
      initialValues={{ addresses: [] }}
      onSubmit={(values) => {
        deploy(values.addresses)
      }}
    >
      {({ values }) => (
        <Form className="whitelistFactoryForm">
          <FieldArray
            name="addresses"
            render={(arrayHelpers) => (
              <div>
                {values.addresses.map((_, index) => (
                  <div key={index}>
                    <Field
                      className="addressForm"
                      name={`addresses.${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                    >
                      -
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => arrayHelpers.push("")}>
                  Add an address
                </button>
                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  </div>
)

const WhitelistFactory: React.FC = () => {
  const { library } = useStarknet()
  const deployWhitelist = async (addresses: BigNumberish[]) => {
    const whitelist = new ContractFactory(
      whitelistContract as CompiledContract,
      library as Provider,
      whitelistAbi as Abi
    )
    const whitelistAddress = await whitelist.deploy([
      addresses.length,
      ...addresses,
    ])
    console.log(whitelistAddress)
  }

  return (
    <div className="whitelistFactory">
      <Link href={"/"}> Go back home</Link>
      <h1>Create a whitelist</h1>
      <p>Input the signers, they are ethereum wallets</p>
      <AddressList deploy={deployWhitelist} />
    </div>
  )
}

export default WhitelistFactory
