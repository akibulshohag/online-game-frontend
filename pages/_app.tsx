// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import { StatusProvider } from "../context/ContextStatus.js";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {

  


const initialOptions = {
  "client-id": "AVEnGvCBTj0x0mrp1Cy42mJRTy1sLGrPj1wIySCUL_tnqmmNuVAztUp5W0-3wXGMetk2G9tUb2-E7i1C",
  currency: "USD",
  intent: "capture",
  // "data-client-token": token,
};
  return (
    // <PayPalScriptProvider options={initialOptions}>
    <StatusProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StatusProvider>
    // </PayPalScriptProvider>

  );
}

export default MyApp;
