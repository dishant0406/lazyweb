import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/big-ears-neutral';
import svg64 from "svg64";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { text } = req.body;
  const data = await createAvatar(style, {
    seed: text,
  });
  const base64 = svg64(data);
  res.send(base64);
})

export default handler
