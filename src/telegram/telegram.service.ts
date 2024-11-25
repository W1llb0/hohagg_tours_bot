import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables',
      );
    }
    this.bot = new TelegramBot(token, { polling: true });
  }

  onModuleInit() {
    this.bot.onText(/\/start/, (msg) => {
      this.sendWelcomeMessage(msg.chat.id);
    });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      switch (text) {
        case '🚘 Джип-туры':
          this.sendMessageWithBackOption(
            chatId,
            '🚙 Подберём транспорт для путешествий по горам. В нашем автопарке новые джипы tank 300 2024 года выпуска.',
          );
          break;
        case '🏍️ Мото-туры':
          this.sendMessageWithBackOption(
            chatId,
            '🏍️ Подберём мототранспорт для вашего активного отдыха. В нашем мотопарке: квадроциклы, багги и мотоциклы эндуро (кроссовые мотоциклы).',
          );
          break;
        case '🏘️ Размещение':
          this.sendMessageWithBackOption(
            chatId,
            '🏡 Подберём любой вид проживания на территории Северной Осетии в городе или в горах: отель/гостиница, коттедж, глемпинг …',
          );
          break;
        case '⛺️ Кемпинг':
          this.sendMessageWithBackOption(
            chatId,
            '🏕️ Организуем палаточный городок для вашего комфортного пребывания и ночёвки на природе.',
          );
          break;
        case '🧗🏻 Пешие туры':
          this.sendMessageWithBackOption(
            chatId,
            '🥾 Походы в горы с профессиональным проводником в направлении самых популярных и живописных мест.',
          );
          break;
        case '🔥 Доп. услуги':
          this.sendMessageWithBackOption(
            chatId,
            '🛬 Трансфер из аэропорта, баня, фото и видео съёмка, полевая кухня, катание на лошадях.',
          );
          break;
        case 'Информация':
          this.sendMessageWithBackOption(
            chatId,
            'ℹ️ Здесь будет информация о наших услугах.',
          );
          break;
        case 'О нас':
          this.sendMessageWithBackOption(
            chatId,
            '👥 Здесь будет информация о нас.',
          );
          break;
        case 'Назад':
          this.sendWelcomeMessage(chatId);
          break;
        default:
          this.bot.sendMessage(chatId, 'Пожалуйста, выберите одну из кнопок.');
      }
    });
  }

  private sendWelcomeMessage(chatId: number) {
    const welcomeMessage =
      `👋 Приветствуем! Это Хохаг турс\n\nВыберите одну из кнопок ниже:\n\n` +
      `🚘 Джип-туры — подберём транспорт для путешествий по горам. В нашем автопарке новые джипы tank 300 2024 года выпуска.\n\n` +
      `🏍️ Мото-туры — подберём мототранспорт для вашего активного отдыха. В нашем мотопарке: квадроциклы, багги и мотоциклы эндуро (кроссовые мотоциклы).\n\n` +
      `🏘️ Размещение — подберём любой вид проживания на территории Северной Осетии в городе или в горах: отель/гостиница, коттедж, глемпинг …\n\n` +
      `⛺️ Кемпинг — организуем палаточный городок для вашего комфортного пребывания и ночёвки на природе.\n\n` +
      `🧗🏻 Пешие туры — походы в горы с профессиональным проводником в направлении самых популярных и живописных мест.\n\n` +
      `🔥 Доп. услуги — трансфер из аэропорта, баня, фото и видео съёмка, полевая кухня, катание на лошадях.`;

    const options = this.getMainKeyboardOptions();

    this.bot.sendMessage(chatId, welcomeMessage, options);
  }

  private getMainKeyboardOptions() {
    return {
      reply_markup: {
        keyboard: [
          [{ text: '🚘 Джип-туры' }, { text: '🏍️ Мото-туры' }],
          [{ text: '🏘️ Размещение' }, { text: '⛺️ Кемпинг' }],
          [{ text: '🧗🏻 Пешие туры' }, { text: '🔥 Доп. услуги' }],
          [{ text: 'Информация' }, { text: 'О нас' }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
  }

  private sendMessageWithBackOption(chatId: number, message: string) {
    const options = {
      reply_markup: {
        keyboard: [[{ text: 'Назад' }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    this.bot.sendMessage(chatId, message, options);
  }
}
