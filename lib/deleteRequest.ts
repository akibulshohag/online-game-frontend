import axios from "axios";
import { parseCookies } from "nookies";
import hostname from "./config";

export default async function deleteRequest(
  url: string,
  token: string | null,
  data: object
) {
  const cookies = parseCookies();
  const config = {
    headers: { Authorization: `Bearer ${token ? token : cookies?.token}` },
  };

  try {
    const res = await axios.delete(`${hostname}/api/${url}`, {
      headers: { Authorization: `Bearer ${token ? token : cookies?.token}` },
      data,
    });
    if (res.hasOwnProperty("data")) {
      return res?.data;
    } else {
    }
  } catch (error: any) {
    // console.log('error============',error?.response)
    return error?.response?.data;
  }
}
