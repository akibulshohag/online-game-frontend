import axios from "axios";
import { parseCookies } from "nookies";
import hostname from "./config";

export default async function request(url: string, token: string | null) {
  const cookies = parseCookies();
  const config = {
    headers: { Authorization: `Bearer ${token ? token : cookies?.token}` },
  };

  try {
    const res = await axios.get(`${hostname}/api/${url}`, config);
    return res?.data;
  } catch (error: any) {
    console.log("error from get request", error.response);
  }
}
