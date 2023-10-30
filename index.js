const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "6662469935:AAFHauMnuT1SgUPXCSbMUCwZQhdfjAzrRFs";
const webAppUrl = "https://main--starlit-nougat-08212f.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        keyboard: [[{ text: "Заполнить форму", web_app: { url: webAppUrl } }]],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      const message = `
\ 💼 Вакансия: ${data?.title}
\ 📍 Город: ${data?.city}

\ 🏦 О компании: ${data?.description}

\ 💻 Формат работы: ${data?.format}
 График работы ${data?.schedule}
\ 📊 Заработная плата: ${data?.salary}

\ 🗓 Требования:
${data?.requirements}
\ 📱 Контакты: ${data?.contacts}
`;

      await bot.sendMessage(
        chatId,
        "Чтобы разместить вакансию оплатите 500 ТГ на номер 87016561717, с комментариями компании и отправьте чек @Workmeneg. Или карту 4400430239125823"
      );
      await bot.sendMessage(chatId, message);
      await bot.sendMessage(6243354185, `=============================`);
      await bot.sendMessage(
        6243354185,
        `В бота написал человек: ${msg.chat.first_name}, его id ${msg.chat.id}`
      );
      await bot.sendMessage(6243354185, message, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Добавить вакансию", callback_data: "isYes" }],
          ],
        },
      });
      await bot.sendMessage(6243354185, "=============================");
      bot.on("callback_query", async (msg) => {
        const callback = msg.data;
        if (callback === "isYes") {
          await bot.sendMessage(chatId, "Ваше сообщение успешно отправленно");
          await bot.sendMessage(-1001817188598, message, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Разместить вакансию",
                    url: "https://t.me/almaty_jobs_best_bot",
                  },
                ],
                [
                    {
                        text: "Откликнуться",
                        url: `https://wa.me/${data?.contacts}`,
                      },
                ],
                [
                  {
                    text: "Жалобы и предложения",
                    url: "https://t.me/jobshuntingwo",
                  },
                ],
              ],
            },
          });
        }
      });
      // 6243354185
      // title, city, description, format, schedule, salary, requirements, contacts,
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
  console.log(msg);
});

const PORT = 8000;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
