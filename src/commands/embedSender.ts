const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1305189305819332720/-ju-xbEzJhFcp3dKJyKMBhpexkbJwxylvYNtVq5mggfRwfYQMBr7qySwRswWMOvCXDsf";

export default async (
  serviceId: string,
  url: string,
  timeDifference: number
) => {
  const embed = {
    title: `Deployment Success: ${serviceId}`,
    description: `Deployment for **${serviceId}** completed successfully!`,
    color: 0x00ff00, // Green color for success
    fields: [
      {
        name: "URL",
        value: url,
        inline: true,
      },
      {
        name: "Time to Deploy",
        value: `${timeDifference}ms`,
        inline: true,
      },
    ],
    footer: {
      text: "Deployment System",
    },
    timestamp: new Date().toISOString(),
  };
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error(`Error sending webhook: ${response.statusText}`);
    } else {
      console.log("Webhook sent successfully");
    }
  } catch (error) {
    console.error(`Error sending webhook: ${error}`);
  }
};
