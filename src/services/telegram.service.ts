const TELEGRAM_BOT_TOKEN = "8922031691:AAGZoPBtdWXyJMBGDsy7QwbzBvJVonBMaxU";
const TELEGRAM_CHAT_ID = "1384205752";

export const sendTelegramMessage = async (text: string) => {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
      }),
    }
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description);
  }

  return data;
};