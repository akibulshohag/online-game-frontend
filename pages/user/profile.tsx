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
import deleteRequest from "../../lib/deleteRequest";
import optionsRequest from "../../lib/optionsRequest";
import postRequest from "../../lib/postRequest";
import putRequest from "../../lib/putRequest";
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

interface IGameLaunch {
  game_classification_id: number;
  player_id: number;
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

  const [tab, setTab] = useState("launched");
  const [gameType, setGameType] = useState<Number>(1);
  const [launchedGame, setLaunchedGame] = useState<ILaunchedGames[] | []>();
  const [activeLaunchedGame, setActiveLaunchedGame] =
    useState<ILaunchedGames>();
  const [gameClassifications, setGameClassifications] =
    useState<IGameClassifications[]>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEditGameLaunch>();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm<IGameLaunch>();

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
    handleClassification();
  }, []);

  async function handleClassification() {
    const res = await optionsRequest(`player/game-classification`, token);
    console.log("response ...........", res?.data);
    setGameClassifications(res?.data);
  }

  async function handleEdit(value: ILaunchedGames) {
    value?.status == "1"
      ? setModal("edit launch")
      : openNotificationWithIcon("Could not Edit!", "error");
    handleClassification();
    setActiveLaunchedGame(value);
  }

  async function handleDelete(value: ILaunchedGames) {
    console.log("value......................", value);
    setActiveLaunchedGame(value);
    if (value?.status === "1") {
      openNotificationWithIcon("You can't delete this game", "error");
    } else {
      const res = await deleteRequest(`player/game-launch-delete`, token, {
        game_id: value?.gameId,
      });
      if (res?.status === "success") {
        openNotificationWithIcon(res?.message, "success");
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    }
  }

  const onEditSubmit: SubmitHandler<IEditGameLaunch> = async (data) => {
    console.log("data...........", data);
    const res = await putRequest(`player/game-launch-edit`, token, {
      game_id: activeLaunchedGame?.gameId,
      game_classification_id: data?.game_classification_id
        ? data?.game_classification_id
        : activeLaunchedGame?.classificationId,
      link: data?.link ? data?.link : activeLaunchedGame?.link,
      amount: data?.amount ? data?.amount : activeLaunchedGame?.amount,
      date: data?.date ? data?.date : activeLaunchedGame?.date,
      time: data?.time ? data?.time : activeLaunchedGame?.time,
      participated_member: data?.participated_member
        ? data?.participated_member
        : activeLaunchedGame?.participatedMember,
      game_type: data?.game_type
        ? data?.game_type
        : activeLaunchedGame?.game_type,
    });
    console.log("response............", res);
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      // window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  const onLaunchSubmit: SubmitHandler<IGameLaunch> = async (data) => {
    const res = await postRequest(`player/game-launched`, token, {
      game_classification_id: data?.game_classification_id,
      player_id: userId,
      link: data?.link,
      amount: data?.amount,
      date: data?.date,
      time: data?.time,
      participated_member: gameType == 2 ? data?.participated_member : 1,
      game_type: gameType,
    });
    console.log("response..........", res);
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profile__container}>
          <div>
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
              <div className={styles.launch__game__container}>
                <h5 style={{ textAlign: "center", margin: "10px 0px" }}>
                  Please, fill up the form to launch your game
                </h5>
                <div className={styles.edit__form}>
                  <form onSubmit={handleSubmit2(onLaunchSubmit)}>
                    <div>
                      <label className={styles.label}>
                        Game Classification Name
                      </label>
                      <select
                        className={styles.input}
                        {...register2("game_classification_id", {
                          required: true,
                        })}
                      >
                        <option>Select game classification name</option>
                        {gameClassifications?.map((item, index) => (
                          <option key={index} value={item?.id}>
                            {item?.classification}
                          </option>
                        ))}
                      </select>
                      {errors2.game_classification_id &&
                        errors2.game_classification_id.type === "required" && (
                          <span>This field is required</span>
                        )}
                    </div>
                    <div>
                      <label className={styles.label}>Game Link</label>
                      <input
                        className={styles.input}
                        type="text"
                        {...register2("link", { required: true })}
                      />
                      {errors2.link && errors2.link.type === "required" && (
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
                          {...register2("date", { required: true })}
                        />
                        {errors2.date && errors2.date.type === "required" && (
                          <span>This field is required</span>
                        )}
                      </div>
                      <div>
                        <label className={styles.label}>Time</label>
                        <input
                          className={styles.input}
                          type="time"
                          {...register2("time", { required: true })}
                        />
                        {errors2.time && errors2.time.type === "required" && (
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
                          {...register2("amount", { required: true })}
                        />
                        {errors2.amount &&
                          errors2.amount.type === "required" && (
                            <span>This field is required</span>
                          )}
                      </div>
                      <div>
                        <label className={styles.label}>Game Type</label>
                        <select
                          className={styles.input}
                          onChange={(e) => setGameType(Number(e.target.value))}
                        >
                          <option value={0}>Select Game Type</option>
                          <option value={1}>Single</option>
                          <option value={2}>Team</option>
                        </select>
                      </div>
                    </div>
                    {gameType !== 1 ? (
                      <div>
                        <label className={styles.label}>
                          Participated Member
                        </label>
                        <input
                          className={styles.input}
                          type="number"
                          {...register2("participated_member")}
                        />
                        {errors2.participated_member &&
                          errors2.participated_member.type === "required" && (
                            <span>This field is required</span>
                          )}
                      </div>
                    ) : null}
                    <div>
                      <input
                        type="submit"
                        value="Confirm"
                        className={styles.button}
                      />
                    </div>
                  </form>
                </div>
              </div>
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
                  {...register("game_classification_id")}
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
                  {...register("link")}
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
                    {...register("date")}
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
                    {...register("time")}
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
                    {...register("amount")}
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
                  {...register("participated_member")}
                />
                {errors.participated_member &&
                  errors.participated_member.type === "required" && (
                    <span>This field is required</span>
                  )}
              </div>
              <div>
                <input
                  type="submit"
                  value="Confirm"
                  className={styles.button}
                />
              </div>
            </form>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
