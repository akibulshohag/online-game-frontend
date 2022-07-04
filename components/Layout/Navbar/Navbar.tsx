import {
  faAngleLeft,
  faAngleRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useStatus } from "../../../context/ContextStatus";
import Modal from "../../Modal/Modal";
// import ContextStatus from '../../../context/ContextStatus.js';
import { notification } from "antd";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
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
};

export default function Navbar() {
  const [allCountry, setAllCountry] = useState<allCountryType[]>([]);
  const { modal, setModal } = useStatus();
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

  console.log("all country.........", allCountry);

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    console.log(data);
    const res = await postRequest(`player-login`, {
      email: data?.email,
      password: data?.password,
      device_token: "",
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
    const registrationResponse = await postRequest(`player-registration`, {
      username: data?.username,
      email: data?.email,
      date_of_birth: data?.dateOfBirth,
      country: data?.country,
      password: data?.password,
    });
    console.log("response from registration.........", registrationResponse);
    if (registrationResponse?.status == "success") {
      openNotificationWithIcon(registrationResponse?.message, "success");
      setModal("");
    } else {
      openNotificationWithIcon(registrationResponse?.message, "error");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div>
          <Image src={`/assets/images/logo.png`} height={60} width={160} />
        </div>
        <a onClick={() => setModal("login")}>Login</a>
        <a onClick={() => setModal("signup")}>Sign up</a>
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
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
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
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => setactiveTab(1)}
                    className={styles.google__box}
                  >
                    <div className={styles.image__border}>
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        height={25}
                        width={25}
                        color={"#00ACF6"}
                      />
                    </div>
                    <div className={styles.arrow}>
                      <p style={{ marginLeft: 10 }}>Login With Email</p>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
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
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    height={15}
                    width={15}
                    color={"#1234"}
                  />
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
                          {...register("password", { required: true })}
                        />
                        {/* errors will return when field validation fails  */}
                        {errors.password &&
                          errors.password.type === "required" && (
                            <span>Password is required</span>
                          )}
                        {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                      </div>
                      <div className={styles.password}>
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
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
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
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
                    </div>
                  </div>
                  <div
                    onClick={() => setactiveTab(1)}
                    className={styles.google__box}
                  >
                    <div className={styles.image__border}>
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        height={25}
                        width={25}
                        color={"#00ACF6"}
                      />
                    </div>
                    <div className={styles.arrow}>
                      <p style={{ marginLeft: 10 }}>Sign Up With Email</p>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        height={20}
                        width={20}
                      />
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
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    height={15}
                    width={15}
                    color={"#1234"}
                  />
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
                          placeholder="Enter User Name"
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
                        <label className={styles.label}>Password</label>
                        <input
                          className={styles.input}
                          placeholder="Password"
                          type="password"
                          {...register2("password", { required: true })}
                        />
                        {/* errors will return when field validation fails  */}
                        {errors2.password &&
                          errors2.password.type === "required" && (
                            <span>Password is required</span>
                          )}
                        {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                      </div>
                      <div>
                        <label className={styles.label}>Confirm Password</label>
                        <input
                          className={styles.input}
                          placeholder="Confirm Password"
                          type="password"
                          {...register2("confirmPassword", { required: true })}
                        />
                        {/* errors will return when field validation fails  */}
                        {errors2.confirmPassword &&
                          errors2.confirmPassword.type === "required" && (
                            <span>Confirm Password is required</span>
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
                      <div className={styles.password}>
                        <p>Forgot your password</p>
                      </div>
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
      ) : null}
    </div>
  );
}
// function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
//   throw new Error("Function not implemented.");
// }
