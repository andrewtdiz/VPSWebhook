import { exec } from "child_process";
import SERVICES from "../SERVICES";
import embedSender from "./embedSender";
import execRedeployScript from "./execRedeployScript";

const redeploy = async (url: string, commitName: string = "HEAD") => {
  console.log(SERVICES);
  const serviceIds = SERVICES[url];

  if (!serviceIds) {
    console.log(`Couldn't find a serviceId for ${url}`);
    return;
  }

  const timestamp = new Date().toISOString();

  for (const serviceId of serviceIds) {
    console.log(`Found serviceId: ${serviceId}`);

    try {
      await execRedeployScript(serviceId);

      const timeDifference =
        new Date().getTime() - new Date(timestamp).getTime();

      await embedSender(serviceId, url, commitName, timeDifference);
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

  const timeDifference = new Date().getTime() - new Date(timestamp).getTime();
  console.log(`Time to Deployment: ${timeDifference}ms`);
};

export default redeploy;
