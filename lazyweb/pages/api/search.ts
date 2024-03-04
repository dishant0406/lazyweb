import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import https from "https";

const handler = nc<NextApiRequest, NextApiResponse>();

async function query(data:any) {
  const response = await fetch(
    "http://ai.lazyweb.rocks/api/v1/prediction/a3cf595c-5b58-4c7d-a8a5-b8a12983de7e",
    {
        headers: {
            Authorization: "Bearer CBpPiHUGEyxyMNz/MfD8XvWg6CFzXb2ahJhluX9kfc0=",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
    }
  );
  const result = await response.json();
  return result;
}

handler.post(async (req, res) => {
  console.log(JSON.parse(req.body))
  const prompt = JSON.parse(req.body).question;
  console.log(prompt)

  if (!prompt) {
    return res.json({ error: 'Missing Prompt' });
  }

  try {
    const resData = await query({
      question:prompt
    })

    let text = resData.text;
    //remove " at start and end it it is there
    if (text[0] === '"') {
      text = text.slice(1);
    }
    if (text[text.length - 1] === '"') {
      text = text.slice(0, -1);
    }
    console.log(text)
    return res.status(200).json({text})
  } catch (error) {
    console.error('Error checking HTTPS support:', error);
  }
  
})

export default handler