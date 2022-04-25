import React from "react"
import { Formik, Form, Field, FieldArray } from "formik"
import Link from 'next/link'

export const AddressList = () => (
  <div>
    <Formik
      initialValues={{ addresses: [] }}
      onSubmit={(values) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
        }, 500)
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
                    <Field className="addressForm" name={`addresses.${index}`} />
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
  return (
    <div className="whitelistFactory">
      <Link href={"/"}> Go back home</Link>
      <h1>Create a whitelist</h1>
      <p>Input the signers, they are ethereum wallets</p>
      <AddressList />
    </div>
  )
}

export default WhitelistFactory
