import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();

async function query(data: any) {
  const response = await fetch(
    "http://ai.lazyweb.rocks/api/v1/prediction/d8404cf3-8fca-465d-8f2d-ff7a0d6ae0aa",
    {
      headers: {
        Authorization: "Bearer CBpPiHUGEyxyMNz/MfD8XvWg6CFzXb2ahJhluX9kfc0=",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

handler.post(async (req, res) => {
  console.log(req.body);
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.json({ error: "Missing Prompt" });
  }

  try {
    const resData = await query({
      question: prompt,
    });

    console.log(res);

    let text = resData.text;
    //remove " at start and end it it is there
    if (text[0] === '"') {
      text = text.slice(1);
    }
    if (text[text.length - 1] === '"') {
      text = text.slice(0, -1);
    }

    return res.status(200).send(text);
  } catch (error) {
    console.error("Error checking HTTPS support:", error);
  }
});

export default handler;
