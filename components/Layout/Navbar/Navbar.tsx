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
import { useTranslation } from 'react-i18next';
import '../../../context/i18next';
import postRequest from "../../../lib/postRequest";
import styles from "./Navbar.module.css";

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
type LoginInputs = {
  email: string;
  password: string;
};
type RegistrationInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  country: string;
  phone:string
};

type ForgotPassword={
  email:string;
}

export default function Navbar() {
  const [allCountry, setAllCountry] = useState<allCountryType[]>([]);
  const { t, i18n } = useTranslation();
  const { isFallback, events } = useRouter()
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
    setselectedLanguage
  } = useStatus();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInputs>();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    formState: { errors: errors2 },
  } = useForm<RegistrationInputs>();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    watch: watch3,
    formState: { errors: errors3 },
  } = useForm<ForgotPassword>();
  // const { loginModal } = useContext(ContextStatus)

  const openNotificationWithIcon = (
    message: string,
    type: string,
    err?: string
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

  // console.log("all country.........", allCountry);

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log(data);
    const res = await postRequest(`player-login`, null, {
      email: data?.email,
      password: data?.password,
      device_token: "",
    });
    console.log("response from login.........", res);
    if (res?.status) {
      openNotificationWithIcon(res?.message, "success");
      setToken(res?.data?.access_token);
      setUsername(res?.data?.user?.username);
      setUserEmail(res?.data?.user?.email);
      setUserId(res?.data?.user?.id);
      setPoints(res?.data?.user?.points);
      setCredit(res?.data?.user?.credit);
      setstatus(res?.data?.user?.status);
      setcountry(res?.data?.user?.country)
      setbirthday(res?.data?.user?.date_of_birth)
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


  const onForgotPasswordSubmit: SubmitHandler<ForgotPassword> = async (data) => {
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


  const onRegistrationSubmit: SubmitHandler<RegistrationInputs> = async (
    data
  ) => {
    console.log(data);
    const registrationResponse = await postRequest(
      `player-registration`,
      null,
      {
        username: data?.username,
        email: data?.email,
        phone:data?.phone,
        date_of_birth: data?.dateOfBirth,
        country: data?.country,
        password: data?.password,
      }
    );
    // console.log("response from registration.........", registrationResponse);
    if (registrationResponse?.status == "success") {
      openNotificationWithIcon(registrationResponse?.message, "success");
      setToken(registrationResponse?.response?.access_token);
      setUsername(registrationResponse?.response?.user?.username);
      setUserEmail(registrationResponse?.response?.user?.email);
      setUserId(registrationResponse?.response?.user?.id);
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
  };

const clickLanguage =(lang:string)=>{
  i18n.changeLanguage(lang);
  setselectedLanguage(lang)
  setCookie(null, "language", lang, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

// useEffect(() => {
//   function googleTranslateElementInit() {
//     if (!window['google']) {
//         console.log('script added');
//         var script = document.createElement('SCRIPT');
//         script.setAttribute(
//               "src",
//               "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//             );
//         document.getElementsByTagName('HEAD')[0].appendChild(script);
//     }
  
    
//         console.log('translation loaded');
//         new window.google.translate.TranslateElement(
//             {
//                 pageLanguage: 'tr',
//                 includedLanguages: 'ar,en,es,jv,ko,pt,ru,zh-CN,tr',
//                 layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
//                 //autoDisplay: false,
//             },
//             'google_translate_element'
//         );
   
//   }
//   googleTranslateElementInit()
// }, [])


const googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
        pageLanguage: 'tr',
        includedLanguages: 'ar,en,es,jv,ko,pt,ru,zh-CN,tr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        //autoDisplay: false,
    },
    'google_translate_element'
);
};

useEffect(() => {
  var addScript = document.createElement("script");
  addScript.setAttribute(
    "src",
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  );
  document.body.appendChild(addScript);
  window.googleTranslateElementInit = googleTranslateElementInit; 
}, [1]);








  

  return (
    <div   id="google_translate_element"   className={styles.main}>
      <div className={styles.container}>
        <div>
          <Link href="/">
            <a>
              <Image src={`/assets/images/logo.png`} height={60} width={160} />
            </a>
          </Link>
        </div>
          <div   className={styles.middleContainer}>
         <div className={styles.aboutUs}>
            <p style={{color:'#fff',cursor:'pointer'}}>
              {t('aboutus')}
            </p>
              <div className={styles.aboutUsHover}>
              <Link href="/term-and-condition">
              <p className={styles.termAndCondition} style={{color:'#fff'}}>
                Term And Condition
              </p>
              </Link>
              <Link href="/privacy-policy">
              <p className={styles.privacy} style={{color:'#fff'}}>
                Privacy Policy
              </p>
              </Link>
              </div>
          </div>
            <div className={styles.competition}>
            <p style={{color:'#fff'}}>
              Competition
            </p>
            <div className={styles.aboutUsHover}>
              <Link href="/user/available-games">
              <p className={styles.termAndCondition} style={{color:'#fff'}}>
                Challenges
              </p>
              </Link>
              <Link href="/user/available-games">
              <p className={styles.privacy} style={{color:'#fff'}}>
                Tournaments
              </p>
              </Link>
              </div>
            </div>
          <Link href="/">
          <p style={{color:'#fff'}}>
            Affiliate Program
          </p>
          </Link>
          <div style={{color:'#fff'}}>
          <a onClick={()=>window.open("mailto:hello@upaesports.com?subject=SendMail&body=Description")}>
            Contact Us
          </a>
          </div>
          </div>
        {token ? null : (
          <a className={styles.login__button} onClick={() => setModal("login")}>
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
            {/* <div className={styles.dropdown__content}>
              <Link href="/user/profile">
                <a>Profile</a>
              </Link>
              <Link href="/user/available-games">
                <a>Available Games</a>
              </Link>
              <a onClick={handleLogout}>Logout</a>
            </div> */}
          </div>
        ) : null}
        <div>
        <div  className={styles.aboutUs}>
          <div className={styles.language}>
            <p style={{color:'#fff',cursor:'pointer'}}>
              Language (
                {selectedLanguage === 'en' ? 
                  <>
                  En <Image
               style={{marginTop:5}}
                src={`/assets/images/icons/kingdom.png`}
                height={15}
                width={15}
                />
                </>
                : selectedLanguage === 'pr' ? 
                <>
                 Pr <Image
              style={{marginTop:5}}
               src={`/assets/images/icons/brazil.png`}
               height={15}
               width={15}
               />
               </>
               : selectedLanguage === 'sp' ?
               <>
                 Sp <Image
              style={{marginTop:5}}
               src={`/assets/images/icons/spain.png`}
               height={15}
               width={15}
               />
               </>
               : null
              }
                
               )
            </p>
              
            </div>
              <div className={styles.languageSelect}>
                <div onClick={()=>clickLanguage('en')} className={styles.languageWithFlag}>
                <p >
                  English
                </p>
                <Image
               src={`/assets/images/icons/kingdom.png`}
               height={17}
               width={17}
               />
                </div>
                <div onClick={()=>clickLanguage('pr')} className={styles.languageWithFlag}>
                <p>
                  Portugues
                </p>
                <Image
               src={`/assets/images/icons/brazil.png`}
               height={17}
               width={17}
               />
                </div>
                <div onClick={()=>clickLanguage('sp')} className={styles.languageWithFlag}>
                <p>
                  Spanish
                </p>
                <Image
               src={`/assets/images/icons/spain.png`}
               height={17}
               width={17}
               />
                </div>
                
             
              
              </div>
          </div>
        </div>
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
                      <div onClick={()=>setModal('resetPassword')} className={styles.password}>
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
                      <p style={{ marginLeft: 10 }}>Sign Up With Google</p>
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
                        {errors2.email && errors2.email.type === "required" && (
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
                        {errors2.phone && errors2.phone.type === "required" && (
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
                        <label className={styles.label}>Confirm Password</label>
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
                        {/* <input
                          className={styles.input}
                          placeholder="Enter your country"
                          type="text"
                          {...register2("country", { required: true })}
                        /> */}
                        {/* errors will return when field validation fails  */}
                        {errors2.country &&
                          errors2.country.type === "required" && (
                            <span>Country is required</span>
                          )}
                        {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
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
      ) : modal == "resetPassword"? (
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
                      {errors3.email && errors3.email.type === "required" && (
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
             Back To ?{" "}
              <span onClick={() => setModal("login")}>Login</span>
            </p>
          </div>
        </div>
      </Modal>

      ) : null}
    </div>
  );
}
// function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
//   throw new Error("Function not implemented.");
// }
