import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  let httpsUrl = url;

  // if starts with http://, replace with https://
  if (url.startsWith('http://')) {
    httpsUrl = `https://${url.slice(7)}`;
  }


  httpsUrl = url.startsWith('https://') ? url : `https://${url}`;

  try {
    const response = await fetch(httpsUrl, { method: 'HEAD' });
    if (response.ok) {
      return res.json({ supportsHttps: true });
    }
  } catch (error) {
    console.error('Error checking HTTPS support:', error);
  }

  return res.json({ supportsHttps: false });
  
})

export default handler