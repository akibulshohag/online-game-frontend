import { faAngleRight, faPaperPlane,faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { useStatus } from "../../../context/ContextStatus";
import Modal from "../../Modal/Modal";
import Link from 'next/link'
// import ContextStatus from '../../../context/ContextStatus.js';
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { modal, setModal } = useStatus();
  // const { loginModal } = useContext(ContextStatus)
  const [activeTab, setactiveTab] = useState(0);
  console.log("...active tab: ", activeTab);

  console.log("login modal.............", modal);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div>
          <Image src={`/assets/images/logo.png`} height={30} width={150} />
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
                  <div onClick={() =>setactiveTab(1)}className={styles.google__box}>
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
                  <div onClick={()=>setactiveTab(0)} className={styles.input__header}>
                      
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        height={15}
                        width={15}
                        color={'#1234'}
                      />
                      <p style={{ marginLeft: 5 }}>Back To All options</p>
                    </div>
                  <div>
                  <div className={styles.main1}>
                  <form>
                         {/* register your input into the hook by invoking the "register" function */}
                     <div>
                          <label className={styles.label}>Email</label>
                          <input className={styles.input} placeholder="Enter Email" />
                          {/* errors will return when field validation fails  */}
                          {/* {errors.phone && errors.phone.type === "required" && <span>Phone no is required!</span>} */}
                          {/* {errors.phone && errors.phone.type === "pattern" && <span>Enter a valid phone number!</span>} */}
                          </div>

                  
                         {/* include validation with required or other standard HTML validation rules */}
                      <div>
                          <label className={styles.label}>Password</label>
                          <input className={styles.input} placeholder="Password" type="password"  />
                            {/* errors will return when field validation fails  */}
                            {/* {errors.password && errors.password.required && <span>This field is required</span>} */}
                            {/* {errors.password && errors.password.type === 'minLength' && <span>Minimum 6 character is required</span>} */}
                      </div>
                      <div className={styles.password}>
                        <p >Forgot your password</p>
                      </div>
                          <div style={{textAlign: 'center'}}>
                         <input className={styles.button} type="submit" value='Login' />
                         </div>
                   </form>
                  </div>
                  </div>
                </div>
              
            ) : null}
            <div className={styles.footer}>
              <p>
                Don&apos;t have an account? <span>Create Account</span>
              </p>
            </div>
          </div>
        </Modal>
      ) : modal == "signup" ? (
        <Modal title={"Sign up"} handleClose={() => setModal("")}>
          <h1>aksdj</h1>
        </Modal>
      ) : null}
    </div>
  );
}
function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
  throw new Error("Function not implemented.");
}

