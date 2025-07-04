// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import redeploy from "./commands/redeploy";
import crypto from "crypto";
import { VOIDS_MUSIC_REPO } from "./SERVICES";

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

  redeploy(url, commitName);

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

app.post("/command", async (req: Request, res: Response) => {
  console.log("COMMAND RECEIVED");
  const { command, query, voiceChannelId, guildId } = req.body;
  console.log(command, query, voiceChannelId, guildId);

  if (!command || !voiceChannelId || !guildId) {
    console.log("Missing required fields:", { command, voiceChannelId, guildId });
    return res.status(400).send("Missing required fields");
  }
  if (["play", "queue", "skip", "stop", "pause", "resume", "mute", "unmute", "deafen", "undeafen"].includes(command)) {
    console.log(`Executing command: ${command} with query: ${query}`);
    const result = await fetch(`http://localhost:4000/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command,
        query,
        voiceChannelId,
        guildId,
      }),
    });
    if (result.ok) {
      console.log(`Command ${command} executed successfully`);
      return res.status(204).send("Command executed successfully");
    }
    console.log(`Failed to execute command ${command}:`, result.status, await result.text());
    return res.status(500).send("Failed to execute command");
  } else {
    console.log(`Invalid command received: ${command}`);
    return res.status(400).send("Invalid command");
  }
});

(() => {
  const hour = 1000 * 60 * 60;
  const now = new Date();
  const today4AM = new Date();
  today4AM.setUTCHours(12, 0, 0, 0);
  if (now >= today4AM) today4AM.setDate(today4AM.getDate() + 1);
  const timeUntil4AM = today4AM.getTime() - now.getTime();
  console.log(`Next deployment scheduled in ${Math.round(timeUntil4AM / hour)} hours`);

  setTimeout(() => {
    redeploy(VOIDS_MUSIC_REPO, "Scheduled daily deployment");
    setInterval(() => redeploy(VOIDS_MUSIC_REPO, "Scheduled daily deployment"), 24 * hour);
  }, timeUntil4AM);
})();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
