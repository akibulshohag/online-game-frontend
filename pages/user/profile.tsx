// import { PayPalButtons,PayPalScriptProvider } from "@paypal/react-paypal-js";
import { notification, Pagination } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { Rating } from 'react-simple-star-rating';
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
  PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer
} from "@paypal/react-paypal-js";
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
  localDate: string
  plusdate: string
}

interface IRequestList {
  gameClassificationName: string;
  gameId: number;
  gameNo: string;
  playerId: number;
  playerUserName: string;
  playerCountry: string;
  gameAmount: number;
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
  winPlayer: string
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
  player_id: number,
  credit: number,

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
    sethonesty
  } = useStatus();

  const [tab, setTab] = useState("launched");
  const [gameType, setGameType] = useState(1);
  const [launchedGame, setLaunchedGame] = useState<ILaunchedGames[] | []>();
  const [activeLaunchedGame, setActiveLaunchedGame] =
    useState<ILaunchedGames>();
  const [gameClassifications, setGameClassifications] =
    useState<IGameClassifications[]>();
  const [requestList, setRequestList] = useState<IRequestList[]>();
  const [gameSingleList, setGameSingleList] = useState<IGameList[] | []>();
  const [gameTournamentList, setGameTournamentList] = useState<IGameList[] | []>();
  const [singleResultList, setSingleResultList] = useState<IResultList[] | []>([]);
  const [tournamentResultList, setTournamentResultList] = useState<IResultList[] | []>();
  const [resultSendList, setResultSendList] = useState<IResultSendList[] | []>();
  const [resultSendGameList, setResultSendGameList] = useState<IResultSendGameList>();
  const [resultOpinion, setResultOpinion] = useState<IResultList>();
  const [viewResult, setViewResult] = useState<IResultList>();
  const [publishedResult, setPublishedResult] = useState<IPublishedResult[]>();
  const [gamingConsole, setGamingConsole] = useState<IGamingConsole[]>();
  const [resultDispute, setResultDispute] = useState<IResultDispute[]>();
  const [isValid, setIsValid] = useState(true);
  const [round, setRound] = useState(1);
  const [editRound, setEditRound] = useState(1);
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(1)
  const [price, setprice] = useState('')
  const [depositList, setdepositList] = useState([])
  const [withdrawList, setwithdrawList] = useState([])
  const [minDate, setminDate] = useState('')

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
    const res = await request(`player/game-one-to-one-list?player_id=${userId}&&page=${page}`, token);
    setGameSingleList(res?.data);
  }

  async function getGameTournamentList() {
    setTab("tournament-list");
    const res = await request(`player/game-tournament-list?player_id=${userId}`, token);
    setGameTournamentList(res?.data);
  }

  async function getLaunchedGame() {
    setTab("launched");
    const res = await request(
      `player/game-launch-list?player_id=${userId}&&page=${page}`,
      token
    );
    setTotalItems(res?.last_page * res?.data?.length)
    setLaunchedGame(res?.data);
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
    const res = await request(`player/game-one-to-one-result-list?player_id=${userId}`, token);
    setSingleResultList(res?.data);
  }

  async function getTournamentResultList() {
    setTab("tournament-resultList");
    const res = await request(`player/game-tournament-result-list?player_id=${userId}`, token);
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
    getLaunchedGame()
  }, [page])

  useEffect(() => {
    getLaunchedGame();
    handleClassification();
    handleConsole();

    var date = new Date();
    var date1 = moment(date).format("YYYY-MM-DD")
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
  

    let date         = new Date(data?.date + ' ' + data?.time);
    let milliseconds = date.getTime();
    let timeZone     = new Date().getTimezoneOffset() * 60 * 1000;
    let utcTimeAndDate = new Date(milliseconds + timeZone)
    let utcDate = moment(utcTimeAndDate).format('YYYY-MM-DD')
    let utcTime = moment(utcTimeAndDate).format('HH:mm')

    if (credit >= data?.amount) {
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
      openNotificationWithIcon('insufficient Credit', "error");

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

  async function handleReject(value: IRequestList) {
  }

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
        game_id: value
      })
      if (res?.status == 'success') {
        openNotificationWithIcon(res?.message, 'success');
        getLaunchedGame()
      } else {
        openNotificationWithIcon(res?.message, 'error')
      }
    } catch (err: any) {
      openNotificationWithIcon(err?.response?.message, "error")
    }
  }

  const handleGameCancel = async (value: number) => {
    try {
      const res = await putRequest(`player/game-cancel`, token, {
        game_id: value
      })
      if (res?.status == 'success') {
        openNotificationWithIcon(res?.message, 'success');
        getLaunchedGame()
      } else {
        openNotificationWithIcon(res?.message, 'error')
      }
    } catch (err: any) {
      openNotificationWithIcon(err?.response?.message, "error")
    }
  }


  // paypal payment integration 



  function handleMessages(e: any) {
    setprice(e.target.value)
  }



  const initialOptions = {
    "client-id": "AVEnGvCBTj0x0mrp1Cy42mJRTy1sLGrPj1wIySCUL_tnqmmNuVAztUp5W0-3wXGMetk2G9tUb2-E7i1C",
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
      status: orderDetails?.status

    });
    console.log("response.........", res);
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
    currency: "USD"
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
          disabled={price ? false : true}
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
            console.log('...........order', order);
            setprice('')
            alert(
              `Transaction completed by ${order?.payer.name?.given_name}`
            );
            // handleApprove(data,orerID)

            // return actions.order.capture().then((details) => {
            //     const name = details.payer.name.given_name;
            //     alert(`Transaction completed by ${name}`);
            // });
            handleRequestPaypal(order)


          }}

          onError={(err: any) => {
            console.log('paypal error', err);

          }}

          onCancel={() => {
            alert(
              `Your Transaction Cancel`
            );

          }}

        />
      </>
    );
  }

  // depositList 

  async function getDepositList() {
    setTab("depositList");
    const res = await request(
      `player/deposit-list?player_id=${userId}`,
      token
    );
    setdepositList(res?.data.slice(0, 10));
  }




  //withdraw

  const onwithdrawSubmit: SubmitHandler<withDrawCredit> = async (data) => {
    console.log('...........data', data?.amount);

    if (credit > data?.amount) {
      const res = await postRequest(`player/withdraw-store`, token, {
        player_id: userId,
        credit: data?.amount
      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        window.location.reload();
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      openNotificationWithIcon('Insufficient Credit balance', "error");
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

  const [withcreditId, setwithcreditId] = useState<any>()
  const [editcredit, seteditcredit] = useState<any>()
  const [errorCredit, seterrorCredit] = useState('')

  async function handlewithdrawEdit(value: any) {
    value?.status == "2"
      ? setModal("edit withdraw")
      : openNotificationWithIcon("Could not Edit!", "error");

    setwithcreditId(value?.id);
    seteditcredit(value?.credit)
  }

  const onWithdrawEditSubmit = async () => {
    if (editcredit) {
      const res = await putRequest(`player/withdraw-update`, token, {
        id: withcreditId,
        credit: editcredit

      });
      if (res?.status == "success") {
        openNotificationWithIcon(res?.message, "success");
        // window.location.reload();
        setModal('')
        seterrorCredit('')
      } else {
        openNotificationWithIcon(res?.message, "error");
      }
    } else {
      seterrorCredit('This Field Is Required!')
    }

  }

  const handlewithDrawDelete = async (value: any) => {
    console.log('..........value', value?.id);

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
      openNotificationWithIcon('Could not delete', "error");
    }


  }

  // payment list 
  const [paymentList, setpaymentList] = useState([])
  async function getPaymentList() {
    setTab("paymentList");
    const res = await request(
      `player/payment-list?player_id=${userId}`,
      token
    );
    // console.log('.................paymentList',res?.data);

    setpaymentList(res?.data);
  }


  // send review request

  const [rating, setRating] = useState(0)
  const [comment, setcomment] = useState('')
  const sendReview = async () => {
    setTab("review")
  }

  const handleRating = (rate: number) => {
    setRating(rate)
  }

  const sendReviewAndComment = async () => {

    const res = await postRequest(`player/review-send`, token, {
      player_id: userId,
      rating: rating,
      comment: comment
    });
    if (res?.status == "success") {
      openNotificationWithIcon(res?.message, "success");
      window.location.reload();
      setRating(0)
      setcomment('')

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
                <Image
                  src="/assets/images/profile.png"
                  height={200}
                  width={200}
                />
                <p style={{ fontSize: "14px", fontWeight: "600", }}>{username}</p>
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
                  {honesty != '' ? (
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
              <Link href={"/user/available-games"}>
                <a>Available Games</a>
              </Link>
              <a
                className={`${tab === "launch" ? styles.border__bottom : null}`}
                onClick={() => setTab("launch")}
              >
                Launch Game
              </a>
              <a
                className={`${tab === "launched" ? styles.border__bottom : null
                  }`}
                onClick={() => getLaunchedGame()}
              >
                Launched List
              </a>
              <a
                className={`${tab === "request" ? styles.border__bottom : null
                  }`}
                onClick={() => getRequestList()}
              >
                Request List
              </a>
              <a
                className={`${tab === "single-list" ? styles.border__bottom : null}`}
                onClick={() => getGameSingleList()}
              >
                Single Game List
              </a>
              <a
                className={`${tab === "tournament-list" ? styles.border__bottom : null}`}
                onClick={() => getGameTournamentList()}
              >
                Tournament Game List
              </a>
              <a
                className={`${tab === "resultSendList" ? styles.border__bottom : null
                  }`}
                onClick={() => getResultSendList()}
              >
                Result Send List
              </a>



              <a
                className={`${tab === "single-resultList" ? styles.border__bottom : null
                  }`}
                onClick={() => getSingleResultList()}
              >
                Single Result List
              </a>
              <a
                className={`${tab === "tournament-resultList" ? styles.border__bottom : null
                  }`}
                onClick={() => getTournamentResultList()}
              >
                Tournament Result List
              </a>
              <a
                className={`${tab === "dispute" ? styles.border__bottom : null
                  }`}
                onClick={() => getResultDispute()}
              >
                Result Dispute
              </a>
              <a
                className={`${tab === "published" ? styles.border__bottom : null
                  }`}
                onClick={() => getPublishedResult()}
              >
                Published Result
              </a>
              <a
                className={`${tab === "deposit" ? styles.border__bottom : null
                  }`}
                onClick={() => setTab('deposit')}
              >
                Deposit
              </a>
              <a
                className={`${tab === "depositList" ? styles.border__bottom : null
                  }`}
                onClick={() => getDepositList()}
              >
                Deposit List
              </a>
              <a
                className={`${tab === "withdraw" ? styles.border__bottom : null
                  }`}
                onClick={() => setTab('withdraw')}
              >
                Withdraw Credit
              </a>
              <a
                className={`${tab === "withdrawList" ? styles.border__bottom : null
                  }`}
                onClick={() => getWithdrawList()}
              >
                Withdraw List
              </a>
              <a
                className={`${tab === "paymentList" ? styles.border__bottom : null
                  }`}
                onClick={() => getPaymentList()}
              >
                payment List
              </a>
              <a
                className={`${tab === "review" ? styles.border__bottom : null
                  }`}
                onClick={() => sendReview()}
              >
                Drop Review
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
                        <div style={{ margin: 'auto 0px' }}>
                          {item?.start ? <a className={styles.edit__delete__button} style={{ marginRight: '5px' }} onClick={() => handleGameStart(item?.gameId)}>Start</a> : null}
                          {item?.cancel ? <a className={styles.edit__delete__button} onClick={() => handleGameCancel(item?.gameId)}>Cancel</a> : null}
                        </div>
                      </div>
                      {launchedGame?.length - 1 == index ? null : <hr />}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Pagination defaultCurrent={1} total={launchedGame?.length} onChange={(page, pageSize) => setPage(page)} pageSize={totalItems} />
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
                    <h6>Game Classification Name</h6>
                    <h6>Player Name</h6>
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

                  <div style={{ marginLeft: 20, alignItems: 'center', justifyContent: 'center' }}>
                    {/* <label className={styles.label}>Amount</label> */}
                    <p>Amount</p>

                    <input
                      value={price}
                      className={styles.input}
                      placeholder="USD"
                      type="number"

                      onChange={(e) => handleMessages(e)}
                      style={{ width: '100%', borderRadius: 10, maxWidth: '200px', height: 35, padding: 5, marginBottom: 10 }}
                    />
                  </div>


                  <div style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, width: 100 }}>
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
                      {errors5.amount &&
                        errors5.amount.type === "required" && (
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
                  <div style={{ padding: '20px' }}>
                    <Rating onClick={handleRating} initialValue={rating} />
                  </div>

                  <div style={{ marginLeft: 20,}}>
                    {/* <label className={styles.label}>Amount</label> */}
                    <p>Comment</p>
                    <div style={{ width: '200px' }}>
                      <input
                        className={styles.input}
                        type="text"
                        value={comment}
                        onChange={(e) => setcomment(e?.target?.value)}

                      />
                    </div>
                    
                  </div>
                  <div style={{marginTop:10,margin:20}} className={styles.button2}>
                      <a onClick={() => sendReviewAndComment()}>
                        <p>Confirm</p>
                      </a>

                    </div>

                </div>

              </div>
            ) :

              null}
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
            {viewResult?.screenShort != 0 && <a
              href={`${viewResult?.screenShort}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`${viewResult?.screenShort}`}
                height={50}
                width={50}
              />
            </a>}
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

              {errorCredit ?
                <span style={{ color: 'red' }}>{errorCredit}</span>
                : null
              }
            </div>
            <div className={styles.button1}>
              <a onClick={() => onWithdrawEditSubmit()}>
                <p>Confirm</p>
              </a>

            </div>

          </div>
        </Modal>
      ) :

        null}
    </div>
  );
}
