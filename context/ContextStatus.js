import { parseCookies } from "nookies";
import { createContext, useContext, useState } from "react";

const ContextStatus = createContext();
const ContextStatusProvider = ContextStatus.Provider;

function StatusProvider({ children }) {
  const cookie = parseCookies();
  const [modal, setModal] = useState('');
  const [token, setToken] = useState(cookie?.token ? cookie?.token : null);
  const [username, setUsername] = useState(cookie?.username ? cookie?.username : null);
  const [userEmail, setUserEmail] = useState(cookie?.userEmail ? cookie?.userEmail : null);
  const [userId, setUserId] = useState(cookie?.userId ? cookie?.userId : null);

  return (
    <ContextStatusProvider
      value={{
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
      }}
    >
      {children}
    </ContextStatusProvider>
  );
}

function useStatus() {
  const all = useContext(ContextStatus);
  return all;
}

export { StatusProvider, useStatus };
