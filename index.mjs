import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;



// POST route to send quiz result to Telegram
app.post('/send-notification', async (req, res) => {
  const { message } = req.body;


  if (!botToken || !channelId) {
    return res.status(500).json({ error: 'Bot token or channel ID not set' });
  }

 
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      res.json({ message: 'Result sent to Telegram successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send result to Telegram' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error sending result to Telegram' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
