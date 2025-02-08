import { bigEarsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import svg64 from "svg64";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { text } = req.body;
  const data = await createAvatar(bigEarsNeutral, {
    seed: text,
  });
  const base64 = svg64(data.toString());
  res.send(base64);
});

export default handler;
