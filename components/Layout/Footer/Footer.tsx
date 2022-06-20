import Image from "next/image";
import Link from "next/link";
import BottomFooter from "./BottomFooter";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.main}>
      <div className={styles.footer}>
        <div className={styles.content__wrapper}>
          <div className={styles.brand__content__wrapper}>
            <div>
              <Image src={`/assets/images/logo__transparent.png`} height={60} width={150} />
              <ul>
                <li>
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
                </li>
              </ul>
            </div>
            <p>Repeat.gg allows you to enter free tournaments to win cash and other prizes</p>
            <p><span className={styles.copyright__text}>Repeat.gg 2022 All Rights Reserved.</span></p>
          </div>
          <div className={styles.page__content__wrapper}>
            <div className={styles.page__info__content}>
                <h4>Contact</h4>
                <ul>
                    <li>
                        <Link href="/"><a>Influencer</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Communities</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Developers</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Brands</a></Link>
                    </li>
                </ul>
            </div>
            <div className={styles.page__info__content}>
                <h4>Platform</h4>
                <ul>
                    <li>
                        <Link href="/"><a>Tournaments</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Market Place</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Fortnite</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>League of Legends</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>DOTA 2</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>PUBG: BATTLEGROUNDS</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Call of Duty: Warzone</a></Link>
                    </li>
                </ul>
            </div>
            <div className={styles.page__info__content}>
                <h4>Company</h4>
                <ul>
                    <li>
                        <Link href="/"><a>Contact</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>News & Blogs</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Linkedin</a></Link>
                    </li>
                </ul>
            </div>
            <div className={styles.page__info__content}>
                <h4>Other</h4>
                <ul>
                    <li>
                        <Link href="/"><a>Terms of Use</a></Link>
                    </li>
                    <li>
                        <Link href="/"><a>Privacy Policy</a></Link>
                    </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
      <BottomFooter />
    </div>
  );
}
