import { exec } from "child_process";

const urlToService: Record<string, string[]> = {
  ["https://github.com/xptea/VoidsMusic"]: [
    "MusicBot1",
    "MusicBot2",
    "MusicBot3",
  ],
};

const directories: Record<string, string> = {
  NotLockedInBot: "notlockedin",
  MusicBot1: "voidmusicbot",
  MusicBot2: "voidmusicbot2",
  MusicBot3: "voidmusicbot3",
};

function execCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

const executeEcho = async (url: string) => {
  const serviceIds = urlToService[url];

  if (!serviceIds) {
    console.log(`Couldn't find a serviceId for ${url}`);
    return;
  }

  for (const serviceId of serviceIds) {
    console.log(`Received serviceId: ${serviceId}`);

    const directory = directories[serviceId];

    if (!directory) {
      console.log(`Couldn't find a Directory for ${serviceId}`);
      continue;
    }

    console.log(`Found directory: ${directory}`);

    await execCommand(
      `bash src/commands/redeploy.sh /home/${directory} ${serviceId}`
    );
  }
};

export default executeEcho;
