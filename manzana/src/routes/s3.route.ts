import { v4 as uuid } from "uuid";
import path from "path";
const { BUCKET } = process.env;
import { s3 } from "../config/aws";
import { Response, Router, Request } from "express";
const app = Router();
// ORIGINAL SOLUTION HERE :https://medium.com/@mabdullah.se/upload-file-to-amazon-s3-bucket-using-presigned-url-5affc0beebdc
app.get("/amazon/url", async (req: Request, res: Response) => {
  const { filename, filetype } = req.query;
  try {
    const key = uuid() + path.extname(String(filename));
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: BUCKET,
      Key: key,
      ContentType: filetype,
      ACL: "public-read",
      Expires: 40 * 60,
    });
    res.json({ ok: true, url: url, source: { bucket: BUCKET, key: key } });
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error: "Url presigned url failed" });
  }
});

export default app;
