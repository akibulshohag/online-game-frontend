import { notification } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStatus } from "../../context/ContextStatus";
import postRequest from "../../lib/postRequest";
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
}
interface IGames {
  classificationId: number;
  classificationImage: string;
  classificationName: string;
  games: ISingleGame[];
}

export default function AvailableGames() {
  const { userId, setUserId, token, setToken } = useStatus();
  const [games, setGames] = useState<IGames[] | []>([]);
  const [activeGame, setActiveGame] = useState<IGames | null>(null);
  const openNotificationWithIcon = (
    message: string,
    type: string,
    err?: string
  ) => {
    if (type == "success" || type == "error" || type == "warning") {
      notification[type]({ message: message });
    }
  };

  console.log("user...............", userId);
  useEffect(() => {
    (async () => {
      const response = await request(
        `player/published-game-list?player_id=${userId}`,
        token
      );
      console.log("response...........", response?.data);
      setGames(response?.data);
      setActiveGame(response?.data?.length ? response?.data[0] : null);
    })();
  }, []);

  async function handleRequest(gameDetails: ISingleGame) {
    console.log("request sending button working...........", gameDetails);
    const res = await postRequest(`player/game-request-send`, token, {
      game_id: gameDetails?.gameId,
      launch_player_id: gameDetails?.launchGamePlayerId,
      accept_player_id: Number(userId),
      game_type: Number(gameDetails?.game_type),
      status: 2,
    });
    console.log("response.........", res);
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  }

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
          Games
        </h3>
      </div>
      <div className={styles.available__games__container}>
        {games?.map((item, index) => (
          <div
            key={index}
            className={styles.single__games__container}
            onClick={() => setActiveGame(item)}
          >
            <Image src={item?.classificationImage} height={300} width={300} />
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
                {item?.games?.length}
              </span>
            </h5>
          </div>
        ))}
      </div>
      <div className={styles.container__with__shadow}>
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
          {/* <h6 style={{marginBottom:"0px"}}></h6> */}
          <p style={{ fontSize: "12px" }}>
            Last Chance to Grab! These tournaments are ending soon.
          </p>
        </div>
        <div className={styles.active__game__container}>
          {activeGame?.games?.map((item, index) => (
            <div key={index} className={styles.active__single__game__container}>
              <Image
                src={`/assets/images/logoIcon.png`}
                height={40}
                width={40}
              />
              <h4 style={{ fontSize: "18px", margin: "auto 0px" }}>
                {activeGame?.classificationName} - Starts{" "}
                {item?.date?.toString()} {item?.time} |{" "}
                {item?.game_type == "1" ? "Single" : "Team"}
              </h4>
              <h5 style={{ margin: "auto 0px", fontSize: "16px" }}>
                Launch Player - {item?.launchGamePlayerUserName}
              </h5>
              <h5 style={{ margin: "auto 0px", fontSize: "16px" }}>
                <span style={{ fontWeight: "700" }}>$ {item?.amount}</span> -
                Entry Fee
              </h5>
              <button
                className={styles.request__button}
                onClick={() => handleRequest(item)}
              >
                Request for Entry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
