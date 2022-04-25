import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import slice from "../src/slice"

const store = configureStore({ reducer: slice.reducer })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
