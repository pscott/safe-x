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

import { Web3Provider } from "@ethersproject/providers"
import {  Web3ReactProvider } from "@web3-react/core"

const store = configureStore({ reducer: slice.reducer })

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const shortenAddress = (address: string): string => {
  const first = address.substring(0, 6)
  const second = address.substring(address.length - 4)
  return `${first}...${second}`
}

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
          <p className="please">Connected to {shortenAddress(account)}</p>
        )}
      </h4>
    </div>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
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
                <a>
                  <Image src={logo} />
                </a>
              </Link>
            </h3>
            <ConnectToWallet />
            <Component {...pageProps} />
          </>
        </StarknetProvider>
      </Web3ReactProvider>
    </Provider>
  )
}
