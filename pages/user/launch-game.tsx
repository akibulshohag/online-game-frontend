import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useStatus } from "../../context/ContextStatus";
import request from "../../lib/request";
import styles from "../../styles/LaunchGame.module.css";

export default function LaunchGame() {
  const { token, setToken, modal, setModal, userId, setUserId } = useStatus();
  const [launchedGame, setLaunchedGame] = useState([])

  useEffect(() => {
    (async () => {
      const res = await request(`player/game-launch-list?player_id=${userId}`, token)
      console.log('response from launch game................', res?.data)
      setLaunchedGame(res?.data)
    })()
  }, [])
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
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.image__text}>
            <div>
              <Image src="/assets/images/1.png" height={300} width={300} />
            </div>
            <div style={{margin: 'auto 20px'}}>
              <h5>Launch your game and get ready </h5>
              <a onClick={() => setModal('launch')}>Launch Game</a>
            </div>
          </div>
        </div>
        {/* <div>
          <div className={styles.container}>
            <div className={styles.text__image}>
              <div style={{margin: 'auto 20px'}}>
                <h5>Launch your game and get ready </h5>
                <a onClick={() => setModal('launch')}>Launch Now</a>
              </div>
              <div>
                <Image src="/assets/images/2.png" height={300} width={450} />
              </div>
            </div>
          </div>
        </div> */}
        <div>
          <h4 style={{textAlign:'center'}}>Your Launched Game List</h4>
          <div>
            
          </div>
        </div>
        <div style={{textAlign: 'center', marginBottom:'-7px'}}>
          <Image src="/assets/images/3.png" height={200} width={200} />
        </div>
      </div>
      {modal == 'launch' ? <Modal title="Launch Game" handleClose={() => setModal("")} >

      </Modal> : null}
    </div>
  );
}
