import "../src/index.css"

import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { Provider as StarknetJsProvider } from "starknet"
import { configureStore } from "@reduxjs/toolkit"
import slice from "../src/slice"
// @ts-ignore
import logo from "./logo.svg"

import {
  InjectedConnector,
  StarknetProvider,
  useStarknet,
} from "@starknet-react/core"
import Link from "next/link"
import Image from "next/image"

const store = configureStore({ reducer: slice.reducer })

const ConnectToWallet = () => {
  const { connect, connectors, account } = useStarknet()
  return (
    <div>
      <h4>
        {account === undefined &&
          connectors.map((connector) =>
            connector.available() ? (
              <button key={connector.id} onClick={() => connect(connector)}>
                Connect {connector.name}
              </button>
            ) : null
          )}
        {account === undefined ? (
          <p className="please">Please connect your Argent wallet</p>
        ) : (
          <p className="please">Connected to {account}</p>
        )}
      </h4>
    </div>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <StarknetProvider
        connectors={[new InjectedConnector({ showModal: true })]}
        defaultProvider={
          new StarknetJsProvider({ baseUrl: "http://localhost:5000" })
        }
      >
        <>
          <h3>
            {" "}
            <Link href={"/"}>
              <Image src={logo} />
            </Link>
          </h3>
          <ConnectToWallet />
          <Component {...pageProps} />
        </>
      </StarknetProvider>
    </Provider>
  )
}
