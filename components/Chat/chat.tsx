import Head from 'next/head';

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