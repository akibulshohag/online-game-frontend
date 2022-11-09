// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useStatus } from "../../../context/ContextStatus";
// import ContextStatus from '../../../context/ContextStatus.js';
import { notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "../../../components/Modal/Modal";
import postRequest from "../../../lib/postRequest";
import styles from "../../../styles/Navbar.module.css";

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
  refernce_player_id:number
};

export default function Navbar() {
  const [allCountry, setAllCountry] = useState<allCountryType[]>([]);
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
  } = useStatus();
  const router = useRouter();

 

  const {profile}:any = router.query
  const [link, setlink] = useState(profile)
 


useEffect(() => {
  
  setlink(profile)
  // const referenceId = link.slice(33)
  // console.log('........referenceId',referenceId);
  setModal("sign up")
},[])
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


const onRegistrationSubmit: SubmitHandler<RegistrationInputs> = async (data) => {

  const data1={
      refernce_player_id: Number(profile.slice(29)),
      username: data?.username,
      email: data?.email,
      date_of_birth: data?.dateOfBirth,
      country: data?.country,
      password: data?.password,
  }
  console.log('.........data1',data1);
  
  const registrationResponse = await postRequest(
    `player-affiliate-registration`,
    null,
   {
    reference_player_id: Number(profile.slice(29)),
    username: data?.username,
    email: data?.email,
    date_of_birth: data?.dateOfBirth,
    country: data?.country,
    password: data?.password,
   }
  );
  console.log("response from registration.........", registrationResponse);
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
    
    router.push("/user/profile");
  } else {
    openNotificationWithIcon(registrationResponse?.message, "error");
  }
};

 
  

  return (
    <div className={styles.main}>


      <Modal title={"Sign up"} handleClose={() => setModal("sign up")}>
     
             <div>
                
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
                      <div className={styles.password}>
                        <p>Forgot your password</p>
                      </div>
                      <div style={{ textAlign: "center",marginBottom:'20px' }}>
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
              </Modal>
    </div>
  );
}
// function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
//   throw new Error("Function not implemented.");
// }
