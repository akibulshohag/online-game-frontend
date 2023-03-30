import { useRouter } from "next/router";
import { Fragment } from "react";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";
import Navbar from "./Navbar/Navbar";
import Chat from "../../components/Chat/chat";

type Props = {
  children: JSX.Element;
};



const slug = "user/profile/0.yb0xwu44wm&&7plyerId0.yb0xwu44wm"

export default function Layout({ children }: Props) {

  const router = useRouter();
 

const {profile} = router.query

  return (
    <div className={styles.main}>

     { router.query.profile  ?  null :
      <Navbar />
       }
      <Fragment>{children}</Fragment>
      { router.query.profile  ?  null :
      <Footer />
      }
      <div className={styles.fixed__section}>
         <Chat/>
      </div>
    </div>
  );
}
