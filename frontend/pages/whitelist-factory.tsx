import { Formik, Form, Field, FieldArray } from "formik"
import { useStarknet } from "@starknet-react/core"
import Link from "next/link"
import Image from 'next/image'
import mypic from './logo.svg';

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
                    <Field className="addressForm" placeholder="0x209469C921db9d5Bd7..."  name={`addresses.${index}`} />
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
                  <button type="submit">Submit</button>  <Link href={"space-factory"}><button>Back</button>
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
              <h3>      <Link href={"/"}>
<Image src={mypic}/></Link></h3>
          <style global jsx>{`
        body {
          font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica',
          'Arial', sans-serif;
          background: linear-gradient(to left top,  rgb(253, 103, 140), rgb(201, 201, 201), white,rgb(191, 191, 191), white, rgb(253, 103, 140));
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
        main{
          width: 200%
        }
        input{
          width: 470px;
          height: 40px
        }
      `}</style>
                        {account === undefined
        ? <p>Please connect your Argent wallet</p>
        : <p>Connected to {account}</p>}

                    <h3>      <Link href={"/"}>
<Image src={mypic}/></Link></h3>
      <h1>Create a whitelist</h1>
      <p>Input the signers, they are ethereum wallets</p>
      <AddressList deploy={deployWhitelist} />
    </div>
  )
}

export default WhitelistFactory
