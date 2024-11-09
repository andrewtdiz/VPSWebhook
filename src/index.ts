// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import executeEcho from "./commands/echo";
import crypto from 'crypto';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

interface RequestBody {
  serviceId?: string;
}

interface CustomRequest extends Request<{}, {}, RequestBody> {
  rawBody: Buffer;
}

const handleWebhook = async (
  req: CustomRequest,
  res: Response
) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    return res.status(400).send('Missing signature');
  }

  let computedSignature;

  try {
    computedSignature = crypto
      .createHmac('sha256', (process.env.WEBHOOK_SECRET as string))
      .update(req.rawBody)
      .digest('hex');
  } catch (err) {
    return res.status(400).send('Webhook signature verification failed');
  }

  const jsonData = req.body;
  const { serviceId } = jsonData;

  if (!serviceId) return;

  executeEcho(serviceId);
  
  res.sendStatus(204);
};

app.post("/", (req: Request, res: Response) => {
  handleWebhook(req as CustomRequest, res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
