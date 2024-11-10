import { exec } from "child_process";
import SERVICES from "../SERVICES";

function redeployScript(serviceId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `bash ./src/commands/redeploy.sh /home/${serviceId}/ ${serviceId}`,
      (error) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return reject();
        }
        resolve();
      }
    );
  });
}

const executeEcho = async (url: string) => {
  const serviceIds = SERVICES[url];

  if (!serviceIds) {
    console.log(`Couldn't find a serviceId for ${url}`);
    return;
  }

  const timestamp = new Date().toISOString();

  for (const serviceId of serviceIds) {
    console.log(`Found serviceId: ${serviceId}`);

    try {
      await redeployScript(serviceId);
    } catch {
      console.log(`Error ${serviceId}`);
    }
  }

  exec(`pm2 save`, (error) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
  });

  const now = new Date();
  const timestampDate = new Date(timestamp);
  const timeDifference = now.getTime() - timestampDate.getTime();
  console.log(`Time to Deployment: ${timeDifference}ms`);
};

export default executeEcho;
