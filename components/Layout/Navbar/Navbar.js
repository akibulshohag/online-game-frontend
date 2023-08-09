import { FaAngleLeft, FaAngleRight, FaPaperPlane } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStatus } from "../../../context/ContextStatus";
import Modal from "../../Modal/Modal";
// import ContextStatus from '../../../context/ContextStatus.js';
import { notification } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "../../../context/i18next";
import googleTranslateElementInit from "../../../context/text";
import postRequest from "../../../lib/postRequest";
import styles from "./Navbar.module.css";
import ActiveLink from "../../../components/ActiveLink";
// import GoogleTranslate from '../../../context/text';

import Head from "next/head";
import Script from "next/script";

// type countryName = {
//   common: string;
//   official: string;
// };
// type allCountryType = {
//   name: countryName;
//   independent: boolean;
//   status: string;
//   unMember: boolean;
//   region: string;
//   subregion: string;
//   landlocked: boolean;
//   flag: string;
//   population: number;
//   fifa: string;
// };
// type LoginInputs = {
//   email: string;
//   password: string;
// };
// type RegistrationInputs = {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   dateOfBirth: string;
//   country: string;
//   phone: string;
//   term: boolean;
// };

// type ForgotPassword = {
//   email: string;
// };



// type google={
//   google:any
// }

export default function Navbar() {
  const [allCountry, setAllCountry] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [sideClose, setSideClose] = useState(false);

  const { t, i18n } = useTranslation();
  const { isFallback, events } = useRouter();
  const {
    modal,
    setModal,
    token,
    setToken,
    username,
    setUsername,
    userEmail,
    setUserEmail,
    userId,
    setUserId,
    points,
    setPoints,
    credit,
    setCredit,
    status,
    setstatus,
    country,
    setcountry,
    birthday,
    setbirthday,
    selectedLanguage,
    setselectedLanguage,
    setselectedChallenge,
  } = useStatus();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    watch: watch3,
    formState: { errors: errors3 },
  } = useForm();
  // const { loginModal } = useContext(ContextStatus)

  const openNotificationWithIcon = (
    message,
    type,
    err
  ) => {
    if (type == "success" || type == "error" || type == "warning") {
      notification[type]({ message: message });
    }
  };
  const [activeTab, setactiveTab] = useState(0);

  useEffect(() => {
    (async () => {
      const getAllCountry = await axios.get(
        `https://restcountries.com/v3.1/all`
      );
      setAllCountry(getAllCountry?.data);
    })();
  }, []);


  const onLoginSubmit= async (data) => {
    console.log(data);
    const res = await postRequest(`player-login`, null, {
      email: data?.email,
      password: data?.password,
      device_token: "",
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
      setbirthday(res?.data?.user?.date_of_birth);
      setCookie(null, "date_of_birth", res?.data?.user?.date_of_birth, {
        maxAge: res?.data?.expires_in,
        path: "/",
      });
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
      router.push("/user/profile");
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  const onForgotPasswordSubmit = async (
    data
  ) => {
    console.log(data);
    const res = await postRequest(`player-forget-password`, null, {
      email: data?.email,
    });
    console.log("response from login.........", res);
    if (res?.status) {
      openNotificationWithIcon(res?.message, "success");

      setModal("");
    } else {
      openNotificationWithIcon(res?.message, "error");
    }
  };

  const onRegistrationSubmit = async (
    data
  ) => {
     if(data.password == data?.confirmPassword){
      const registrationResponse = await postRequest(
        `player-registration`,
        null,
        {
          fullName:data?.fullName,
          username: data?.username,
          email: data?.email,
          phone: data?.phone,
          date_of_birth: data?.dateOfBirth,
          country: data?.country,
          password: data?.password,
        }
      );
      
      if (registrationResponse?.status == "success") {
        openNotificationWithIcon(registrationResponse?.message, "success");
        setToken(registrationResponse?.response?.access_token);
        setUsername(registrationResponse?.response?.user?.username);
        setUserEmail(registrationResponse?.response?.user?.email);
        setUserId(registrationResponse?.response?.user?.id);
        setcountry(registrationResponse?.response?.user?.country);
        setstatus(registrationResponse?.response?.user?.status);
        setPoints(registrationResponse?.response?.user?.points);
      setCredit(registrationResponse?.response?.user?.credit);
      setCookie(null, "credit",registrationResponse?.response?.user?.credit, {
        maxAge:registrationResponse?.response?.expires_in,
        path: "/",
      });
      setCookie(null, "points",registrationResponse?.response?.user?.points, {
        maxAge:registrationResponse?.response?.expires_in,
        path: "/",
      });
        setCookie(null, "status", registrationResponse?.response?.user?.status, {
          maxAge:registrationResponse?.response?.expires_in,
          path: "/",
        });
        setCookie(null, "country", registrationResponse?.response?.user?.country, {
          maxAge:registrationResponse?.response?.expires_in,
          path: "/",
        });
        setCookie(null, "token", registrationResponse?.response?.access_token, {
          maxAge: registrationResponse?.response?.expires_in,
          path: "/",
        });
        setCookie(
          null,
          "username",
          registrationResponse?.response?.user?.username,
          {
            maxAge: registrationResponse?.response?.expires_in,
            path: "/",
          }
        );
        setCookie(
          null,
          "userEmail",
          registrationResponse?.response?.user?.email,
          {
            maxAge: registrationResponse?.response?.expires_in,
            path: "/",
          }
        );
        setCookie(null, "userId", registrationResponse?.response?.user?.id, {
          maxAge: registrationResponse?.response?.expires_in,
          path: "/",
        });
        setModal("");
        router.push("/user/profile");
      } else {
        openNotificationWithIcon(registrationResponse?.message, "error");
      } 
     }else{
      openNotificationWithIcon("password and confirm password doesn't match", "error");
     }
    
  };

  const clickLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setselectedLanguage(lang);
    setCookie(null, "language", lang, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };

  const redirectChallange = () => {
    router.push("/user/available-games");
    setselectedChallenge("Challenges");
  };
  const redirectTerms = () => {
    router.push("/terms-and-conditions");
    setModal("");
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
    console.log("on");
  };
  const handleClose = () => {
    setSidebar(!sidebar);
  };


  // function googleTranslateElementInit(){

  //  new window.google.translate.TranslateElement({ pageLanguage:'en', includedLanguages: 'en,es,pt',autoDisplay: false,multilanguagePage: true,
  //   layout:window.google.translate.TranslateElement.InlineLayout.SIMPLE
  //  }, 'google_translate_element');

  // }
  useEffect(() => {
   
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  

  return (
    <>
    {/* <Head>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    </Head> */}
      <div className={styles.main}>
      
        <div className={styles.container}>
          <div>
            <Link href="/">
              <a>
                <Image
                  src={`/assets/images/logo.png`}
                  height={60}
                  width={160}
                />
              </a>
            </Link>
          </div>
          <div className={styles.middleContainer}>
            <div className={styles.aboutUs}>
              <p style={{ color: "#fff", cursor: "pointer" }}>{t("aboutus")}</p>
              <div className={styles.aboutUsHover}>
                <Link href="/terms-and-conditions">
                  <p
                    className={styles.termAndCondition}
                    style={{ color: "#fff" }}
                  >
                    Terms And Conditions
                  </p>
                </Link>
                <Link href="/privacy-policy">
                  <p className={styles.privacy} style={{ color: "#fff" }}>
                    Privacy Policy
                  </p>
                </Link>
              </div>
            </div>
            {/* <div className={styles.competition}>
              <p style={{ color: "#fff" }}>Competition</p>
              <div className={styles.aboutUsHover}>
                <a onClick={() => redirectChallange()}>
                  <p
                    className={styles.termAndCondition}
                    style={{ color: "#fff" }}
                  >
                    Challenges
                  </p>
                </a>
                <a onClick={() => redirectTournament()}>
                  <p className={styles.privacy} style={{ color: "#fff" }}>
                    Tournaments
                  </p>
                </a>
              </div>
            </div> */}
            <Link href="/terms-and-conditions">
              <p style={{ color: "#fff", cursor: "pointer" }}>
                Affiliate Program
              </p>
            </Link>
            <div style={{ color: "#fff" }}>
              <a
                onClick={() =>
                  window.open(
                    "mailto:hello@upaesports.com?subject=SendMail&body=Description"
                  )
                }
              >
                Contact
              </a>
            </div>
          </div>
          {token ? null : (
            <a
              className={styles.login__button}
              onClick={() => setModal("login")}
            >
              Login
            </a>
          )}
          {token ? null : (
            <a
              className={styles.login__button}
              onClick={() => setModal("signup")}
            >
              Open An Account
            </a>
          )}
          {sidebar ? (
            <div
              className={`${
                sideClose === true
                  ? styles.side__mobile
                  : styles.mobile__sidebar
              }`}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "15px",
                  paddingBottom: "30px",
                }}
              >
                <div onClick={handleClose}>
                  <p style={{ color: "#fff" }}>Close</p>
                </div>
              </div>
              {token ? (
                <Link href={`/user/profile`}>
                  <a>
                    <span style={{ color: "#fff" }}>Profile</span>
                  </a>
                </Link>
              ) : null}
              <a>
                <span style={{ color: "#fff" }}>About Us</span>
              </a>

              <Link href="/terms-and-conditions">
                <a>
                  <span style={{ color: "#f35237", marginLeft: 15 }}>
                    Terms and Conditions
                  </span>
                </a>
              </Link>
              <Link href="/privacy-policy">
                <a>
                  <span style={{ color: "#f35237", marginLeft: 15 }}>
                    Privacy Policy
                  </span>
                </a>
              </Link>
              <Link href="/terms-and-conditions">
                <a>
                  <span style={{ color: "#fff" }}>Affiliate Program</span>
                </a>
              </Link>

              {/* <a
                onClick={() =>
                  window.open(
                    "mailto:hello@upaesports.com?subject=SendMail&body=Description"
                  )
                }
              >
                <span style={{ color: "#fff" }}>Contact</span>
              </a> */}
              {token ? null : (
                <div>
                  <a onClick={() => setModal("login")}>
                    <span style={{ color: "#fff" }}>Login</span>
                  </a>
                  <a onClick={() => setModal("signup")}>
                    <span style={{ color: "#fff" }}>Create an account</span>
                  </a>
                </div>
              )}
            </div>
          ) : null}
          <div id="google_translate_element"></div>
          <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
          
            
          <div className={styles.hamburg} onClick={handleSidebar}>
            <svg
              style={{ fill: "#fff" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
          </div>
          {token ? (
            <div className={styles.dropdown}>
              <Link href={`/user/profile`}>
                <a className={styles.user__button}>
                  <Image
                    src="/assets/images/profile.png"
                    height={35}
                    width={35}
                  />
                  <span className={styles.profile__tooltip}>Profile</span>
                  {/* <CgProfile size={35} /> */}
                </a>
              </Link>
            </div>
          ) : null}
        </div>
        {modal == "login" ? (
          <Modal title={"Login"} handleClose={() => setModal("")}>
            <div>
              {activeTab == 0 ? (
                <>
                  <div className={styles.header}>
                    <div className={styles.border}></div>
                    <p>Choose How you want to login</p>
                    <div className={styles.border}></div>
                  </div>
                  <div className={styles.container__google}>
                    <div className={styles.google__box1}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/google.jpg`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Google</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div className={styles.google__box1}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/facebook.png`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Facebook</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div
                      onClick={() => setactiveTab(1)}
                      className={styles.google__box}
                    >
                      <div className={styles.image__border}>
                        <FaPaperPlane />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Email</p>
                        <FaAngleRight />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {activeTab == 1 ? (
                <div>
                  <div
                    onClick={() => setactiveTab(0)}
                    className={styles.input__header}
                  >
                    <FaAngleLeft />
                    <p style={{ marginLeft: 5 }}>Back To All options</p>
                  </div>
                  <div>
                    <div className={styles.main1}>
                      <form onSubmit={handleSubmit(onLoginSubmit)}>
                        {/* register your input into the hook by invoking the "register" function */}
                        <div>
                          <label className={styles.label}>Email</label>
                          <input
                            className={styles.input}
                            placeholder="Enter Email"
                            type="text"
                            {...register("email", { required: true })}
                          />
                          {/* <input {...register("emailRequired", { required: true })} /> */}
                          {errors.email && errors.email.type === "required" && (
                            <span>This field is required</span>
                          )}
                          {/* errors will return when field validation fails  */}
                          {/* {errors.email && errors.email.type === "required" && <span>Email is required!</span>} */}
                          {/* {errors.phone && errors.phone.type === "pattern" && <span>Enter a valid phone number!</span>} */}
                        </div>

                        {/* include validation with required or other standard HTML validation rules */}
                        <div>
                          <label className={styles.label}>Password</label>
                          <input
                            className={styles.input}
                            placeholder="Password"
                            type="password"
                            {...register("password", {
                              required: true,
                              minLength: 8,
                            })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors.password &&
                            errors.password.type === "required" && (
                              <span>Password is required</span>
                            )}
                          {errors.password &&
                            errors.password.type === "minLength" && (
                              <span>Minimum 8 characters required!</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div
                          onClick={() => setModal("resetPassword")}
                          className={styles.password}
                        >
                          <p>Forgot your password</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <input
                            className={styles.button}
                            type="submit"
                            value="Login"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={styles.footer}>
                <p>
                  Don&apos;t have an account?{" "}
                  <span onClick={() => setModal("signup")}>Create Account</span>
                </p>
              </div>
            </div>
          </Modal>
        ) : modal == "signup" ? (
          <Modal title={"Sign up"} handleClose={() => setModal("")}>
            <div>
              {activeTab == 0 ? (
                <>
                  <div className={styles.header}>
                    <div className={styles.border}></div>
                    <p>Choose How you want to login</p>
                    <div className={styles.border}></div>
                  </div>
                  <div className={styles.container__google}>
                    <div className={styles.google__box1}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/google.jpg`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Sign Up With Google</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div className={styles.google__box1}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/facebook.png`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Sign Up With Facebook</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div
                      onClick={() => setactiveTab(1)}
                      className={styles.google__box}
                    >
                      <div className={styles.image__border}>
                        <FaPaperPlane />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Sign Up With Email</p>
                        <FaAngleRight />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {activeTab == 1 ? (
                <div>
                  <div
                    onClick={() => setactiveTab(0)}
                    className={styles.input__header}
                  >
                    <FaAngleLeft />
                    <p style={{ marginLeft: 5 }}>Back To All options</p>
                  </div>
                  <div>
                    <div className={styles.main1}>
                      <form onSubmit={handleSubmit2(onRegistrationSubmit)}>
                        {/* register your input into the hook by invoking the "register" function */}
                        <div>
                          <label className={styles.label}>Full Name</label>
                          <input
                            className={styles.input}
                            placeholder="Full Name"
                            {...register2("fullName", { required: true })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.fullName &&
                            errors2.fullName.type === "required" && (
                              <span>fullName is required!</span>
                            )}
                          {/* {errors.phone && errors.phone.type === "pattern" && <span>Enter a valid phone number!</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>User Name</label>
                          <input
                            className={styles.input}
                            placeholder="e.g. PSN ID, Xbox Gamertag,etc."
                            {...register2("username", { required: true })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.username &&
                            errors2.username.type === "required" && (
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
                            {...register2("email", { required: true })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.email &&
                            errors2.email.type === "required" && (
                              <span>Email is required</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>Phone No</label>
                          <input
                            className={styles.input}
                            placeholder="Enter Your Phone No"
                            type="text"
                            {...register2("phone", { required: true })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.phone &&
                            errors2.phone.type === "required" && (
                              <span>Phone no is required</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>Password</label>
                          <input
                            className={styles.input}
                            placeholder="Password"
                            type="password"
                            {...register2("password", {
                              required: true,
                              minLength: 8,
                            })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.password &&
                            errors2.password.type === "required" && (
                              <span>Password is required</span>
                            )}
                          {errors2.password &&
                            errors2.password.type === "minLength" && (
                              <span>Minimum 8 characters required!</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>
                            Confirm Password
                          </label>
                          <input
                            className={styles.input}
                            placeholder="Confirm Password"
                            type="password"
                            {...register2("confirmPassword", {
                              required: true,
                              minLength: 8,
                            })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.confirmPassword &&
                            errors2.confirmPassword.type === "required" && (
                              <span>Confirm Password is required</span>
                            )}
                          {errors2.confirmPassword &&
                            errors2.confirmPassword.type === "minLength" && (
                              <span>Minimum 8 characters required!</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>Birth Date</label>
                          <input
                            className={styles.input}
                            placeholder="Password"
                            type="date"
                            {...register2("dateOfBirth", { required: true })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors2.dateOfBirth &&
                            errors2.dateOfBirth.type === "required" && (
                              <span>Date of Birth is required</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div>
                          <label className={styles.label}>Country</label>
                          <select
                            className={styles.input}
                            {...register2("country", { required: true })}
                          >
                            {allCountry?.map((item, index) => (
                              <option value={item?.name?.common} key={index}>
                                {item?.name?.common?.slice(0, 35)}
                              </option>
                            ))}
                          </select>

                          {errors2.country &&
                            errors2.country.type === "required" && (
                              <span>Country is required</span>
                            )}
                          {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                        </div>
                        <div style={{ marginLeft: 0 }}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              style={{ width: "20px" }}
                              placeholder="Note"
                              type="checkbox"
                              {...register2("term", { required: true })}
                            />
                            <p
                              style={{ fontSize: 13 }}
                              className="ml-5 text-[12px] underline decoration-dashed cursor-pointer hover:text-green-600"
                            >
                              Yes, I agree to <span onClick={redirectTerms} style={{color:'#F88921',cursor:'pointer',textDecoration:'underline'}}>Terms & Conditions</span>
                            </p>
                          </div>
                          {errors2.term && errors2.term.type === "required" && (
                            <span className="text-red-500 text-[12px]">
                              Please Accept the terms & condition
                            </span>
                          )}
                        </div>
                        {/* <div className={styles.password}>
                        <p>Forgot your password</p>
                      </div> */}
                        <div style={{ textAlign: "center" }}>
                          <input
                            className={styles.button}
                            type="submit"
                            value="Signup"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={styles.footer}>
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setModal("login")}>Login</span>
                </p>
              </div>
            </div>
          </Modal>
        ) : modal == "resetPassword" ? (
          <Modal title={"Reset Your Password"} handleClose={() => setModal("")}>
            <div>
              {activeTab == 0 ? (
                <>
                  <div className={styles.header}>
                    <div className={styles.border}></div>
                    <p>Choose How you want to login</p>
                    <div className={styles.border}></div>
                  </div>
                  <div className={styles.container__google}>
                    <div className={styles.google__box}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/google.jpg`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Google</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div className={styles.google__box}>
                      <div className={styles.image__border}>
                        <Image
                          src={`/assets/images/icons/facebook.png`}
                          alt="Google Image"
                          height={30}
                          width={30}
                        />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Facebook</p>
                        <FaAngleRight />
                      </div>
                    </div>
                    <div
                      onClick={() => setactiveTab(1)}
                      className={styles.google__box}
                    >
                      <div className={styles.image__border}>
                        <FaPaperPlane />
                      </div>
                      <div className={styles.arrow}>
                        <p style={{ marginLeft: 10 }}>Login With Email</p>
                        <FaAngleRight />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {activeTab == 1 ? (
                <div>
                  <div
                    onClick={() => setactiveTab(0)}
                    className={styles.input__header}
                  >
                    <FaAngleLeft />
                    <p style={{ marginLeft: 5 }}>Back To All options</p>
                  </div>
                  <div>
                    <div className={styles.main1}>
                      <form onSubmit={handleSubmit3(onForgotPasswordSubmit)}>
                        {/* register your input into the hook by invoking the "register" function */}
                        <div>
                          <label className={styles.label}>Email</label>
                          <input
                            className={styles.input}
                            placeholder="Enter Email"
                            type="text"
                            {...register3("email", { required: true })}
                          />
                          {/* <input {...register("emailRequired", { required: true })} /> */}
                          {errors3.email &&
                            errors3.email.type === "required" && (
                              <span>This field is required</span>
                            )}
                          {/* errors will return when field validation fails  */}
                          {/* {errors.email && errors.email.type === "required" && <span>Email is required!</span>} */}
                          {/* {errors.phone && errors.phone.type === "pattern" && <span>Enter a valid phone number!</span>} */}
                        </div>

                        <div style={{ textAlign: "center" }}>
                          <input
                            className={styles.button}
                            type="submit"
                            value="Submit"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={styles.footer}>
                <p>
                  Back To ? <span onClick={() => setModal("login")}>Login</span>
                </p>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </>
  );
}
// function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
//   throw new Error("Function not implemented.");
// }
