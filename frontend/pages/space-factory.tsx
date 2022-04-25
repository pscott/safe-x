import { Field, Form, Formik } from "formik"
import { useStarknet } from "@starknet-react/core"
import Link from "next/link"
import Image from 'next/image'
import mypic from './logo.svg';

const SpaceForm: React.FC = () => {
  return (
    <Formik
      initialValues={{ whitelistAddress: "" }}
      onSubmit={({ whitelistAddress }) => console.log(whitelistAddress)}
    >
      {() => (
        <div>
          <Form>
            <Field name="whitelistAddress" placeholder="0x57736560d694debafd8f346b..." className="main"/>
            <p>              </p>
            <button type="submit">Deploy</button>
          </Form>
        </div>
      )}
    </Formik>
  )
}

const SpaceFactory: React.FC = () => {
  const {account} = useStarknet()

  return (
    <div className="spaceFactory">
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
          height: 20px
        }
      `}</style>
                        {account === undefined
        ? <p>Please connect your Argent wallet</p>
        : <p>Connected to {account}</p>}

      <h1>Create a space</h1>
      First go to the <Link href={"/whitelist-factory"}>whitelist factory</Link>,
      you will deploy the whitelist. You will get an address from it, paste it
      below to deploy the space.
      <p></p>
      <SpaceForm />
    </div>
  )
}

export default SpaceFactory
