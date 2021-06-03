import { Router } from "express";
import CloudinaryRoutes from "./file.route";
import s3Routes from "./s3.route";
const app = Router();
app.use(CloudinaryRoutes);
app.use(s3Routes);

export default app;
