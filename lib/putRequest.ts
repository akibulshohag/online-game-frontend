import axios from "axios";
import { parseCookies } from "nookies";
import hostname from "./config";

export default async function putRequest(url: string, data: object) {
  const cookies = parseCookies();
  const config = {
    headers: { Authorization: cookies?.token },
  };

  try {
    const res = await axios.put(`${hostname}/api/v1/${url}`, data, config);
    if (res.hasOwnProperty("data")) {
      return res?.data;
    } else {
    }
  } catch (error: any) {
    return error?.response?.data;
  }
}
