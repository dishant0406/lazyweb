import axios from "axios";
import { supabaseClient } from "../lib/supabaseClient";

//post request to http://localhost:4000/api/websites/add to addd all the Resource from supabase
//to mongodb with bearer token
export const addDataToMongo = async () => {
  const { data, error } = await supabaseClient.from("website").select("*");
  if (error) {
    console.log(error);
  }
  console.log(data);
  if (data) {
    data.forEach(async (resource) => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/websites/add",
          resource,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpc2h1NTU3MEBnbWFpbC5jb20iLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjMtMDktMjBUMTk6MzI6NTAuMzI3WiIsImlzQWRtaW4iOmZhbHNlLCJpZCI6IjYzZjc1NzI0MWZjNTExNjkzYWI0NDMwZCIsImlhdCI6MTY5NDgwNjM3MH0.Dkfi1yCqq-wF7V8c3rCrBbJOWstS4dgvBOgHB6Ppyzw`,
            },
          }
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    });
  }

  return { data, error };
};
