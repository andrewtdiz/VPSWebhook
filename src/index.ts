// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import executeEcho from "./commands/echo";
import crypto from "crypto";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  express.json({
    verify: (req: any, _, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

interface RequestBody {
  repository?: {
    url: string;
  };
  commits?: [
    {
      message: string;
    }
  ]
}

interface CustomRequest extends Request<{}, {}, RequestBody> {
  rawBody: Buffer;
}

const handleWebhook = async (req: CustomRequest, res: Response) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.log("Missing signature");
    return res.status(400).send("Missing signature");
  }

  try {
    crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
      .update(req.rawBody)
      .digest("hex");
  } catch (err) {
    console.log("Webhook signature verification failed");
    return res.status(400).send("Webhook signature verification failed");
  }

  const jsonData = req.body;
  const url = jsonData?.repository?.url;
  const commitName = jsonData?.commits?.[0]?.message || "UNKNOWN";

  if (!url) {
    console.log("Missing url");
    return res.status(400).send("Missing url");
  }

  executeEcho(url, commitName);

  res.sendStatus(204);
};

app.get("/", async (_, res: Response) => {
  res.send("Hello world");
});

app.post("/", async (req: Request, res: Response) => {
  try {
    await handleWebhook(req as CustomRequest, res);
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
