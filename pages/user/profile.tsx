import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useStatus } from "../../context/ContextStatus";
import request from "../../lib/request";
import styles from "../../styles/Profile.module.css";

interface ILaunchedGames {
  gameId: number;
  classificationId: number;
  classificationName: string;
  launchGamePlayerId: number;
  launchGamePlayerUserName: string;
  launchGamePlayerCountry: string;
  link: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  game_type: string;
  participatedMember: number;
}

export default function Profile() {
  const {
    token,
    setToken,
    username,
    setUsername,
    userEmail,
    setUserEmail,
    userId,
    setUserId,
  } = useStatus();
  const [tab, setTab] = useState("launched");
  const [launchedGame, setLaunchedGame] = useState<ILaunchedGames[] | []>();
  const router = useRouter();
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setUserEmail(null);
    setUserId(null);
    destroyCookie(null, "token");
    destroyCookie(null, "username");
    destroyCookie(null, "userEmail");
    destroyCookie(null, "userId");
    router.push("/");
  };

  async function getLaunchedGame() {
    setTab("launched");
    const res = await request(
      `player/game-launch-list?player_id=${userId}`,
      token
    );
    console.log("response.............", res?.data);
    setLaunchedGame(res?.data);
  }

  useEffect(() => {
    getLaunchedGame();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profile__container}>
          <div className={styles.profile__dashboard}>
            <div style={{ textAlign: "center", padding: "20px 0px" }}>
              <Image
                src="/assets/images/profile.png"
                height={200}
                width={200}
              />
            </div>
            <Link href={"/user/available-games"}>
              <a>Available Games</a>
            </Link>
            <a onClick={() => getLaunchedGame()}>Your Launched Game</a>
            <a onClick={() => setTab("launch")}>Launch Game</a>
            <a onClick={handleLogout}>Log out</a>
          </div>
          <div>
            {tab === "launched" ? (
              <div className={styles.launched__container}>
                <h5>Your Launched Game List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.launched__game__header}>
                    <h6>Game Classification Name</h6>
                    <h6>Date</h6>
                    <h6>Time</h6>
                    <h6>Game Type</h6>
                    <h6>Action</h6>
                  </div>
                  <hr />
                  {launchedGame?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.launched__game__header}>
                        <p>{item?.classificationName}</p>
                        <p>{item?.date}</p>
                        <p>{item?.time}</p>
                        <p>{item?.game_type == "1" ? "Single" : "Team"}</p>
                        <div style={{ margin: "auto 0px" }}>
                          <a className={styles.edit__delete__button}>
                            <FaEdit />
                          </a>{" "}
                          <a className={styles.edit__delete__button}>
                            <MdDeleteSweep />
                          </a>
                        </div>
                      </div>
                      {launchedGame?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "launch" ? (
              <div>launch</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
