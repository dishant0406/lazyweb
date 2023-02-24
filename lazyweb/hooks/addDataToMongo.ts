import { supabaseClient } from '../lib/supabaseClient';
import { Resource } from './Zustand';
import axios from 'axios';

//post request to http://localhost:4000/api/websites/add to addd all the Resource from supabase 
//to mongodb with bearer token 
export const addDataToMongo = async () => {
  const { data, error } = await supabaseClient
    .from('website')
    .select('*');
  if (error) {
    console.log(error);
  }
  console.log(data)
  if (data) {
    data.forEach(async (resource) => {
      try {
        const { data } = await axios.post(
          'http://localhost:4000/api/websites/add',
          resource,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpc2h1NTU3MEBnbWFpbC5jb20iLCJleHBpcmF0aW9uRGF0ZSI6IjIwMjMtMDItMjhUMTI6MjY6MjYuMjE2WiIsImlhdCI6MTY3NzE1NTE4Nn0.oCLIBbTPfEX0mjcrTdHv-GnBs-B-dmd1y7MqHgzxsRg`,
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
}
