import axios from "axios";
import { resources } from "./data.mjs";

const unFormatUrl = (url) => {
  url = url.toLowerCase();
  // Remove any https:// that appears at the beginning of the string
  url = url.replace("https://", "");
  url = url.replace("http://", "");
  // Remove any www. that appears at the beginning of the string
  url = url.replace("www.", "");

  // url = url.split('/')[0]

  return url;
};
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpc2h1NTU3MEBnbWFpbC5jb20iLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjMtMTItMDNUMTc6NDg6MjYuNTk4WiIsImlzQWRtaW4iOnRydWUsImlkIjoiNjNmNzU3MjQxZmM1MTE2OTNhYjQ0MzBkIiwiaWF0IjoxNzAxMTkzNzA2fQ.2LNTIqwNaDVFJKTnUEFmpXRV3KPdT_wcBqPWMAsNae8";

const instance = axios.create({
  baseURL: "https://api.lazyweb.rocks",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

const addResources = async () => {
  for (const resource of resources) {
    try {
      const { data } = await instance.post("/api/websites/add-by-url", {
        url: resource.url,
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
};

addResources();
