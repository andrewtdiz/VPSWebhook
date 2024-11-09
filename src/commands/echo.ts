import { exec } from "child_process";

const directories: Record<string, string> = {
  NotLockedInBot: "notlockedin",
  MusicBot1: "voidmusicbot",
  MusicBot2: "voidmusicbot2",
  MusicBot3: "voidmusicbot3",
}

const executeEcho = (serviceId: string) => {
  console.log(`Received serviceId: ${serviceId}`);
  
  const directory = directories[serviceId];

  if (!directory) {
    console.log(`Couldn't find a Directory for ${serviceId}`);
    return;
  }

  exec(
    `bash src/commands/redeploy.sh /home/${directory} ${serviceId}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    }
  );
};

export default executeEcho;
