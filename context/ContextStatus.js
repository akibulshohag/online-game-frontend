import jwt_decode from "jwt-decode";
import { parseCookies } from "nookies";
import { createContext, useContext, useState } from "react";

const ContextStatus = createContext();
const ContextStatusProvider = ContextStatus.Provider;

function StatusProvider({ children }) {
  const cookie = parseCookies();
  const [modal, setModal] = useState('');
  const [token, setToken] = useState(cookie?.token ? cookie?.token : null);

  return (
    <ContextStatusProvider
      value={{
        modal,
        setModal,
        token,
        setToken,
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


// import { createContext, useState, FC } from 'react';
// import { ContextStateType } from './interfaces';

// const contextDefaultValues : ContextStateType = {
//     loginModal: '',
// };

// export const ContextStatus = createContext<ContextStateType>(
//     contextDefaultValues
// );

// const ContextStatusProvider: FC = ({ children }) => {
//     const [loginModal, setLoginModal] = useState<string>(contextDefaultValues.loginModal)

//     return (
//         <ContextStatus.Provider value={{loginModal}}>{children}</ContextStatus.Provider>
//     )
// }

// export default ContextStatusProvider;

// export interface LoginModalData {
//   loginModals: LoginModal
// }

// export const loginModalDefaultValue: LoginModal = {

// }