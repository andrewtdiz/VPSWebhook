import { exec } from "child_process";

const urlToService: Record<string, string[]> = {
  ["https://github.com/xptea/VoidsMusic"]: [
    "MusicBot1",
    "MusicBot2",
    // "MusicBot3",
  ],
  ["https://github.com/xptea/locked-in-devs"]: ["NotLockedInBot"],
  ["https://github.com/andrewtdiz/VPSWebhook"]: ["VPSWebhook"],
};

const directories: Record<string, string> = {
  NotLockedInBot: "notlockedin",
  MusicBot1: "voidmusicbot",
  MusicBot2: "voidmusicbot2",
  MusicBot3: "voidmusicbot3",
  VPSWebhook: "VPSWebhook",
};

const executeEcho = async (url: string) => {
  const serviceIds = urlToService[url];

  if (!serviceIds) {
    console.log(`Couldn't find a serviceId for ${url}`);
    return;
  }

  for (const serviceId of serviceIds) {
    const directory = directories[serviceId];

    if (!directory) {
      console.log(`Couldn't find a Directory for ${serviceId}`);
      continue;
    }

    console.log(`Found serviceId: ${serviceId}, directory: ${directory}`);

    try {
      exec(
        `bash ./src/commands/redeploy.sh /home/${directory}/ ${serviceId}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing script: ${error.message}`);
            return;
          }
        }
      );
    } catch {
      console.log(`Error ${directory} ${serviceId}`);
    }
  }

  exec(`pm2 save`, (error) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
  });
};

export default executeEcho;
