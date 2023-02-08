// import { PayPalButtons,PayPalScriptProvider } from "@paypal/react-paypal-js";
import { notification, Pagination } from "antd";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { Rating } from "react-simple-star-rating";
import Modal from "../../components/Modal/Modal";
import { useStatus } from "../../context/ContextStatus";
import deleteRequest from "../../lib/deleteRequest";
import optionsRequest from "../../lib/optionsRequest";
import postRequest from "../../lib/postRequest";
import putRequest from "../../lib/putRequest";
import request from "../../lib/request";
import styles from "../../styles/Profile.module.css";

// paypal

import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import moment from "moment";
// import { PayPalButtonsComponentProps } from "@paypal/paypal-js/types/components/buttons";

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
  console: string;
  rules: string;
  start: number;
  cancel: number;
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

interface ISendResult {
  screen_short: string;
  winner_player_id: number;
  result_type: number;
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
  console_id: string;
  rules: string;
  localDate: string;
  plusdate: string;
}

interface IRequestList {
  gameClassificationName: string;
  gameId: number;
  gameNo: string;
  playerId: number;
  playerUserName: string;
  playerCountry: string;
  gameAmount: number;
  skill: string;
  honesty: string;
}

interface IPlayer {
  playerCountry: string;
  playerId: number;
  playerUserName: string;
}

interface IGameList {
  amount: number;
  gameClassification: string;
  gameId: number;
  gameNo: string;
  gameRound: number;
  gameType: string;
  player: IPlayer[];
}

interface IResultSendGameList {
  amount: number;
  date: string;
  gameClassification: string;
  gameId: number;
  gameNo: string;
  gameRound: number;
  gameType: string;
  link: string;
  participatedMember: number;
  player: IPlayer[];
  time: string;
}

interface IResultOpinion {
  comment: string;
  id: number;
  created_at: string;
  player_id: number;
  result: string;
  result_id: number;
  updated_at: string;
}

interface IResultList {
  amount: number;
  classification: string;
  gameNo: string;
  gameType: string;
  participatedMember: number;
  resultId: number;
  resultOpinion: IResultOpinion[];
  resultStatus: string;
  screenShort: string | number;
  winnerPlayerCountry: string;
  winnerPlayerUserName: string;
  resultType?: string;
  winPlayer: string;
}

interface IPublishedResult {
  amount: number;
  gameClassification: string;
  gameNo: string;
  resultPublishedStatus: string;
  round: number;
}
interface IResultDispute {
  gameNo: number;
  amount: number;
  points: number;
  comments: string;
}
interface IResultSendList {
  screenShort: string;
  amount: number;
  gameClassification: string;
  gameNo: string;
  winnerPlayerCountry: string;
  winnerPlayerUserName: string;
}

interface ISendOpinion {
  result: number;
  comment: string;
}

interface IGamingConsole {
  id: string;
  name: string;
}
interface withDrawCredit {
  amount: number;
  player_id: number;
  credit: number;
}
type countryName = {
  common: string;
  official: string;
};

type allCountryType = {
  name: countryName;
  independent: boolean;
  status: string;
  unMember: boolean;
  region: string;
  subregion: string;
  landlocked: boolean;
  flag: string;
  population: number;
  fifa: string;
};

type RegistrationInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  country: string;
  refernce_player_id: number;
  image: string;
};
interface IGames {
  classificationId: number;
  classificationImage: string;
  classificationName: string;
  games: ISingleGame[] | 0;
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

interface ProfileInputs {
  image: string;
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
    points,
    setPoints,
    credit,
    setCredit,
    honesty,
    sethonesty,
    status,
    setstatus,
    country,
    setcountry,
    birthday,
    setbirthday,
  } = useStatus();

  const [tab, setTab] = useState("available-game");
  const [gameType, setGameType] = useState(1);
  const [launchedGame, setLaunchedGame] = useState<ILaunchedGames[] | []>();
  const [activeLaunchedGame, setActiveLaunchedGame] =
    useState<ILaunchedGames>();
  const [gameClassifications, setGameClassifications] =
    useState<IGameClassifications[]>();
  const [requestList, setRequestList] = useState<IRequestList[]>();
  const [gameSingleList, setGameSingleList] = useState<IGameList[] | []>();
  const [gameTournamentList, setGameTournamentList] = useState<
    IGameList[] | []
  >();
  const [singleResultList, setSingleResultList] = useState<IResultList[] | []>(
    []
  );
  const [tournamentResultList, setTournamentResultList] = useState<
    IResultList[] | []
  >();
  const [resultSendList, setResultSendList] = useState<
    IResultSendList[] | []
  >();
  const [resultSendGameList, setResultSendGameList] =
    useState<IResultSendGameList>();
  const [resultOpinion, setResultOpinion] = useState<IResultList>();
  const [viewResult, setViewResult] = useState<IResultList>();
  const [publishedResult, setPublishedResult] = useState<IPublishedResult[]>();
  const [gamingConsole, setGamingConsole] = useState<IGamingConsole[]>();
  const [resultDispute, setResultDispute] = useState<IResultDispute[]>();
  const [isValid, setIsValid] = useState(true);
  const [round, setRound] = useState(1);
  const [editRound, setEditRound] = useState(1);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [price, setprice] = useState<any>("");
  const [depositList, setdepositList] = useState([]);
  const [withdrawList, setwithdrawList] = useState([]);
  const [minDate, setminDate] = useState("");
  const [affiliateList, setaffiliateList] = useState([]);
  const [allCountry, setAllCountry] = useState<allCountryType[]>([]);
  const [games, setGames] = useState<IGames[] | []>([]);
  const [activeGame, setActiveGame] = useState<IGames | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [profileImage, setprofileImage] = useState<any>(
    "/assets/images/profile.png"
  );

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
  const {
    register: register5,
    handleSubmit: handleSubmit5,
    watch: watch5,
    formState: { errors: errors5 },
  } = useForm<withDrawCredit>();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    watch: watch3,
    formState: { errors: errors3 },
  } = useForm<ISendResult>();

  const {
    register: register4,
    handleSubmit: handleSubmit4,
    watch: watch4,
    formState: { errors: errors4 },
  } = useForm<ISendOpinion>();

  const {
    register: register6,
    handleSubmit: handleSubmit6,
    watch: watch6,
    formState: { errors: errors6 },
  } = useForm<RegistrationInputs>();

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
    setstatus(2);
    setCredit(0);
    setPoints(0);
    setcountry("");
    setbirthday("");
    destroyCookie(null, "token");
    destroyCookie(null, "username");
    destroyCookie(null, "userEmail");
    destroyCookie(null, "userId");
    destroyCookie(null, "status");
    destroyCookie(null, "credit");
    destroyCookie(null, "points");
    destroyCookie(null, "country");
    destroyCookie(null, "date_of_birth");
    destroyCookie(null, "image");
    router.push("/");
  };

  const getBase64 = (file: any) => {
    return new Promise((resolve) => {
      let baseURL: any = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
        // setFile(baseURL);
        return baseURL;
      };
    });
  };

  async function getGameSingleList() {
    setTab("single-list");
    const res = await request(
      `player/game-one-to-one-list?player_id=${userId}&&page=${page}`,
      token
    );
    setGameSingleList(res?.data);
  }

  async function getGameTournamentList() {
    setTab("tournament-list");
    const res = await request(
      `player/game-tournament-list?player_id=${userId}`,
      token
    );
    setGameTournamentList(res?.data);
  }

  async function getLaunchedGame() {
    setTab("launched");
    const res = await request(
      `player/game-launch-list?player_id=${userId}&&page=${page}`,
      token
    );
    setTotalItems(res?.last_page * res?.data?.length);
    setLaunchedGame(res?.data);
  }
  async function getAvailableGame() {
    setTab("available-game");
    const res = await request(
      `player/published-game-list?player_id=${userId}`,
      token
    );

    // setTotalItems(res?.last_page * res?.data?.length)
    // setLaunchedGame(res?.data);
    setGames(res?.data);
    setActiveGame(res?.data?.length ? res?.data[0] : null);
  }

  async function getRequestList() {
    setTab("request");
    const res = await request(
      `player/game-request-list?player_id=${userId}`,
      token
    );

    setRequestList(res?.data);
  }

  async function getPublishedResult() {
    setTab("published");
    const res = await request(
      `player/result-published?player_id=${userId}`,
      token
    );
    setPublishedResult(res?.data);
  }

  async function getResultDispute() {
    setTab("dispute");
    const res = await request(
      `player/result-dispute?player_id=${userId}`,
      token
    );
    setResultDispute(res?.data[0]?.data);
  }

  async function getSingleResultList() {
    setTab("single-resultList");
    const res = await request(
      `player/game-one-to-one-result-list?player_id=${userId}`,
      token
    );
    setSingleResultList(res?.data);
  }

  async function getTournamentResultList() {
    setTab("tournament-resultList");
    const res = await request(
      `player/game-tournament-result-list?player_id=${userId}`,
      token
    );
    setTournamentResultList(res?.data);
  }

  async function getResultSendList() {
    setTab("resultSendList");
    const res = await request(
      `player/result-send-list?player_id=${userId}`,
      token
    );
    setResultSendList(res?.data);
  }

  useEffect(() => {
    // getLaunchedGame()
    getAvailableGame();
    getProfile();
  }, []);

  useEffect(() => {
    // getLaunchedGame();
    handleClassification();
    handleConsole();

    var date = new Date();
    var date1 = moment(date).format("YYYY-MM-DD");
    setminDate(date1);
  }, []);

  async function handleClassification() {
    const res = await optionsRequest(`player/game-classification`, token);
    setGameClassifications(res?.data);
  }

  async function handleConsole() {
    const res = await optionsRequest(`player/console`, token);
    // console.log("response from console ...", res?.data);
    setGamingConsole(res?.data);
  }

  async function getProfile() {
    const res = await request(`player/profile?player_id=${userId}`, token);
    console.log(".........res", res?.data);
    setprofileImage(res?.data?.image);
    setCookie(null, "image", res?.data?.image, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  async function handleEdit(value: ILaunchedGames) {
    value?.status == "2"
      ? setModal("edit launch")
      : openNotificationWithIcon("Could not Edit!", "error");
    handleClassification();
    setActiveLaunchedGame(value);
  }

  async function handleView(value: ILaunchedGames) {
    setModal("view launch");
    setActiveLaunchedGame(value);
  }

  async function handleDelete(value: ILaunchedGames) {
    setActiveLaunchedGame(value);
    if (value?.status === "1") {
      openNotificationWithIcon("You can't delete this game", "error");
    } else {
      const res = await deleteRequest(`player/game-launch-delete`, token, {
        game_id: value?.gameId,
      });
      if (res?.status === "success") {
        openNotificationWithIcon(res?.message, "success");
        window.location.reload();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    }
  }

  const onEditSubmit: SubmitHandler<IEditGameLaunch> = async (data) => {
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
      round: editRound,
    });
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  const onSendResult: SubmitHandler<ISendResult> = async (data) => {
    console.log("screen shot", data?.screen_short?.length);
    let image = null;
    if (data?.screen_short?.length) {
      image = await getBase64(data?.screen_short[0]);
    }
    const res = await postRequest(`player/result-send`, token, {
      game_id: resultSendGameList?.gameId,
      screen_short: image ? [image] : null,
      published_player_id: userId,
      winner_player_id: data?.winner_player_id
        ? data?.winner_player_id
        : userId,
      amount: resultSendGameList?.amount,
      round: resultSendGameList?.gameRound,
      game_type: resultSendGameList?.gameType,
      result_type: data?.result_type,
    });
    res?.status == "success"
      ? openNotificationWithIcon(res?.message, "success")
      : openNotificationWithIcon(res?.message, "error");
    setModal(null);
  };
  const onSendOpinion: SubmitHandler<ISendOpinion> = async (data) => {
    console.log("image......", data);
    const res = await postRequest(`player/result-opinion`, token, {
      result_id: resultOpinion?.resultId,
      player_id: userId,
      result: data?.result,
      comment: data?.comment,
    });
    res?.status == "success"
      ? openNotificationWithIcon(res?.message, "success")
      : openNotificationWithIcon(res?.message, "error");
    setModal(null);
  };

  const onLaunchSubmit: SubmitHandler<IGameLaunch> = async (data) => {
    let date = new Date(data?.date + " " + data?.time);
    let milliseconds = date.getTime();
    let timeZone = new Date().getTimezoneOffset() * 60 * 1000;
    let utcTimeAndDate = new Date(milliseconds + timeZone);
    let utcDate = moment(utcTimeAndDate).format("YYYY-MM-DD");
    let utcTime = moment(utcTimeAndDate).format("HH:mm");

    if (credit >= data?.amount && status == 1) {
      const res = await postRequest(`player/game-launched`, token, {
        game_classification_id: data?.game_classification_id,
        player_id: userId,
        link: data?.link,
        amount: data?.amount,
        date: data?.date,
        time: data?.time,
        utc_date: utcDate,
        utc_time: utcTime,
        participated_member: gameType == 2 ? data?.participated_member : 2,
        round: round,
        rules: data?.rules,
        game_type: gameType,
        console_id: data?.console_id,
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        window.location.reload();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      openNotificationWithIcon("insufficient Credit and Inactive", "error");
    }
  };

  async function handleAccept(value: IRequestList) {
    const res = await putRequest(`player/game-request-accept`, token, {
      game_id: value?.gameId,
      player_id: userId,
      accept_player_id: value?.playerId,
      amount: value?.gameAmount,
    });
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  }

  async function handleReject(value: IRequestList) {}

  async function handleSendResult(value: any) {
    setResultSendGameList(value);
    setModal("send result");
  }

  async function handleUpdate(value: IResultList) {
    console.log("value...", value);
    setModal("update opinion");
    setResultOpinion(value);
    // const res = await patchRequest(`player/result-opinion-update`, token, {
    //   result_opinion_id: 1,
    //   result: 2,
    //   comment: ""
    // })
  }

  async function handleSendOpinion(value: IResultList) {
    setModal("send opinion");
    console.log(value);
    setResultOpinion(value);
  }

  async function handleViewResult(value: IResultList) {
    setViewResult(value);
    setModal("view result");
  }

  async function handleOpinionDelete(value: any) {
    console.log("vlaue.....", value);
    const res = await deleteRequest(`player/result-opinion-delete`, token, {
      result_opinion_id: value?.resultOpinion?.id,
    });
    res?.status === "success"
      ? openNotificationWithIcon(res?.message, "success")
      : openNotificationWithIcon(res?.message, "error");
    window.location.reload();
  }

  const [winner, setWinner] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await request(`player/profile?player_id=${userId}`, token);

      setPoints(res?.data?.points);
      setCredit(res?.data?.credit);
      sethonesty(res?.data?.honesty);
      setCookie(null, "credit", res?.data?.credit, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "points", res?.data?.points, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
    })();
  }, []);

  function findPower(n: number): number {
    if (n < 2) {
      setIsValid(false);
      return 0;
    }
    if (n == 2) {
      setIsValid(true);
      return 1;
    } else {
      return 1 + findPower(n / 2);
    }
  }

  const handleParticipatedMember = (value: number) => {
    setRound(findPower(value));
  };
  const handleEditParticipatedMember = (value: number) => {
    setEditRound(findPower(value));
  };

  const handleGameStart = async (value: number) => {
    try {
      const res = await putRequest(`player/game-start`, token, {
        game_id: value,
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        getLaunchedGame();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } catch (err: any) {
      openNotificationWithIcon(err?.response?.message, "error");
    }
  };

  const handleGameCancel = async (value: number) => {
    try {
      const res = await putRequest(`player/game-cancel`, token, {
        game_id: value,
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        getLaunchedGame();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } catch (err: any) {
      openNotificationWithIcon(err?.response?.message, "error");
    }
  };

  // paypal payment integration

  function handleMessages(e: any) {
    setprice(e.target.value);
  }

  const initialOptions = {
    "client-id":
      "AVEnGvCBTj0x0mrp1Cy42mJRTy1sLGrPj1wIySCUL_tnqmmNuVAztUp5W0-3wXGMetk2G9tUb2-E7i1C",
    currency: "USD",
    intent: "capture",
    // "data-client-token": token,
  };

  async function handleRequestPaypal(orderDetails: any) {
    console.log("request sending button working...........", orderDetails);
    const res = await postRequest(`player/deposit-store`, token, {
      player_id: userId,
      payment_id: orderDetails?.id,
      payer_id: orderDetails?.payer?.payer_id,
      payer_email: orderDetails?.payer?.email_address,
      amount: orderDetails?.purchase_units[0]?.amount?.value,
      currency: orderDetails?.purchase_units[0]?.amount?.currency_code,
      status: orderDetails?.status,
    });
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      // window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  }

  const paypalScriptOptions: PayPalScriptOptions = {
    "client-id":
      "AVEnGvCBTj0x0mrp1Cy42mJRTy1sLGrPj1wIySCUL_tnqmmNuVAztUp5W0-3wXGMetk2G9tUb2-E7i1C",
    currency: "USD",
  };
  function Button() {
    /**
     * usePayPalScriptReducer use within PayPalScriptProvider
     * isPending: not finished loading(default state)
     * isResolved: successfully loaded
     * isRejected: failed to load
     */
    const [{ isPending }] = usePayPalScriptReducer();
    // const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    //   style: { layout: "vertical", innerHeight: 48, shape: 'rect' },

    //   createOrder(data: any, actions: any) {
    //     return actions.order.create({
    //       purchase_units: [
    //         {
    //           amount: {
    //             value: price
    //           }
    //         }
    //       ]
    //     });
    //   },
    //   onApprove(data: any, actions: any) {
    //     /**
    //      * data: {
    //      *   orderID: string;
    //      *   payerID: string;
    //      *   paymentID: string | null;
    //      *   billingToken: string | null;
    //      *   facilitatorAccesstoken: string;
    //      * }
    //      */
    //     return actions.order.capture({}).then((details: any) => {
    //       alert(
    //         "Transaction completed by" +
    //         (details?.payer.name.given_name ?? "No details")
    //       );

    //       console.log('..........details', details);
    //       setprice('')
    //       handleRequestPaypal(details)

    //     });
    //   }

    // };
    return (
      <>
        {isPending ? <h2>Load Smart Payment Button...</h2> : null}
        {/* <PayPalButtons disabled={price ? false : true} {...paypalbuttonTransactionProps} /> */}
        <PayPalButtons
          disabled={price >= 1000 ? false : true}
          // style: { layout: "vertical", innerHeight: 48, shape: 'rect' }

          createOrder={async (data, actions) => {
            return await actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const order = await actions.order?.capture();
            setprice("");
            alert(`Transaction completed by ${order?.payer.name?.given_name}`);
            // handleApprove(data,orerID)

            // return actions.order.capture().then((details) => {
            //     const name = details.payer.name.given_name;
            //     alert(`Transaction completed by ${name}`);
            // });
            handleRequestPaypal(order);
          }}
          onError={(err: any) => {
            console.log("paypal error", err);
          }}
          onCancel={() => {
            alert(`Your Transaction Cancel`);
          }}
        />
      </>
    );
  }

  // depositList

  async function getDepositList() {
    setTab("depositList");
    const res = await request(`player/deposit-list?player_id=${userId}`, token);

    setdepositList(res?.data.slice(0, 10));
  }

  //withdraw

  const onwithdrawSubmit: SubmitHandler<withDrawCredit> = async (data) => {
    if (credit > data?.amount && data?.amount >= 2000) {
      const res = await postRequest(`player/withdraw-store`, token, {
        player_id: userId,
        credit: data?.amount,
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        window.location.reload();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      openNotificationWithIcon(
        "Insufficient Credit balance and min 2000",
        "error"
      );
    }
  };

  async function getWithdrawList() {
    setTab("withdrawList");
    const res = await request(
      `player/withdraw-list?player_id=${userId}`,
      token
    );

    setwithdrawList(res?.data);
  }

  const [withcreditId, setwithcreditId] = useState<any>();
  const [editcredit, seteditcredit] = useState<any>();
  const [errorCredit, seterrorCredit] = useState("");

  async function handlewithdrawEdit(value: any) {
    value?.status == "2"
      ? setModal("edit withdraw")
      : openNotificationWithIcon("Could not Edit!", "error");

    setwithcreditId(value?.id);
    seteditcredit(value?.credit);
  }

  const onWithdrawEditSubmit = async () => {
    if (editcredit) {
      const res = await putRequest(`player/withdraw-update`, token, {
        id: withcreditId,
        credit: editcredit,
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        // window.location.reload();
        setModal("");
        seterrorCredit("");
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      seterrorCredit("This Field Is Required!");
    }
  };

  const handlewithDrawDelete = async (value: any) => {
    if (value?.status == "2") {
      const res = await deleteRequest(`player/withdraw-delete`, token, {
        id: value?.id,
      });
      console.log("response.........", res);
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        // window.location.reload();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      openNotificationWithIcon("Could not delete", "error");
    }
  };

  // payment list
  const [paymentList, setpaymentList] = useState([]);
  async function getPaymentList() {
    setTab("paymentList");
    const res = await request(`player/payment-list?player_id=${userId}`, token);
    // console.log('.................paymentList',res?.data);

    setpaymentList(res?.data);
  }

  // send review request

  const [rating, setRating] = useState(0);
  const [comment, setcomment] = useState("");
  const sendReview = async () => {
    setTab("review");
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const sendReviewAndComment = async () => {
    const res = await postRequest(`player/review-send`, token, {
      player_id: userId,
      rating: rating,
      comment: comment,
    });
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      window.location.reload();
      setRating(0);
      setcomment("");
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  async function getAffiliateList() {
    setTab("affiliate list");
    const res = await request(
      `player/affiliate-list?player_id=${userId}`,
      token
    );

    setaffiliateList(res?.data.slice(0, 10));
  }

  // const { profile } = router.query

  const linkGenerate = () => {
    setTab("link");
  };

  const originUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const [link, setlink] = useState(false);
  const [createurl, setcreateurl] = useState("");

  const linkUrl = () => {
    setlink(true);
    const slug = nanoid(10);
    const slug1 = nanoid(10);

    const urlLink = `${originUrl}${router.pathname}/${slug}&&plyerId${slug1}${userId}`;
    setcreateurl(urlLink);
  };

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(createurl);
    openNotificationWithIcon("Copied", "success");
  };

  useEffect(() => {
    (async () => {
      const getAllCountry = await axios.get(
        `https://restcountries.com/v3.1/all`
      );
      setAllCountry(getAllCountry?.data);
    })();
  }, []);

  const onEditProfileSubmit: SubmitHandler<RegistrationInputs> = async (
    data
  ) => {
    const data1 = {
      player_id: userId,
      username: data?.username ? data?.username : username,
      email: data?.email ? data?.email : userEmail,
      date_of_birth: data?.dateOfBirth ? data?.dateOfBirth : birthday,
      country: data?.country ? data?.country : country,
      password: data?.password ? data?.password : "",
      image: imageUrl ? [imageUrl] : "",
    };
    console.log(".........data1", data1);

    const res = await putRequest(`player/edit`, token, {
      player_id: userId,
      username: data?.username ? data?.username : username,
      email: data?.email ? data?.email : userEmail,
      date_of_birth: data?.dateOfBirth ? data?.dateOfBirth : birthday,
      country: data?.country ? data?.country : country,
      password: data?.password ? data?.password : "",
      image: imageUrl ? [imageUrl] : "",
    });
    if (res?.status) {
      openNotificationWithIcon(res?.message, "success");
      setToken(res?.data?.access_token);
      setUsername(res?.data?.user?.username);
      setUserEmail(res?.data?.user?.email);
      setUserId(res?.data?.user?.id);
      setPoints(res?.data?.user?.points);
      setCredit(res?.data?.user?.credit);
      setstatus(res?.data?.user?.status);
      setcountry(res?.data?.user?.country);
      // setbirthday(res?.data?.user?.date_of_birth)
      // setCookie(null, "date_of_birth", res?.data?.user?.date_of_birth, {
      //   maxAge: res?.data?.expires_in,
      //   path: "/",
      // });
      setCookie(null, "country", res?.data?.user?.country, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "status", res?.data?.user?.status, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "credit", res?.data?.user?.credit, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "points", res?.data?.user?.points, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "token", res?.data?.access_token, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "username", res?.data?.user?.username, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "userEmail", res?.data?.user?.email, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setCookie(null, "userId", res?.data?.user?.id, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
      setModal("");
      window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  const convertBase64 = (file: any): any => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePicChange = async (data: any) => {
    console.log("data.........", data);
    let file = data[0];
    const base64: any = await convertBase64(file);
    setImageUrl(base64);
  };

  async function handleRequest(gameDetails: ISingleGame) {
    console.log("request sending button working...........", gameDetails);
    const res = await postRequest(`player/game-request-send`, token, {
      game_id: gameDetails?.gameId,
      launch_player_id: gameDetails?.launchGamePlayerId,
      accept_player_id: Number(userId),
      game_type: Number(gameDetails?.game_type),
      status: 2,
    });
    // console.log("response.........", res);
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      window.location.reload();
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profile__container}>
          <div>
            <div className={styles.profile__dashboard}>
              <div style={{ textAlign: "center", padding: "20px 0px" }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                  {profileImage == 0 ? (
                    <Image
                      src={"/assets/images/profile.png"}
                      height={200}
                      width={200}
                      alt="profile"
                    />
                  ) : (
                    <Image
                      src={profileImage}
                      height={200}
                      width={200}
                      alt="profile"
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      bottom: 20,
                      right: 40,
                    }}
                  >
                    <a
                      className={styles.edit__delete__button1}
                      onClick={() => setModal("edit profile")}
                    >
                      <FaEdit color={"#000"} size={20} />
                    </a>
                  </div>
                </div>

                <p style={{ fontSize: "14px", fontWeight: "600" }}>
                  {username}
                </p>
                <p style={{ fontSize: "14px", fontWeight: "600" }}>
                  {userEmail}
                </p>
                <br />
                <div>
                  {points != 0 ? (
                    <button
                      style={{
                        marginTop: "5px",
                        marginRight: "5px",
                        fontSize: "14px",
                        border: "none",
                        padding: "5px 10px",
                        color: "white",
                        backgroundColor: "#F15336",
                        borderRadius: "5px",
                        fontWeight: "600",
                      }}
                    >
                      Points: {points}
                    </button>
                  ) : null}
                  {credit != 0 ? (
                    <button
                      style={{
                        marginTop: "5px",
                        fontSize: "14px",
                        border: "none",
                        padding: "5px 10px",
                        backgroundColor: "#0A1861",
                        color: "white",
                        borderRadius: "5px",
                        fontWeight: "600",
                        marginRight: "5px",
                      }}
                    >
                      Credit: {credit}
                    </button>
                  ) : null}
                  {honesty != "" ? (
                    <button
                      style={{
                        marginTop: "5px",
                        fontSize: "14px",
                        border: "none",
                        padding: "5px 10px",
                        backgroundColor: "brown",
                        color: "white",
                        borderRadius: "5px",
                        fontWeight: "600",
                      }}
                    >
                      Honesty: {honesty}
                    </button>
                  ) : null}
                </div>
              </div>
             
              <div className={styles.diposit}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Deposit
                  </a>
                </div>
                <div className={styles.dipositList}>
                  <div style={{ marginTop: 10 }}>
                  <a
                  className={`${
                    tab === "deposit" ? styles.border__bottom : null
                  }`}
                  onClick={() => setTab("deposit")}
                >
                   Make a Deposit
                </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                  <a
                  className={`${
                    tab === "depositList" ? styles.border__bottom : null
                  }`}
                  onClick={() => getDepositList()}
                >
                  Deposit List
                </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                  <a
                className={`${
                  tab === "paymentList" ? styles.border__bottom : null
                }`}
                onClick={() => getPaymentList()}
              >
                Payment List
              </a>
                  </div>
                </div>
              </div>
              <div className={styles.withdraw}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Withdrawal
                  </a>
                </div>
                <div className={styles.withdrawList}>
                  <div style={{ marginTop: 10 }}>
                  <a
                  className={`${
                    tab === "withdraw" ? styles.border__bottom : null
                  }`}
                  onClick={() => setTab("withdraw")}
                >
                 Request a Withdrawal
                </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                  <a
                  className={`${
                    tab === "withdrawList" ? styles.border__bottom : null
                  }`}
                  onClick={() => getWithdrawList()}
                >
                  Withdraw List
                </a>
                  </div>
                </div>
              </div>
              

              <div className={styles.challenges}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Challenges
                  </a>
                </div>
                <div className={styles.challengesList}>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "launch" ? styles.border__bottom : null
                      }`}
                      onClick={() => setTab("launch")}
                    >
                      Launch New Challenge
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "available-game" ? styles.border__bottom : null
                      }`}
                      onClick={() => setTab("available-game")}
                    >
                      Available Challenges
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "launched" ? styles.border__bottom : null
                      }`}
                      onClick={() => getLaunchedGame()}
                    >
                       My Launched Challenges
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "single-list" ? styles.border__bottom : null
                      }`}
                      onClick={() => getGameSingleList()}
                    >
                      Accepted Challenges
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "request" ? styles.border__bottom : null
                      }`}
                      onClick={() => getRequestList()}
                    >
                      Requested Challenges
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "single-resultList"
                          ? styles.border__bottom
                          : null
                      }`}
                      onClick={() => getSingleResultList()}
                    >
                      Challenges Results
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.tournaments}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Tournaments
                  </a>
                </div>
                <div className={styles.tournamentsList}>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "launch" ? styles.border__bottom : null
                      }`}
                      onClick={() => setTab("launch")}
                    >
                      Launch New Tournament
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "available-game" ? styles.border__bottom : null
                      }`}
                      onClick={() => setTab("available-game")}
                    >
                      Available Tournaments
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "launched" ? styles.border__bottom : null
                      }`}
                      onClick={() => getLaunchedGame()}
                    >
                      My Launched Tournaments
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "tournament-resultList"
                          ? styles.border__bottom
                          : null
                      }`}
                      onClick={() => getTournamentResultList()}
                    >
                      Accepted Tournaments
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "published" ? styles.border__bottom : null
                      }`}
                      onClick={() => getPublishedResult()}
                    >
                      Played Tournaments
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "tournament-list" ? styles.border__bottom : null
                      }`}
                      onClick={() => getGameTournamentList()}
                    >
                      Tournaments List
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "request" ? styles.border__bottom : null
                      }`}
                      onClick={() => getRequestList()}
                    >
                      Requested Tournaments
                    </a>
                  </div>
                </div>
              </div>
             
              <div className={styles.disputes}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Disputes
                  </a>
                </div>
                <div className={styles.disputesList}>
                  <div style={{ marginTop: 10 }}>
                  <a
                className={`${
                  tab === "dispute" ? styles.border__bottom : null
                }`}
                onClick={() => getResultDispute()}
              >
               My Disputes
              </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    
                    <a
                      className={`${
                        tab === "resultSendList" ? styles.border__bottom : null
                      }`}
                      onClick={() => getResultSendList()}
                    >
                      Submit Result
                    </a>
                       </div>
                  
                  
                  
                  
                  
                </div>
              </div>

              
             


              

              
              <div className={styles.affiliate}>
                <div style={{ marginTop: 10 }}>
                  <a
                    className={`${
                      tab === "none" ? styles.border__bottom : null
                    }`}
                  >
                    Affiliate Page
                  </a>
                </div>
                <div className={styles.affiliateList}>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "link" ? styles.border__bottom : null
                      }`}
                      onClick={() => linkGenerate()}
                    >
                      Affiliate Link
                    </a>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <a
                      className={`${
                        tab === "affiliate list" ? styles.border__bottom : null
                      }`}
                      onClick={() => getAffiliateList()}
                    >
                      Affiliate List
                    </a>
                  </div>
                </div>
              </div>
              <a
                className={`${tab === "review" ? styles.border__bottom : null}`}
                onClick={() => sendReview()}
              >
                Drop Review
              </a>
              <a
                className={`${tab === "edit profile" ? styles.border__bottom : null}`}
                onClick={() => {setModal("edit profile"),setTab('edit profile')}}
              >
                Edit Profile
              </a>

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
                    <h6></h6>
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
                            onClick={() => handleView(item)}
                          >
                            <AiFillEye />
                          </a>{" "}
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
                        <div style={{ margin: "auto 0px" }}>
                          {item?.start ? (
                            <a
                              className={styles.edit__delete__button}
                              style={{ marginRight: "5px" }}
                              onClick={() => handleGameStart(item?.gameId)}
                            >
                              Start
                            </a>
                          ) : null}
                          {item?.cancel ? (
                            <a
                              className={styles.edit__delete__button}
                              onClick={() => handleGameCancel(item?.gameId)}
                            >
                              Cancel
                            </a>
                          ) : null}
                        </div>
                      </div>
                      {launchedGame?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Pagination
                    defaultCurrent={1}
                    total={launchedGame?.length}
                    onChange={(page, pageSize) => setPage(page)}
                    pageSize={totalItems}
                  />
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
                        <option value="">
                          Select game classification name
                        </option>
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
                        {...register2("link")}
                      />
                      {/* {errors2.link && errors2.link.type === "required" && (
                        <span>This field is required</span>
                      )} */}
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
                          min={minDate}
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
                          min="1"
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
                          {...register2("game_type", { required: true })}
                          onChange={(e) => setGameType(Number(e.target.value))}
                        >
                          <option value="">Select Game Type</option>
                          <option value={1}>Single</option>
                          <option value={2}>Team</option>
                        </select>
                        {errors2.game_type &&
                          errors2.game_type.type === "required" && (
                            <span>This field is required</span>
                          )}
                      </div>
                      <div>
                        <label className={styles.label}>Gaming Console</label>
                        <select
                          className={styles.input}
                          {...register2("console_id", { required: true })}
                        >
                          <option value="">Select Gaming Console</option>
                          {gamingConsole?.map((item, index) => (
                            <option value={item?.id} key={item?.id}>
                              {item?.name}
                            </option>
                          ))}
                        </select>
                        {errors2.console_id &&
                          errors2.console_id.type === "required" && (
                            <span>This field is required</span>
                          )}
                      </div>
                      <div>
                        <label className={styles.label}>Rules</label>
                        <input
                          className={styles.input}
                          type="text"
                          {...register2("rules")}
                        />
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
                          onChange={(e) =>
                            handleParticipatedMember(Number(e.target.value))
                          }
                        />
                        {!isValid && (
                          <span>Participated Member is not valid</span>
                        )}
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
            ) : tab === "request" ? (
              <div className={styles.launched__container}>
                <h5>Game Request List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.request__list__header}>
                    <h6>Game Name</h6>
                    <h6>Player Name</h6>
                    <h6>Skill</h6>
                    <h6>Honesty</h6>
                    <h6>Player Country</h6>
                    <h6>Amount</h6>
                    <h6>Action</h6>
                  </div>
                  <hr />
                  {requestList?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.request__list__header}>
                        <p>{item?.gameClassificationName}</p>
                        <p>{item?.playerUserName}</p>
                        <p>{item?.skill}</p>
                        <p>{item?.honesty}</p>
                        <p>{item?.playerCountry}</p>
                        <p>{item?.gameAmount}</p>
                        <div style={{ margin: "auto 0px" }}>
                          <a
                            className={styles.accept__button}
                            onClick={() => handleAccept(item)}
                          >
                            Accept
                          </a>{" "}
                          {/* <a
                            className={styles.reject__button}
                            onClick={() => handleReject(item)}
                          >
                            Reject
                          </a> */}
                        </div>
                      </div>
                      {requestList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "single-list" ? (
              <div className={styles.launched__container}>
                <h5>Single Game List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.game__list__header}>
                    <h6>ID</h6>
                    <h6>Game Classification Name</h6>
                    <h6>Game No.</h6>
                    <h6>Game Round</h6>
                    <h6>Game Type</h6>
                    <h6>Amount</h6>
                    <h6></h6>
                  </div>
                  <hr />
                  {gameSingleList?.map((item, index) => (
                    <div key={index}>
                      {item ? (
                        <div className={styles.game__list__header}>
                          <p>{item?.gameId}</p>
                          <p>{item?.gameClassification}</p>
                          <p>{item?.gameNo}</p>
                          <p>{item?.gameRound}</p>
                          <p>{item?.gameType}</p>
                          <p>{item?.amount}</p>
                          <div style={{ margin: "auto 0px" }}>
                            <a
                              className={styles.edit__delete__button}
                              onClick={() => handleSendResult(item)}
                            >
                              Send Result
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "tournament-list" ? (
              <div className={styles.launched__container}>
                <h5>Tournament Game List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.game__list__header}>
                    <h6>ID</h6>
                    <h6>Game Classification Name</h6>
                    <h6>Game No.</h6>
                    <h6>Game Round</h6>
                    <h6>Game Type</h6>
                    <h6>Amount</h6>
                    <h6></h6>
                  </div>
                  <hr />
                  {gameTournamentList?.map((item, index) => (
                    <div key={index}>
                      {item ? (
                        <div className={styles.game__list__header}>
                          <p>{item?.gameId}</p>
                          <p>{item?.gameClassification}</p>
                          <p>{item?.gameNo}</p>
                          <p>{item?.gameRound}</p>
                          <p>{item?.gameType}</p>
                          <p>{item?.amount}</p>
                          <div style={{ margin: "auto 0px" }}>
                            <a
                              className={styles.edit__delete__button}
                              onClick={() => handleSendResult(item)}
                            >
                              Send Result
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "single-resultList" ? (
              <div className={styles.launched__container}>
                <h5>Single Result List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.result__list__header}>
                    <h6>Game Classification Name</h6>
                    <h6>Game Type</h6>
                    <h6>Amount</h6>
                    <h6>Status</h6>
                  </div>
                  <hr />
                  {singleResultList?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.result__list__header}>
                        <p>{item?.classification}</p>
                        <p>{item?.gameType}</p>
                        <p>{item?.amount}</p>
                        <div style={{ margin: "auto 0px" }}>
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handleViewResult(item)}
                          >
                            <AiFillEye />
                          </a>
                          {item?.resultOpinion ? (
                            <>
                              <a
                                className={styles.edit__delete__button}
                                onClick={() => handleUpdate(item)}
                              >
                                <FaEdit />
                              </a>
                              <a
                                className={styles.edit__delete__button}
                                onClick={() =>
                                  handleOpinionDelete(item?.resultOpinion)
                                }
                              >
                                <MdDeleteSweep />
                              </a>
                            </>
                          ) : (
                            <a
                              className={styles.edit__delete__button}
                              onClick={() => handleSendOpinion(item)}
                            >
                              Send Opinion
                            </a>
                          )}
                        </div>
                      </div>
                      {singleResultList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "tournament-resultList" ? (
              <div className={styles.launched__container}>
                <h5>Tournament Result List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.result__list__header}>
                    <h6>Game Classification Name</h6>
                    <h6>Game Type</h6>
                    <h6>Amount</h6>
                    <h6>Status</h6>
                  </div>
                  <hr />
                  {tournamentResultList?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.result__list__header}>
                        <p>{item?.classification}</p>
                        <p>{item?.gameType}</p>
                        <p>{item?.amount}</p>
                        <div style={{ margin: "auto 0px" }}>
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handleViewResult(item)}
                          >
                            <AiFillEye />
                          </a>
                          {item?.resultOpinion ? (
                            <>
                              <a
                                className={styles.edit__delete__button}
                                onClick={() => handleUpdate(item)}
                              >
                                <FaEdit />
                              </a>
                              <a
                                className={styles.edit__delete__button}
                                onClick={() =>
                                  handleOpinionDelete(item?.resultOpinion)
                                }
                              >
                                <MdDeleteSweep />
                              </a>
                            </>
                          ) : (
                            <a
                              className={styles.edit__delete__button}
                              onClick={() => handleSendOpinion(item)}
                            >
                              Send Opinion
                            </a>
                          )}
                        </div>
                      </div>
                      {singleResultList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "resultSendList" ? (
              <div className={styles.launched__container}>
                <h5>Result Send List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.result__send__header}>
                    <h6>Game No.</h6>
                    <h6>Game Classification Name</h6>
                    <h6>Amount</h6>
                    <h6>Winner Player Country</h6>
                    <h6>Winner Player Username</h6>
                  </div>
                  <hr />
                  {resultSendList?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.result__send__header}>
                        <p>{item?.gameNo}</p>
                        <p>{item?.gameClassification}</p>
                        <p>{item?.amount}</p>
                        <p>{item?.winnerPlayerCountry}</p>
                        <p>{item?.winnerPlayerUserName}</p>
                      </div>
                      {resultSendList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "published" ? (
              <div className={styles.launched__container}>
                <h5>Published Result</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.result__publish__header}>
                    <h6>Game No.</h6>
                    <h6>Game Classification Name</h6>
                    <h6>Round</h6>
                    <h6>Amount</h6>
                    <h6>Result</h6>
                    {/* <h6>Winner Player Username</h6> */}
                  </div>
                  <hr />
                  {publishedResult?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.result__publish__header}>
                        <p>{item?.gameNo}</p>
                        <p>{item?.gameClassification}</p>
                        <p>{item?.round}</p>
                        <p>{item?.amount}</p>
                        {item?.resultPublishedStatus == "Loss" ? (
                          <p
                            style={{
                              textAlign: "center",
                              backgroundColor: "red",
                              color: "white",
                            }}
                          >
                            {item?.resultPublishedStatus}
                          </p>
                        ) : (
                          <p
                            style={{
                              textAlign: "center",
                              backgroundColor: "#00FF7F",
                              color: "white",
                            }}
                          >
                            {item?.resultPublishedStatus}
                          </p>
                        )}
                      </div>
                      {publishedResult?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "dispute" ? (
              <div className={styles.launched__container}>
                <h5>Result Dispute</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.result__publish__header}>
                    <h6>Game No.</h6>
                    <h6>Amount</h6>
                    <h6>Points</h6>
                    <h6>Comments</h6>
                    {/* <h6>Winner Player Username</h6> */}
                  </div>
                  <hr />
                  {resultDispute?.map((item, index) => (
                    <div key={index}>
                      <div className={styles.result__publish__header}>
                        <p>{item?.gameNo}</p>
                        <p>{item?.amount}</p>
                        <p>{item?.points}</p>
                        <p>{item?.comments}</p>
                      </div>
                      {resultDispute?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "deposit" ? (
              <div className={styles.launched__container}>
                <h5>Deposit</h5>
                <div className={styles.launched__game__list}>
                  <div
                    style={{
                      marginLeft: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <label className={styles.label}>Amount</label> */}
                    <p>Amount</p>

                    <input
                      value={price}
                      className={styles.input}
                      placeholder="Minimum 1000"
                      type="number"
                      onChange={(e) => handleMessages(e)}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        maxWidth: "200px",
                        height: 35,
                        padding: 5,
                        marginBottom: 10,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 20,
                      width: 100,
                    }}
                  >
                    <PayPalScriptProvider options={paypalScriptOptions}>
                      <Button />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            ) : tab === "depositList" ? (
              <div className={styles.launched__container}>
                <h5>Deposit List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.deposit_list_header}>
                    <h6>Sl</h6>
                    <h6>Payer Email</h6>
                    <h6>Amount</h6>
                    <h6>Created At</h6>
                    <h6>Status</h6>
                    {/* <h6>Winner Player Username</h6> */}
                  </div>
                  <hr />
                  {depositList?.map((item: any, index) => (
                    <div key={index}>
                      <div className={styles.deposit_list_header}>
                        <p>{index + 1}</p>
                        <p>{item?.payerEmail}</p>
                        <p>{item?.amount}</p>
                        <p>{item?.createdAt}</p>
                        <p>{item?.status}</p>
                      </div>
                      {depositList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "withdraw" ? (
              <div className={styles.launch__game__container}>
                <h5 style={{ textAlign: "center", margin: "10px 0px" }}>
                  Withdraw Your Credit
                </h5>
                <div className={styles.edit__form}>
                  <form onSubmit={handleSubmit5(onwithdrawSubmit)}>
                    <div>
                      <label className={styles.label}>Credit</label>
                      <input
                        className={styles.input}
                        type="number"
                        // onChange={(e) => handleMessages(e)}
                        {...register5("amount", { required: true })}
                      />
                      {errors5.amount && errors5.amount.type === "required" && (
                        <span>This field is required</span>
                      )}
                    </div>
                    <div>
                      <input
                        // disabled={credit < withcredit ? true : false }
                        type="submit"
                        value="Confirm"
                        className={styles.button}
                      />
                    </div>
                  </form>
                </div>
              </div>
            ) : tab === "withdrawList" ? (
              <div className={styles.launched__container}>
                <h5>Your Withdraw List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.launched__game__header}>
                    <h6>Sl</h6>
                    <h6>Credit</h6>
                    <h6>Status</h6>
                    <h6>Action</h6>
                  </div>
                  <hr />
                  {withdrawList?.map((item: any, index) => (
                    <div key={index}>
                      <div className={styles.launched__game__header}>
                        <p>{index + 1}</p>
                        <p>{item?.credit}</p>
                        <p>{item?.status == "1" ? "Approved" : "Pending"}</p>
                        <div style={{ margin: "auto 0px" }}>
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handlewithdrawEdit(item)}
                          >
                            <FaEdit />
                          </a>{" "}
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handlewithDrawDelete(item)}
                          >
                            <MdDeleteSweep />
                          </a>
                        </div>
                      </div>
                      {withdrawList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
                {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Pagination defaultCurrent={1} total={launchedGame?.length} onChange={(page, pageSize) => setPage(page)} pageSize={totalItems} />
                </div> */}
              </div>
            ) : tab === "paymentList" ? (
              <div className={styles.launched__container}>
                <h5>Your payment List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.launched__game__header}>
                    <h6>Sl</h6>
                    <h6>Payment Id</h6>
                    <h6>Amount</h6>
                    <h6>currency</h6>
                    <h6>Date</h6>
                  </div>
                  <hr />
                  {paymentList?.map((item: any, index) => (
                    <div key={index}>
                      <div className={styles.launched__game__header}>
                        <p>{index + 1}</p>
                        <p>{item?.paymentId}</p>
                        <p>{item?.amount}</p>
                        <p>{item?.currency}</p>
                        <p>{item?.date}</p>
                      </div>
                      {withdrawList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
                {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Pagination defaultCurrent={1} total={launchedGame?.length} onChange={(page, pageSize) => setPage(page)} pageSize={totalItems} />
                </div> */}
              </div>
            ) : tab === "review" ? (
              <div className={styles.launched__container}>
                <h5>Drop Your Review</h5>
                <div className={styles.review__drop}>
                  <div style={{ padding: "20px" }}>
                    <Rating onClick={handleRating} initialValue={rating} />
                  </div>

                  <div style={{ marginLeft: 20 }}>
                    {/* <label className={styles.label}>Amount</label> */}
                    <p>Comment</p>
                    <div style={{ width: "200px" }}>
                      <input
                        className={styles.input}
                        type="text"
                        value={comment}
                        onChange={(e) => setcomment(e?.target?.value)}
                      />
                    </div>
                  </div>
                  <div
                    style={{ marginTop: 10, margin: 20 }}
                    className={styles.button2}
                  >
                    <a onClick={() => sendReviewAndComment()}>
                      <p>Confirm</p>
                    </a>
                  </div>
                </div>
              </div>
            ) : tab === "link" ? (
              <div className={styles.launched__container}>
                <h5>Link Generate</h5>
                <div className={styles.review__drop1}>
                  <p style={{ margin: 20 }}>Do you want to generate a link?</p>
                  <div style={{ margin: 20 }} className={styles.button3}>
                    <a onClick={() => linkUrl()}>
                      <p>Link Create</p>
                    </a>
                  </div>

                  {link ? (
                    <div>
                      <p style={{ margin: 20 }}>{createurl}</p>

                      <button
                        style={{ margin: 20 }}
                        className={styles.button2}
                        onClick={() => copyToClipBoard()}
                      >
                        Copy
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : tab === "affiliate list" ? (
              <div className={styles.launched__container}>
                <h5>Deposit List</h5>
                <div className={styles.launched__game__list}>
                  <div className={styles.deposit_list_header}>
                    <h6>Sl</h6>
                    <h6>Payer Email</h6>
                    <h6>Name</h6>
                    <h6>Country</h6>
                    <h6>Status</h6>
                    {/* <h6>Winner Player Username</h6> */}
                  </div>
                  <hr />
                  {affiliateList?.map((item: any, index) => (
                    <div key={index}>
                      <div className={styles.deposit_list_header}>
                        <p>{index + 1}</p>
                        <p>{item?.email}</p>
                        <p>{item?.username}</p>
                        <p>{item?.country}</p>
                        <p>{item?.status}</p>
                      </div>
                      {affiliateList?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "available-game" ? (
              <div className={styles.launched__container}>
                <div className={styles.available__games__container}>
                  {games?.map((item, index) => (
                    <div
                      key={index}
                      className={styles.single__games__container}
                      onClick={() => setActiveGame(item)}
                    >
                      {/* <Image
                        src={item?.classificationImage}
                        height={80}
                        width={100}
                        alt="classificationImage"
                      /> */}
                      <h6
                        style={{
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "700",
                          marginTop: "10px",
                        }}
                      >
                        {item?.classificationName}{" "}
                        <span
                          style={{
                            backgroundColor: "white",
                            color: "#F35237",
                            padding: "0px 5px",
                          }}
                        >
                          {item?.games == 0 ? 0 : item?.games?.length}
                        </span>
                      </h6>
                    </div>
                  ))}
                </div>
                <h5>Your Available Game List</h5>
                <div className={styles.available__game__list}>
                  <div className={styles.available__game__header}>
                    <h6>Game Name</h6>
                    <h6>Launch Player</h6>
                    <h6>Start Time</h6>
                    <h6>Round</h6>
                    <h6>Honesty</h6>
                    <h6>Entry Fee</h6>
                    <h6>Action</h6>
                  </div>
                  <hr />
                  {activeGame?.games == 0
                    ? null
                    : activeGame?.games?.map((item, index) => (
                        <div key={index}>
                          <div className={styles.available__game__header}>
                            <p>{activeGame?.classificationName} </p>
                            <p>{item?.launchGamePlayerUserName}</p>
                            <p>
                              {" "}
                              {moment
                                .utc(item?.utcDate + " " + item?.utcTime)
                                .local()
                                .format("YYYY-MM-DD HH:mm")}
                            </p>
                            <p>{item?.game_type == "1" ? "Single" : "Team"}</p>
                            <p>{item?.honesty}</p>
                            <p>{item?.amount} $</p>
                            {/* <div style={{ margin: "auto 0px" }}>
                          <a
                            className={styles.edit__delete__button}
                            onClick={() => handleView(item)}
                          >
                            <AiFillEye />
                          </a>{" "}
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
                        </div> */}
                            {credit >= item?.amount ? (
                              <button
                                className={styles.request__button}
                                onClick={() => handleRequest(item)}
                              >
                                Request for Entry
                              </button>
                            ) : null}
                          </div>
                          {activeGame?.games == 0 ? null : activeGame?.games
                              ?.length -
                              1 ==
                            index ? null : (
                            <hr />
                          )}
                          {/* {activeGame?.games?.length - 1 == index ? null : <hr />} */}
                        </div>
                      ))}
                </div>
                {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Pagination defaultCurrent={1} total={launchedGame?.length} onChange={(page, pageSize) => setPage(page)} pageSize={totalItems} />
                </div> */}
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
                <label className={styles.label}>Gaming Console</label>
                <select className={styles.input} {...register2("console_id")}>
                  <option value="">Select Gaming Console</option>
                  {gamingConsole?.map((item, index) => (
                    <option
                      value={item?.id}
                      key={item?.id}
                      selected={
                        item?.name === activeLaunchedGame?.console
                          ? true
                          : false
                      }
                    >
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>Rules</label>
                <select className={styles.input} {...register2("rules")}>
                  <option value="">Select Rules</option>
                  <option
                    value="no rules"
                    selected={
                      "no rules" === activeLaunchedGame?.rules ? true : false
                    }
                  >
                    No Rules
                  </option>
                  <option
                    value="no special tricks"
                    selected={
                      "no special tricks" === activeLaunchedGame?.rules
                        ? true
                        : false
                    }
                  >
                    No Special Tricks
                  </option>
                  <option
                    value="no skills"
                    selected={
                      "no skills" === activeLaunchedGame?.rules ? true : false
                    }
                  >
                    No Skills
                  </option>
                </select>
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
                  <select className={styles.input} {...register("game_type")}>
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
                  onChange={(e) =>
                    handleEditParticipatedMember(Number(e.target.value))
                  }
                />
                {!isValid && <span>Participated Member is not valid</span>}
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
      ) : modal == "view launch" ? (
        <Modal handleClose={() => setModal("")} title="View Game">
          <div style={{ padding: "10px 10px" }}>
            <p>
              <span style={{ fontWeight: "600" }}>Game Classification: </span>
              {activeLaunchedGame?.classificationName}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Type of Game: </span>
              {activeLaunchedGame?.game_type == "1" ? "Single" : "Team"}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Game Link: </span>
              {activeLaunchedGame?.link}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Date: </span>
              {activeLaunchedGame?.date}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Time: </span>
              {activeLaunchedGame?.time}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Console: </span>
              {activeLaunchedGame?.console}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Rules: </span>
              {activeLaunchedGame?.rules}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Participated Member: </span>
              {activeLaunchedGame?.participatedMember}
            </p>
            <p>
              <span style={{ fontWeight: "600" }}>Status: </span>
              {activeLaunchedGame?.status}
            </p>
          </div>
        </Modal>
      ) : modal == "send result" ? (
        <Modal handleClose={() => setModal("")} title="Send Result">
          <div className={styles.edit__form}>
            <form onSubmit={handleSubmit3(onSendResult)}>
              {/* <p>Round: {resultSendGameList?.gameRound}</p> */}
              <div>
                <label className={styles.label}>Result Type</label>
                <select
                  className={styles.input}
                  {...register3("result_type")}
                  onChange={(e) => setWinner(Number(e.target.value))}
                >
                  <option value={0}>Select Winner</option>
                  <option value={1}>Winner</option>
                  <option value={2}>Draw</option>
                  <option value={4}>No Play</option>
                </select>
              </div>
              {winner == 4 ? null : (
                <div>
                  <label className={styles.label}>Screen Shot</label>
                  <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    {...register3("screen_short")}
                  />
                </div>
              )}
              {winner == 1 ? (
                <div>
                  <label className={styles.label}>Winner</label>
                  <select
                    className={styles.input}
                    {...register3("winner_player_id")}
                  >
                    {resultSendGameList?.player?.map((item) => (
                      <option value={item?.playerId} key={item?.playerId}>
                        {item?.playerUserName}
                      </option>
                    ))}
                  </select>
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
        </Modal>
      ) : modal == "send opinion" ? (
        <Modal handleClose={() => setModal("")} title="Send Opinion">
          <div className={styles.edit__form}>
            <form onSubmit={handleSubmit4(onSendOpinion)}>
              <div>
                <label className={styles.label}>Opinion:</label>
                <select className={styles.input} {...register4("result")}>
                  <option value="">Select your opinion</option>
                  <option value={1}>Agree</option>
                  <option value={2}>Disagree</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Details:</label>
                <textarea
                  className={styles.text_area}
                  {...register4("comment")}
                />
              </div>
              {/* <div>
                <label className={styles.label}>Screen Shot</label>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  {...register3("screen_short")}
                />
              </div> */}
              {/* <div>
                <label className={styles.label}>Winner</label>
                <select
                  className={styles.input}
                  {...register3("winner_player_id")}
                >
                  {resultSendGameList?.player?.map((item) => (
                    <option value={item?.playerId} key={item?.playerId}>
                      {item?.playerUserName}
                    </option>
                  ))}
                </select>
              </div> */}
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
      ) : modal == "view result" ? (
        <Modal handleClose={() => setModal("")} title="Result">
          <div style={{ padding: "10px 15px" }}>
            <p>
              <span>
                <b>Game Classification:</b>
              </span>{" "}
              {viewResult?.classification}
            </p>
            <p>
              <span>
                <b>Game No:</b>
              </span>{" "}
              {viewResult?.gameNo}
            </p>
            <p>
              <span>
                <b>Game Type:</b>
              </span>{" "}
              {viewResult?.gameType}
            </p>
            <p>
              <span>
                <b>Participated Member:</b>
              </span>{" "}
              {viewResult?.participatedMember}
            </p>
            <p>
              <span>
                <b>Result Status:</b>
              </span>{" "}
              {viewResult?.resultStatus}
            </p>
            <p>
              <span>
                <b>Result:</b>
              </span>{" "}
              {viewResult?.resultType}
            </p>
            <p>
              <span>
                <b>Winner:</b>
              </span>{" "}
              {viewResult?.winPlayer}
            </p>
            {viewResult?.screenShort != 0 && (
              <a
                href={`${viewResult?.screenShort}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={`${viewResult?.screenShort}`}
                  height={50}
                  width={50}
                  alt="screenShort"
                />
              </a>
            )}
          </div>
        </Modal>
      ) : modal === "update opinion" ? (
        <Modal handleClose={() => setModal("")} title="Send Opinion">
          <div className={styles.edit__form}>
            <form onSubmit={handleSubmit4(onSendOpinion)}>
              <div>
                <label className={styles.label}>Opinion:</label>
                <select
                  // defaultValue={resultOpinion?.resultOpinion?.result}
                  className={styles.input}
                  {...register4("result")}
                >
                  <option value="">Select your opinion</option>
                  <option value="1">Agree</option>
                  <option value="2">Disagree</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Details:</label>
                <textarea
                  className={styles.text_area}
                  {...register4("comment")}
                />
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
      ) : modal == "edit withdraw" ? (
        <Modal handleClose={() => setModal("")} title="Edit Withdraw Credit">
          <div className={styles.edit__form}>
            {/* <form onSubmit={onWithdrawEditSubmit}> */}
            <div>
              <label className={styles.label}>Amount</label>
              <input
                className={styles.input}
                type="number"
                value={editcredit}
                onChange={(e) => seteditcredit(e?.target?.value)}
              />

              {errorCredit ? (
                <span style={{ color: "red" }}>{errorCredit}</span>
              ) : null}
            </div>
            <div className={styles.button1}>
              <a onClick={() => onWithdrawEditSubmit()}>
                <p>Confirm</p>
              </a>
            </div>
          </div>
        </Modal>
      ) : modal == "edit profile" ? (
        <Modal title={"Edit Profile"} handleClose={() => setModal("")}>
          <div>
            <div>
              <div className={styles.main1}>
                <form onSubmit={handleSubmit6(onEditProfileSubmit)}>
                  {/* register your input into the hook by invoking the "register" function */}
                  <div>
                    <label className={styles.label}>User Name</label>
                    <input
                      className={styles.input}
                      placeholder="Enter User Name"
                      defaultValue={username}
                      {...register6("username", { required: true })}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors6.username &&
                      errors6.username.type === "required" && (
                        <span>Username is required!</span>
                      )}
                    {/* {errors.phone && errors.phone.type === "pattern" && <span>Enter a valid phone number!</span>} */}
                  </div>

                  {/* include validation with required or other standard HTML validation rules */}
                  <div>
                    <label className={styles.label}>Email</label>
                    <input
                      className={styles.input}
                      placeholder="Email"
                      type="email"
                      defaultValue={userEmail}
                      {...register6("email", { required: true })}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors6.email && errors6.email.type === "required" && (
                      <span>Email is required</span>
                    )}
                    {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                  </div>
                  <div>
                    <label className={styles.label}>Change Password</label>
                    <input
                      className={styles.input}
                      placeholder="Password"
                      type="password"
                      {...register6("password", {
                        required: false,
                        minLength: 8,
                      })}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors6.password &&
                      errors6.password.type === "required" && (
                        <span>Password is required</span>
                      )}
                    {errors6.password &&
                      errors6.password.type === "minLength" && (
                        <span>Minimum 8 characters required!</span>
                      )}
                    {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                  </div>
                  <div>
                    <label className={styles.label}>
                      Confirm change Password
                    </label>
                    <input
                      className={styles.input}
                      placeholder="Confirm Password"
                      type="password"
                      {...register6("confirmPassword", {
                        required: false,
                        minLength: 8,
                      })}
                    />
                    {/* errors will return when field validation fails  */}
                    {errors6.confirmPassword &&
                      errors6.confirmPassword.type === "required" && (
                        <span>Confirm Password is required</span>
                      )}
                    {errors6.confirmPassword &&
                      errors6.confirmPassword.type === "minLength" && (
                        <span>Minimum 8 characters required!</span>
                      )}
                    {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                  </div>
                  {/* <div>
                        <label className={styles.label}>Birth Date</label>
                        <input
                          className={styles.input}
                          placeholder="Password"
                          type="date"
                          defaultValue={birthday}
                          {...register6("dateOfBirth", { required: true })}
                        />
                        
                        {errors6.dateOfBirth &&
                          errors6.dateOfBirth.type === "required" && (
                            <span>Date of Birth is required</span>
                          )}
                      </div> */}
                  <div>
                    <label className={styles.label}>Country</label>
                    <select
                      className={styles.input}
                      {...register6("country", { required: true })}
                    >
                      <option value={country}>{country}</option>
                      {allCountry?.map((item, index) => (
                        <option value={item?.name?.common} key={index}>
                          {item?.name?.common?.slice(0, 35)}
                        </option>
                      ))}
                    </select>
                    {/* <input
                          className={styles.input}
                          placeholder="Enter your country"
                          type="text"
                          {...register2("country", { required: true })}
                        /> */}
                    {/* errors will return when field validation fails  */}
                    {errors6.country && errors6.country.type === "required" && (
                      <span>Country is required</span>
                    )}
                    {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                  </div>
                  <div>
                    <label className={styles.label}>
                      Your Profile Image <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={(e) => handlePicChange(e.target.files)}
                    />
                    {imageUrl && (
                      <div>
                        <img
                          src={imageUrl}
                          style={{ height: "140px", width: "120px" }}
                          alt="profile"
                        />
                      </div>
                    )}
                    {/* <Upload onChange={handlePicChange} listType="text" status="success">
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload> */}
                    {/* {errors.image && errors.image.type === 'required' && <span>This image is required</span>} */}
                  </div>

                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <input
                      className={styles.button}
                      type="submit"
                      value="Edit Profile"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
