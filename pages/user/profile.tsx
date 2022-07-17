import { notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import Modal from "../../components/Modal/Modal";
import { useStatus } from "../../context/ContextStatus";
import optionsRequest from "../../lib/optionsRequest";
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

interface IGameClassifications {
  id: number;
  classification: string;
}

interface IEditGameLaunch {
  game_id: number;
  game_classification_id: number;
  link: string;
  amount: number;
  date: string;
  time: string;
  participated_member: number;
  game_type: number;
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
    modal,
    setModal,
  } = useStatus();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEditGameLaunch>();

  const [tab, setTab] = useState("launched");
  const [launchedGame, setLaunchedGame] = useState<ILaunchedGames[] | []>();
  const [activeLaunchedGame, setActiveLaunchedGame] =
    useState<ILaunchedGames>();
  const [gameClassifications, setGameClassifications] =
    useState<IGameClassifications[]>();
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

  async function handleEdit(value: ILaunchedGames) {
    value?.status == "1"
      ? setModal("edit launch")
      : openNotificationWithIcon("Could not Edit!", "error");
    const res = await optionsRequest(`player/game-classification`, token);
    console.log("response ...........", res?.data);
    setGameClassifications(res?.data);
    setActiveLaunchedGame(value);
  }

  function handleDelete(value: ILaunchedGames) {
    console.log("value......................", value);
    setActiveLaunchedGame(value);
  }

  const onEditSubmit: SubmitHandler<IEditGameLaunch> = async (data) => {
    console.log("data...........", data);
  };

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
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handleEdit(item)}
                          >
                            <FaEdit />
                          </a>{" "}
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handleDelete(item)}
                          >
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
      {modal == "edit launch" ? (
        <Modal handleClose={() => setModal("")} title="Edit Game">
          <div className={styles.edit__form}>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <div>
                <label className={styles.label}>Game Classification Name</label>
                <select
                  className={styles.input}
                  {...register("game_classification_id", { required: true })}
                >
                  <option>Select game classification name</option>
                  {gameClassifications?.map((item, index) => (
                    <option
                      key={index}
                      value={item?.id}
                      selected={
                        item?.id === activeLaunchedGame?.classificationId
                          ? true
                          : false
                      }
                    >
                      {item?.classification}
                    </option>
                  ))}
                </select>
                {errors.game_classification_id &&
                  errors.game_classification_id.type === "required" && (
                    <span>This field is required</span>
                  )}
              </div>
              <div>
                <label className={styles.label}>Game Link</label>
                <input
                  className={styles.input}
                  type="text"
                  defaultValue={activeLaunchedGame?.link}
                  {...register("link", { required: true })}
                />
                {errors.link && errors.link.type === "required" && (
                  <span>This field is required</span>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "10px",
                }}
              >
                <div>
                  <label className={styles.label}>Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    defaultValue={activeLaunchedGame?.date}
                    {...register("date", { required: true })}
                  />
                  {errors.date && errors.date.type === "required" && (
                    <span>This field is required</span>
                  )}
                </div>
                <div>
                  <label className={styles.label}>Time</label>
                  <input
                    className={styles.input}
                    type="time"
                    defaultValue={activeLaunchedGame?.time}
                    {...register("time", { required: true })}
                  />
                  {errors.time && errors.time.type === "required" && (
                    <span>This field is required</span>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <label className={styles.label}>Amount</label>
                  <input
                    className={styles.input}
                    type="number"
                    defaultValue={activeLaunchedGame?.amount}
                    {...register("amount", { required: true })}
                  />
                  {errors.amount && errors.amount.type === "required" && (
                    <span>This field is required</span>
                  )}
                </div>
                <div>
                  <label className={styles.label}>Game Type</label>
                  <select className={styles.input}>
                    <option
                      value="1"
                      selected={
                        activeLaunchedGame?.game_type === "1" ? true : false
                      }
                    >
                      Single
                    </option>
                    <option
                      value="2"
                      selected={
                        activeLaunchedGame?.game_type === "2" ? true : false
                      }
                    >
                      Team
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className={styles.label}>Participated Member</label>
                <input
                  className={styles.input}
                  type="number"
                  defaultValue={activeLaunchedGame?.participatedMember}
                  {...register("participated_member", { required: true })}
                />
                {errors.participated_member &&
                  errors.participated_member.type === "required" && (
                    <span>This field is required</span>
                  )}
              </div>
              <div>
                <input type="submit" value="Confirm" className={styles.button} />
              </div>
            </form>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
