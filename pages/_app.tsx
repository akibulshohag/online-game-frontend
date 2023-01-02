import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout/Layout";
import { StatusProvider } from "../context/ContextStatus.js";
import '../context/i18next';
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <StatusProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StatusProvider>

  );
}

export default MyApp;
