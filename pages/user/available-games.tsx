import { notification } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStatus } from "../../context/ContextStatus";
import request from "../../lib/request";
import styles from "../../styles/AvailableGames.module.css";

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
  count: number;
}
interface IGames {
  classificationId: number;
  classificationImage: string;
  classificationName: string;
  games: ISingleGame[] | 0;
  count: number;
}

export default function AvailableGames() {
  const {
    userId,
    setUserId,
    token,
    setToken,
    credit,
    modal,
    setModal,
    selectedChallenge,
  } = useStatus();
  const [games, setGames] = useState<IGames[] | []>([]);
  const [activeGame, setActiveGame] = useState<IGames | null>(null);
  const router = useRouter();

  const openNotificationWithIcon = (
    message: string,
    type: string,
    err?: string
  ) => {
    if (type == "success" || type == "error" || type == "warning") {
      notification[type]({ message: message });
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     const response = await request(
  //       `player/published-game-list?player_id=${userId}`,
  //       token
  //     );
  //     // console.log("response...........gamed", response?.data);
  //     setGames(response?.data);
  //     setActiveGame(response?.data?.length ? response?.data[0] : null);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      if (selectedChallenge === "Challenges") {
        const response = await request(`challenge`, null);
        setGames(response?.data);
        // setActiveGame(response?.data?.length ? response?.data[0] : null);
      } else {
        const response = await request(`tournament`, null);
        setGames(response?.data);
      }
    })();
  }, [selectedChallenge]);

  // async function handleRequest(gameDetails: ISingleGame) {
  //   console.log("request sending button working...........", gameDetails);
  //   const res = await postRequest(`player/game-request-send`, token, {
  //     game_id: gameDetails?.gameId,
  //     launch_player_id: gameDetails?.launchGamePlayerId,
  //     accept_player_id: Number(userId),
  //     game_type: Number(gameDetails?.game_type),
  //     status: 2,
  //   });
  //   // console.log("response.........", res);
  //   if (res?.status == "success") {
  //     openNotificationWithIcon(res?.message, "success");
  //     window.location.reload();
  //   } else {
  //     openNotificationWithIcon(res?.message, "error");
  //   }
  // }

  const redirectPage = () => {
    if (token) {
      router.push("/user/profile");
    } else {
      setModal("login");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.games__container}>
        <div className={styles.video__overlay}></div>
        <video src={"/assets/videos/gaming.webm"} autoPlay loop muted />
        <div className={styles.video__content}>
          <h1>
            Ultimate Players{" "}
            <span className={styles.video__content__play}>Arena</span>
          </h1>
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <p style={{ marginBottom: "0px" }}>
              See Available Games and Let&apos;s Get Started!
            </p>
            {/* <p>few clicks without any additional downloads</p> */}
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <h3 style={{ textAlign: "center" }}>
          <span
            style={{
              backgroundColor: "#F35237",
              color: "white",
              padding: "10px 20px",
            }}
          >
            Available
          </span>{" "}
          {selectedChallenge} Games
        </h3>
      </div>
      <div className={styles.available__games__container}>
        {games?.map((item, index) => (
          <div
            key={index}
            className={styles.single__games__container}
            onClick={() => redirectPage()}
          >
            <Image
              src={item?.classificationImage}
              height={300}
              width={300}
              alt="classificationImage"
            />
            <h5
              style={{ textAlign: "center", color: "#fff", fontWeight: "700" }}
            >
              {item?.classificationName}{" "}
              <span
                style={{
                  backgroundColor: "white",
                  color: "#F35237",
                  padding: "0px 10px",
                }}
              >
                {item?.count == 0 ? 0 : item?.count}
              </span>
            </h5>
          </div>
        ))}
      </div>
      {/* <div className={styles.container__with__shadow}>
        <div style={{ paddingLeft: "20px" }}>
          <h3
            style={{
              marginTop: "10px",
              marginBottom: "0px",
              color: "#F35237",
              fontWeight: "700",
              fontSize: "35px",
            }}
          >
            {activeGame?.classificationName}
          </h3>
          <p style={{ fontSize: "12px" }}>
            Last Chance to Grab! These tournaments are ending soon.
          </p>
        </div>
        <div className={styles.active__game__container}>
          {activeGame?.games == 0
            ? null
            : activeGame?.games?.map((item, index) => (
                <div
                  key={index}
                  className={styles.active__single__game__container}
                >
                  <Image
                    src={`/assets/images/logoIcon.png`}
                    height={40}
                    width={40}
                  />
                  <h4 style={{ fontSize: "18px", margin: "auto 0px" }}>
                    {activeGame?.classificationName} - Starts{" "}
                   
                    
                    {moment.utc(item?.utcDate + ' ' + item?.utcTime ).local().format('YYYY-MM-DD HH:mm')}
                       |{" "}
                    {item?.game_type == "1" ? "Single" : "Team"}
                  </h4>
                  <h5 style={{ margin: "auto 0px", fontSize: "16px" }}>
                    Launch Player - {item?.launchGamePlayerUserName}
                  </h5>
                  <div className={styles.skillContainer}>
                    <h5 style={{ margin: "auto 0px", fontSize: "16px",color:'#f35237' }}>
                    Skill
                    </h5>
                    <div className={styles.skill}>
                    <h5 style={{ margin: "auto 0px", fontSize: "16px",color:'#fff' }}>{item?.skill}</h5>
                  </div>
                  </div>
                  <div className={styles.honestyContainer}>
                    <h5 style={{ margin: "auto 0px", fontSize: "16px",color:'#f35237' }}>
                    Honesty
                    </h5>
                    <div className={styles.honesty}>
                    <h5 style={{ margin: "auto 0px", fontSize: "16px",color:'#fff' }}>{item?.honesty}</h5>
                  </div>
                  </div>
                  
                  <h5 style={{ margin: "auto 0px", fontSize: "16px" }}>Round - {item?.round}</h5>
                  <h5 style={{ margin: "auto 0px", fontSize: "16px" }}>
                    <span style={{ fontWeight: "700" }}>$ {item?.amount}</span>{" "}
                    - Entry Fee
                  </h5>
                  {credit >= item?.amount ? 
                  <button
                    className={styles.request__button}
                    onClick={() => handleRequest(item)}
                  >
                    Request for Entry
                  </button>
                  : null
                  }
                </div>
              ))}
        </div>
      </div> */}
    </div>
  );
}
