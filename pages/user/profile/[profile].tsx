import { FaAngleLeft, FaAngleRight, FaPaperPlane } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { useStatus } from "../../../context/ContextStatus";
// import ContextStatus from '../../../context/ContextStatus.js';
import { notification } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { SubmitHandler, useForm } from "react-hook-form";
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
 

const {profile} = router.query

console.log('..........',profile);

 
  

  return (
    <div className={styles.main}>
      
     
       <a>Akib</a>
    </div>
  );
}
// function useForm(): { register: any; handleSubmit: any; formState: { errors: any; }; } {
//   throw new Error("Function not implemented.");
// }
