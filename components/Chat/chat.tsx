import Head from 'next/head';
import styles from './chat.module.css'
import { useRef } from 'react';

function MyPage() {
  

  return (
    <div>
      <Head>
        <script src="https://www.shoutbox.com/chat/"></script>
      </Head>

      <div   id="shoutbox">
      <script>var chat = new Chat(16620);</script>
      </div>
    </div>
  );
}

export default MyPage;