import { bigEarsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  try {
    console.log("hello");
    const { text } = req.body;
    console.log(text);
    const data = await createAvatar(bigEarsNeutral, {
      seed: text,
    });
    const png = data.png({
      includeExif: true,
    });
    const base64Image = await png.toDataUri();
    res.send(base64Image);
  } catch (err) {
    console.log(err);
    res.send({ err: "err" });
  }
});

export default handler;
