import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useStatus } from "../../../context/ContextStatus";
import BottomFooter from "./BottomFooter";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    
    setselectedChallenge,
  } = useStatus();

  const redirectChallange = () => {
    router.push("/user/available-games");
    setselectedChallenge("Challenges");
  };
  const redirectTournament = () => {
    router.push("/user/available-games");
    setselectedChallenge("Tournament");
  };
  return (
    <div className={styles.main}>
      <div className={styles.footer}>
        <div className={styles.content__wrapper}>
          <div className={styles.brand__content__wrapper}>
            <div>
              <Image
                src={`/assets/images/logo__transparent.png`}
                height={60}
                width={150}
              />
              <ul>
                {/* <li>
                  <a href="https://discord.com">
                    <Image
                      src={`/assets/images/icons/discord.png`}
                      height={20}
                      width={18}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://discord.com">
                    <Image
                      src={`/assets/images/icons/youtube.png`}
                      height={15}
                      width={20}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://discord.com">
                    <Image
                      src={`/assets/images/icons/twitter.png`}
                      height={15}
                      width={20}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://discord.com">
                    <Image
                      src={`/assets/images/icons/twitch.png`}
                      height={20}
                      width={20}
                    />
                  </a>
                </li> */}
              </ul>
            </div>
            {/* <p>Ultimate Players Arena allows you to enter free tournaments to win cash and other prizes</p>
            <p><span className={styles.copyright__text}>Ultimate Players Arena(UPA) 2022 All Rights Reserved.</span></p> */}
          </div>
          <div className={styles.page__content__wrapper}>
            <div className={styles.page__info__content1}>
              <h4>+18</h4>
              <ul>
                <li>
                  {/* <Link href="/disclaimer"> */}
                  <a>
                    The Ultimate Players Arena is an online service that
                    facilitates Challenges and tournaments for users who play
                    video games they have purchased on their own video game
                    consoles and PCs. The Ultimate Players Arena does not sell
                    or license video games and is not endorsed by, directly
                    affiliated with, maintained, or sponsored by, any video game
                    manufacturer, sports league, content, games titles, trade
                    names, and/or trade dress, trademarks, artwork, and
                    associated imagery. They are trademarks and/or copyright
                    material of their respective owners.
                  </a>
                  {/* </Link> */}
                </li>
              </ul>
            </div>
            <div className={styles.page__info__content}>
              <Link href="/about-us">
                <h4 style={{ cursor: "pointer" }}>{t("aboutus")}</h4>
              </Link>
              <ul>
                {/* <li>
                        <Link href="/about-us"><a>About Us</a></Link>
                    </li> */}
                <li>
                  <Link href="/privacy-policy">
                    <a>Privacy Policy</a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions">
                    <a>Terms and Conditions</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.page__info__content}>
              <h4>Competition</h4>
              <ul>
                <li>
                 
                    <a onClick={() =>redirectChallange()}>Challenges</a>
                 
                </li>
                <li>
                  
                    <a onClick={() =>redirectTournament()}>Tournaments</a>
                  
                </li>
                {/* <li>
                        <Link href="/"><a>Linkedin</a></Link>
                    </li> */}
              </ul>
            </div>
            <div className={styles.page__info__content}>
              <Link href="/terms-and-conditions">
                <a>
                  <h4>Affiliate Program</h4>
                </a>
              </Link>
              <ul>
                {/* <li>
                        <Link href="/about-us"><a>About Us</a></Link>
                    </li>
                    <li>
                        <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
                    </li>
                    <li>
                        <Link href="/term-and-condition"><a>Terms and Condition</a></Link>
                    </li>
                    <li>
                        <Link href="/disclaimer"><a>Disclaimer</a></Link>
                    </li> */}
              </ul>
            </div>
            <div className={styles.page__info__content}>
              <a href="mailto:hello@upaesports.com?subject=SendMail&body=Description">
                <h4>Contact</h4>
              </a>
              <ul>
                {/* <li>
                    <a href="mailto:hello@upaesports.com?subject=SendMail&body=Description">
                    <Image
                      src={`/assets/images/icons/gmail.png`}
                      height={20}
                      width={20}
                    />
                  </a>
                    </li> */}
                {/* <li>
                        <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
                    </li>
                    <li>
                        <Link href="/term-and-condition"><a>Terms and Condition</a></Link>
                    </li>
                    <li>
                        <Link href="/disclaimer"><a>Disclaimer</a></Link>
                    </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <BottomFooter /> */}
    </div>
  );
}
