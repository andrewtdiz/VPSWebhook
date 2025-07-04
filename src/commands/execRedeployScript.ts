import { exec } from "child_process";

export default function execRedeployScript(serviceId: string): Promise<void> {
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
