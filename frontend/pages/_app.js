import '../styles/global.css'

export default function App({ Component, pageProps }) {
    // This is a bit of a hack to ensure styles reload on client side route changes.
// See: https://github.com/zeit/next-plugins/issues/282#issuecomment-480740246
if (process.env.NODE_ENV !== 'production') {
    Router.events.on('routeChangeComplete', () => {
      const path = '/_next/static/css/styles.chunk.css'
      const chunksSelector = `link[href*="${path}"]`
      const chunksNodes = document.querySelectorAll(chunksSelector)
      const timestamp = new Date().valueOf()
      chunksNodes[0].href = `${path}?${timestamp}`
    })
  }
  return <Component {...pageProps} />
}