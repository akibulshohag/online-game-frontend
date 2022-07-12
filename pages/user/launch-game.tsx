import Image from "next/image";
import { useStatus } from "../../context/ContextStatus";
import styles from "../../styles/LaunchGame.module.css";

export default function LaunchGame() {
  const { token, setToken, modal, setModal } = useStatus();
  return (
    <div className={styles.main}>
      <div className={styles.games__container}>
        <div className={styles.video__overlay}></div>
        <video src={"/assets/videos/gaming.webm"} autoPlay loop muted />
        <div className={styles.video__content}>
          <h1>
            Launch Your{" "}
            <span className={styles.video__content__play}>Game</span>
          </h1>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <p style={{ marginBottom: "0px" }}>
              Launch your gaming arena and see who are interested.
            </p>
            {/* <p>few clicks without any additional downloads</p> */}
          </div>
        </div>
        <div className={styles.container}>
          <div>
            <div>
              <Image src="/assets/images/1.png" height={300} width={300} />
            </div>
            <div>
              <h5>Launch your game and get ready </h5>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.container}>
            <div>
              <div>
                <h5>kfdjh</h5>
              </div>
              <div>
                <Image src="/assets/images/2.png" height={300} width={300} />
              </div>
            </div>
          </div>
        </div>
        <div style={{textAlign: 'center', marginBottom:'-7px'}}>
          <Image src="/assets/images/3.png" height={200} width={200} />
        </div>
      </div>
    </div>
  );
}
