import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { useStatus } from "../context/ContextStatus";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { modal, setModal } = useStatus();
  return (
    <div className={styles.main}>
      <Head>
        <title>Ultimate Players Arena</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.home__container}>
        <div className={styles.video__overlay}></div>
        {/* <video src={"/assets/videos/gaming2.webm"} autoPlay loop muted /> */}
        <div style={{width:'100%',height:900}}>
        <Image
              style={{marginTop:5}}
               src={`/assets/images/slider1.jpeg`}
               layout='fill'
               />
        </div>
            
        <div className={styles.video__content}>
          <h1>
            GET PAID TO{" "}
            <span className={styles.video__content__play}>PLAY</span>
          </h1>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <p style={{ marginBottom: "0px" }}>
              Compete in Free and Paid entry Tournaments in just a
            </p>
            <p>few clicks without any additional downloads</p>
          </div>
          <div className={styles.counter__container}>
            <div>
              <p>Games Played on Repeat</p>
              <h5>260,828,947</h5>
            </div>
            <div>
              <p>Total Prizes Paid Out</p>
              <h5>
                <span>$</span>986,843
              </h5>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <div className={styles.games__container}>
          <h3 style={{ color: "black" }}>Available Games</h3>
          <p>We are constantly adding new games</p>
          <div
            style={{
              position: "absolute",
              right: "10px",
              marginTop: "-140px",
              backgroundColor: "#F35237",
              color: "white",
              padding: "8px 30px",
              cursor: "pointer",
            }}
          >
            <a onClick={() => setModal("signup")}>
              <p style={{ marginBottom: "0px" }}>Start playing Now!</p>
              <h6 style={{ fontSize: "19px" }}>Create Account</h6>
            </a>
          </div>
          <div className={styles.games__grid__view}>
            <div>
              <Image
                src={`/assets/images/game/banner.png`}
                height={350}
                width={230}
              />
            </div>
            <div>
              <Image
                src={`/assets/images/game/banner.png`}
                height={350}
                width={230}
              />
            </div>
            <div>
              <Image
                src={`/assets/images/game/banner.png`}
                height={350}
                width={230}
              />
            </div>
            <div>
              <Image
                src={`/assets/images/game/banner.png`}
                height={350}
                width={230}
              />
            </div>
            <div>
              <Image
                src={`/assets/images/game/banner.png`}
                height={350}
                width={230}
              />
            </div>
          </div>
        </div>
      </Container>
      <div className={styles.unlimited__container}>
        <h3
          style={{
            color: "#F35237",
            textAlign: "center",
            padding: "50px 0px",
            fontSize: "115px",
            fontWeight: "700",
          }}
        >
          UNLIMITED
        </h3>
        <Container>
          <div className={styles.inner__unlimited__container}>
            <h3 style={{ color: "black" }}>Play Unlimited</h3>
            <h3 style={{ marginBottom: "50px", color: "black" }}>
              Tournaments
            </h3>
            <p>
              On Repeat you can play in an unlimited number of tournaments, any
            </p>
            <p>
              time, for any game. The best thing is that your scores will count
              in
            </p>
            <p style={{ marginBottom: "50px" }}>
              every single active tournament you enter.
            </p>
            <a>Join Now</a>
          </div>
        </Container>
      </div>
      <div style={{ backgroundColor: "#F0F0F0" }}>
        <Container>
          <div className={styles.leader__board__container}>
            <div>
              <Image
                src={`/assets/images/leader.png`}
                height={550}
                width={500}
              />
            </div>
            <div>
              <h3 style={{ color: "black" }}>Climb to the top of</h3>
              <h3 style={{ color: "black" }}>the leaderboard</h3>
              <p style={{ padding: "20px 80px 50px 0px" }}>
                In our tournaments everyone has a chance to shine. Play as many
                games as you want and we will only track your best scores
                meaning that you can never have a worse score than the current
                one.
              </p>
              <a>Join Now</a>
            </div>
          </div>
        </Container>
      </div>
      <div style={{ backgroundColor: "#0A1861" }}>
        <Container>
          <div className={styles.result__board__container}>
            <div>
              <h3>Automated Result</h3>
              <h3>Tracking</h3>
              <p style={{ padding: "20px 80px 50px 0px" }}>
                Once you’ve connected your game account to Repeat.gg Profile you
                are good to go. Everything afterwards is on us, no downloads and
                no match & result submission.
              </p>
              <a>Join Now</a>
            </div>
            <div>
              <Image
                src={`/assets/images/result.png`}
                height={550}
                width={500}
              />
            </div>
          </div>
          <div className={styles.start__board__container}>
            <div>
              <Image
                src={`/assets/images/game/6.png`}
                height={550}
                width={500}
              />
            </div>
            <div style={{ margin: "50px 0px" }}>
              <h3>Stop Scrolling, Start</h3>
              <h3>Playing</h3>
              <p style={{ padding: "30px 0px 30px 0px" }}>
                Create your account now and earn 500 coins
              </p>
              <a>Join Now</a>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
