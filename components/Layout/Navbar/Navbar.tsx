import Image from 'next/image';
import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useStatus } from '../../../context/ContextStatus';
import Modal from '../../Modal/Modal';
// import ContextStatus from '../../../context/ContextStatus.js';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { modal, setModal } = useStatus()
  // const { loginModal } = useContext(ContextStatus)

  console.log('login modal.............', modal);
  
  return (
    <div className={styles.main}>
        <div className={styles.container}>
          <div>
              <Image src={`/assets/images/logo.png`} height={30} width={150} />
          </div>
          <a onClick={() => setModal('login')}>Login</a>
          <a onClick={() => setModal('signup')}>Sign up</a>
        </div>
        {modal == 'login' ? <Modal title={'Login'} handleClose={() => setModal('')}>
          <h1>kasljdf</h1>
        </Modal> : modal == 'signup' ? <Modal title={'Sign up'} handleClose={() => setModal('')}>
          <h1>aksdj</h1>
          </Modal> : null}
    </div>
  )
}