import { Formik, Form, Field, FieldArray } from "formik"
import Link from "next/link"

import whitelistContract from "../starknet-artifacts/contracts/starknet/strategies/whitelist.cairo/whitelist.json"
import whitelistAbi from "../starknet-artifacts/contracts/starknet/strategies/whitelist.cairo/whitelist_abi.json"
import { useStarknet } from "@starknet-react/core"
import { CompiledContract, ContractFactory } from "starknet"
import { Provider } from "starknet"
import { Abi } from "starknet"
import { BigNumberish } from "starknet/dist/utils/number"
import { useState } from "react"

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
                      placeholder="0x209469C921db9d5Bd7..."
                      name={`addresses.${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                    >
                      -
                    </button>
                    <p></p>
                  </div>
                ))}
                <p></p>
                <button type="button" onClick={() => arrayHelpers.push("")}>
                  Add an address
                </button>
                <p></p>
                <div>
                  <button type="submit">Submit</button>{" "}
                  <Link href={"space-factory"}>
                    <button>Back</button>
                  </Link>
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
  const [whitelistAddr, setwhitelistAdrr] = useState<string>()
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
    setwhitelistAdrr(whitelistAddress.address)
  }

  return (
    <div className="whitelistFactory">
      <h1>Create a whitelist</h1>
      <p>Input the signers, they are ethereum wallets</p>
      <AddressList deploy={deployWhitelist} />
      {whitelistAddr && <div>whitelist deployed at {whitelistAddr}</div>}
    </div>
  )
}

export default WhitelistFactory
