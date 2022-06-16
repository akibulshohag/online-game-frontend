import Image from 'next/image';
import { Container } from 'react-bootstrap';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.main}>
        <div className={styles.container}>
        <div>
            <Image src={`/assets/images/logo.png`} height={30} width={150} />
        </div>
        </div>
    </div>
  )
}