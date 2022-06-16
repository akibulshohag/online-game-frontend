import { Fragment } from "react";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";
import Navbar from "./Navbar/Navbar";

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  return (
    <div className={styles.main}>
      <Navbar />
      <Fragment>{children}</Fragment>
      <Footer />
    </div>
  );
}
