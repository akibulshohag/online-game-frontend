import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useStatus } from "../context/ContextStatus";
import request from "../lib/request";
import styles from "../styles/Home.module.css";

interface IGames {
  classificationId: number;
  classificationImage: string;
  classificationName: string;
  games: ISingleGame[] | 0;
  count: number;
}
interface ISingleGame {
  gameId: number;
  launchGamePlayerId: number;
  launchGamePlayerUserName: string;
  launchGamePlayerCountry: string;
  link: string;
  amount: number;
  date: string;
  time: string;
  game_type: string;
  round: number;
  utcTime: string;
  utcDate: string;
  skill: string;
  honesty: string;
}

const Home: NextPage = () => {
  const { modal, setModal, token } = useStatus();
  const [games, setGames] = useState<IGames[] | []>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await request(`combined`, null);
        setGames(response?.data);
      } catch (error) {
        console.log("........err", error);
      }
    })();
  }, []);

  const redirectPage = () => {
    if (token) {
      router.push("/user/profile");
    } else {
      setModal("login");
    }
  };

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
        <div style={{ width: "100%", height: 900, position: "relative" }}>
          <Image
            style={{ marginTop: 5 }}
            src={`/assets/images/slider1.jpeg`}
            layout="fill"
            priority={true}
            //  width='100%'
            //  height={900}
          />
        </div>

        <div className={styles.video__content}>
          <h1>
            PLAY GAMES
            <span className={styles.video__content__play}>GET PAID</span>
          </h1>
          {/* <div style={{ textAlign: "center", marginTop: "15px" }}>
            <p style={{ marginBottom: "0px" }}>
              Compete in Free and Paid entry Tournaments in just a
            </p>
            <p>few clicks without any additional downloads</p>
          </div> */}
          {/* <div className={styles.counter__container}>
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
          </div> */}
        </div>
      </div>
      <Container>
        <div className={styles.games__container}>
          <h3 style={{ color: "black" }}>Mini Platform</h3>
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
          {games?.length > 0 ? (
            <div className={styles.games__grid__view}>
              {games.map((item, index) => (
                <div key={index} onClick={() => setModal("signup")}>
                  <Image
                    src={`${item?.classificationImage}`}
                    height={300}
                    width={300}
                  />
                  <h3 style={{ color: "#000" }}>
                    {item?.classificationName} : {item?.count}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.games__grid__view}>
              <div onClick={() => redirectPage()}>
                <Image
                  src={`/assets/images/game/banner.png`}
                  height={300}
                  width={230}
                />
                <h3 style={{ color: "#000" }}>Football</h3>
              </div>

              <div>
                <Image
                  src={`/assets/images/game/banner.png`}
                  height={300}
                  width={230}
                />
              </div>
              <div>
                <Image
                  src={`/assets/images/game/banner.png`}
                  height={300}
                  width={230}
                />
              </div>
              <div>
                <Image
                  src={`/assets/images/game/banner.png`}
                  height={300}
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
          )}
        </div>
      </Container>
      <div style={{ margin: "50px 0px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontWeight: "700",
          }}
          className={styles.connect__mobile}
        >
          CONNECT WITH OUR MOBILE APP
        </h2>
        <Container className={styles.download__app__container}>
          <div style={{ margin: "auto 0px" }}>
            <a className={styles.download__button}>Download App Now</a>
            <p></p>
            <Image src={`/assets/images/play.png`} height={90} width={220} />
            <Image src={`/assets/images/app.png`} height={90} width={220} />
            <h6 style={{ color: "#000" }}>
              Download the UPA mobile app to create/accept
              challenges/tournaments and manage your account in the palm of your
              hand.{" "}
            </h6>
          </div>
          <Image src={`/assets/images/mobile1.webp`} height={500} width={700} />
        </Container>
      </div>
      {/* <div className={styles.unlimited__container}>
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
      </div> */}
      {/* <div style={{ backgroundColor: "#F0F0F0" }}>
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
      </div> */}
      {/* <div style={{ backgroundColor: "#0A1861" }}>
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
      </div> */}
    </div>
  );
};

export default Home;
