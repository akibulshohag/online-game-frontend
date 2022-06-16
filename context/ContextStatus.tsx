// import { parseCookies } from "nookies";
// import { createContext, useContext, useState } from "react";

// type contextType

// const ContextStatus = createContext();

// const ContextStatusProvider = ContextStatus.Provider;

// function StatusProvider({ children }) {
//   const cookie = parseCookies()
//   let items = cookie?.hasOwnProperty('cookieCartItems') ? [...JSON.parse(cookie?.cookieCartItems)] : []
//   // let wishProductItems = cookie?.hasOwnProperty('cookieWishItems') ? [...JSON.parse(cookie?.cookieWishItems)] : []
//   const id = cookie?.hasOwnProperty('token') ? jwt_decode(cookie?.token)?.data?._id : null;
//   const [cartItems, setCartItems] = useState(items);
//   const [message, setMessage] = useState('')
//   const [sideCart,setSideCart] = useState(false)
//   const [token,setToken] = useState(cookie?.token ? cookie?.token : null)
//   const [user,setUser] = useState(cookie?.user ? cookie?.user : null)
//   const [sideCategory, setSideCategory] = useState(false)
//   const [profileMenu, setProfileMenu] = useState(false)
//   const [deliveryType, setDeliveryType] = useState(0)
//   const [deliveryAddress, setDeliveryAddress] = useState({})
//   const [categoryMenu, setCategoryMenu] = useState(false);
//   const [cancel, setCancel] = useState(false);
//   // const [page, setPage] = useState(1);
//   const [modalSupport, setmodalSupport] = useState(false);
//   const [modalFilter, setModalFilter] = useState(false);
//   const [wishItems, setWishItems] = useState([]);
//   const [phone, setPhone] = useState('');
//   const [userId, setUserId] = useState(id ? id : null);
//   const [inside, setInside] = useState(0);
//   const [outside, setOutside] = useState(0);
//   const [type, setType] = useState('withoutSorting')
//   const [stock, setStock] = useState(1)
//   const [popupShow, setPopupShow] = useState(true);

//   return (
//     <ContextStatusProvider value={{ 
//       cartItems, setCartItems, 
//       message, setMessage,
//       sideCart, setSideCart,
//       token, setToken,
//       user, setUser,
//       sideCategory, setSideCategory,
//       profileMenu, setProfileMenu,
//       deliveryType, setDeliveryType,
//       deliveryAddress, setDeliveryAddress,
//       categoryMenu, setCategoryMenu,
//       cancel, setCancel,
//       // page, setPage,
//       modalSupport, setmodalSupport,
//       modalFilter, setModalFilter,
//       wishItems, setWishItems,
//       phone, setPhone,
//       userId, setUserId,
//       inside, setInside,
//       outside, setOutside,
//       type, setType,
//       stock, setStock,
//       popupShow, setPopupShow,
//       }}>
//       {children}
//     </ContextStatusProvider>
//   )
// }

// function useStatus() {
//   const all = useContext(ContextStatus)
//   return all;
// }

// export { StatusProvider, useStatus };

