import { Response, Router, Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { client as vimeo, TOKENVIMEO } from "../config/vimeo";
import fetch from "node-fetch";
import { of } from "rxjs";
import { pluck } from "rxjs/operators";

/**
 *  issue with tus library : https://github.com/tus/tus-js-client/issues/219
 */

// enviroments

/*=============================================
=ruta preservada para servir archivos 
que requiren algun tipo de autheticación            =

=============================================*/
const app = Router();

/* esta ruta geenera una firma que dura una hora para que el fronted
pueda enviar un archivo a cloudinary */

app.get("/media/signature", (req: Request, res: Response) => {
  var timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp: timestamp, upload_preset: "ml_default" },
    String(process.env.CLOUDINARYAPISECRET)
  );
  res.json({
    signature: signature,
    timestamp: timestamp,
  });
});

app.post("/vimeo/token", async (req: Request, res: Response) => {
  const url = "https://api.vimeo.com/me/videos";
  const { name, size } = req.body;
  const createVimeoVideo = async () => {
    const body = {
      name: name,
      upload: {
        approach: "tus",
        size: size,
      },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKENVIMEO}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      redirect: "follow",
      body: JSON.stringify(body),
    });
    return response.json();
  };
  const response = await createVimeoVideo();
  const link = await of(response).pipe(pluck("link")).toPromise();
  const linkUpload = await of(response)
    .pipe(pluck("upload", "upload_link"))
    .toPromise();
  res.json({
    ok: true,
    linkUpload: linkUpload,
    video: link,
  });
});

export default app;
