import { Field, Form, Formik } from "formik"
import { useStarknet } from "@starknet-react/core"
import Link from "next/link"

const SpaceForm: React.FC = () => {
  return (
    <Formik
      initialValues={{ whitelistAddress: "" }}
      onSubmit={({ whitelistAddress }) => console.log(whitelistAddress)}
    >
      {() => (
        <div>
          <Form>
            <Field
              name="whitelistAddress"
              placeholder="0x57736560d694debafd8f346b..."
              className="main"
            />
            <button type="submit">Deploy</button>
          </Form>
        </div>
      )}
    </Formik>
  )
}

const SpaceFactory: React.FC = () => {
  const { account } = useStarknet()

  return (
    <div className="spaceFactory">
      {account === undefined ? (
        <p>Please connect your Argent wallet</p>
      ) : (
        <p>Connected to {account}</p>
      )}
      <h1>Create a space</h1>
      First go to the <Link href={"/whitelist-factory"}>whitelist factory</Link>
      , you will deploy the whitelist. You will get an address from it, paste it
      below to deploy the space.
      <p></p>
      <SpaceForm />
    </div>
  )
}

export default SpaceFactory
