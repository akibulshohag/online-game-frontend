import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Chat from "../../components/Chat/chat";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";
// import Navbar from "./Navbar/Navbar";
import Navbars from './Navbar/Navbar'
import { parseCookies, setCookie } from "nookies";

type Props = {
  children: JSX.Element;
};

const slug = "user/profile/0.yb0xwu44wm&&7plyerId0.yb0xwu44wm";

export default function Layout({ children }: Props) {
  const cookie = parseCookies();

  const router = useRouter();

  const hideChat = (val:any)=>{
    setCookie(null, "hideChat", val, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    window.location.reload()
  }


  return (
    <div className={styles.main}>
      {router.query.profile ? null : <Navbars />}
      <Fragment>{children}</Fragment>
      {router.query.profile ? null : <Footer />}
      {/* {cookie?.hideChat  == "show" ? ( */}
        <div className={styles.shoutbox}>
          <Chat />
        </div>
      {/* ) : <div onClick={()=>hideChat("show")} className={styles.chatHere}>
      <p>Chat Here</p>
    </div>} */}
    </div>
  );
}
