import axios from "axios";
import { parseCookies } from "nookies";
import hostname from "./config";

export default async function postRequest(url: string, data: object) {
  const cookies = parseCookies();
  const config = {
    headers: { Authorization: cookies?.token },
  };

  try {
    const res = await axios.post(`${hostname}/api/${url}`, data, config);
    if (res.hasOwnProperty("data")) {
      return res?.data;
    } else {
    }
  } catch (error: any) {
    return error?.response?.data;
  }
}
