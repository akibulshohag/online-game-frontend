import Head from 'next/head';
import styles from '../styles/Navbar.module.css'

function MyPage() {
  return (
    <div>
      <Head>
        <script src="https://www.shoutbox.com/chat/"></script>

        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <div   id="shoutbox">
      <script>var chat = new Chat(16620);</script>
      </div>
    </div>
  );
}

export default MyPage;