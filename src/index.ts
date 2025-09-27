// src/index.ts
import { Hono } from "hono";
import dotenv from "dotenv";
import redeploy from "./commands/redeploy";
import crypto from "crypto";
import { VOIDS_MUSIC_REPO } from "./SERVICES";
import { exec } from "child_process";

dotenv.config();

const app = new Hono();
const port = process.env.PORT || 3000;

interface RequestBody {
  repository?: {
    url: string;
  };
  commits?: [
    {
      message: string;
    }
  ];
}

const handleWebhook = async (c: any) => {
  const signature = c.req.header("x-hub-signature-256");

  if (!signature) {
    return c.text("Missing signature", 400);
  }

  // Get raw body for signature verification
  const rawBody = await c.req.arrayBuffer();

  try {
    crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET as string)
      .update(new Uint8Array(rawBody))
      .digest("hex");
  } catch (err) {
    console.log("Webhook signature verification failed");
    return c.text("Webhook signature verification failed", 400);
  }

  const jsonData = (await c.req.json()) as RequestBody;
  const url = jsonData?.repository?.url;
  const commitName = jsonData?.commits?.[0]?.message || "UNKNOWN";

  if (!url) {
    console.log("Missing url");
    return c.text("Missing url", 400);
  }

  redeploy(url, commitName);

  return c.text("", 204);
};

app.get("/", (c) => {
  return c.text("Hello world");
});

app.post("/", async (c) => {
  try {
    return await handleWebhook(c);
  } catch (error) {
    console.error("Error handling webhook:", error);
    return c.text("Internal server error", 500);
  }
});

app.post("/command", async (c) => {
  const body = await c.req.json();

  const result = await fetch(`http://localhost:4000/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (result.ok) {
    return new Response("Command executed successfully", { status: 204 });
  }
  console.log(
    `Failed to execute command`,
    result.status,
    await result.text()
  );
  return c.text("Failed to execute command", 500);
});

(() => {
  const hour = 1000 * 60 * 60;
  const now = new Date();
  const today4AM = new Date();
  today4AM.setUTCHours(12, 0, 0, 0);
  if (now >= today4AM) today4AM.setDate(today4AM.getDate() + 1);
  const timeUntil4AM = today4AM.getTime() - now.getTime();
  console.log(
    `Next music bot reset scheduled in ${Math.round(timeUntil4AM / hour)} hours`
  );

  setTimeout(() => {
    redeploy(VOIDS_MUSIC_REPO, "Daily music bot reset");

    exec(`yt-dlp -U`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
      }
      console.log("ATTEMPTING TO UPDATE YT-DLP");
      console.log(stdout);
    });

    setInterval(
      () => redeploy(VOIDS_MUSIC_REPO, "Daily music bot reset"),
      24 * hour
    );
  }, timeUntil4AM);
})();

export default {
  port: parseInt(port.toString()),
  fetch: app.fetch,
};

console.log(`[server]: Server is running at http://localhost:${port}`);
