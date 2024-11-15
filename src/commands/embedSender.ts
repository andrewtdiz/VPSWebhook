import { EmbedBuilder } from "discord.js";
import IMAGES from "./IMAGES";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1306276037122064477/9M9ucIC_RRzhAIq-q5BDUXNBW4J6ApkUw610cacW2_nXop6QT2TVxjL4bg5QeuLqYcvd";

function randomImage() {
  return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

export default async (
  serviceId: string,
  url: string,
  commitName: string,
  timeDifference: number
) => {
  const embed = new EmbedBuilder()
    .setTitle(`Deployment Success: ${serviceId}`)
    .setDescription(`Deployment for **${serviceId}** completed successfully!`)
    .setColor(0x00ff00)
    .addFields(
      { name: "URL", value: url },
      { name: "COMMIT", value: commitName },
      { name: "Time to Deploy", value: `${timeDifference}ms` }
    )
    // .setImage(randomImage())
    .setFooter({ text: "Deployment System" })
    .setTimestamp();

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed.toJSON()],
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
