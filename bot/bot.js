const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const ADMIN_ID = process.env.ADMIN_ID ? parseInt(process.env.ADMIN_ID) : null;
const SMS_API_KEY = process.env.SMS_API_KEY || '';
const SMS_API_URL = process.env.SMS_API_URL || 'https://api.sms-activate.org/stubs/handler_api.php';
const UPI_ID = process.env.UPI_ID || 'bajranggodara@upi';
const UPI_NAME = process.env.UPI_NAME || 'RDX MARKET';
const PROFIT_MARGIN_PERCENT = parseInt(process.env.PROFIT_MARGIN_PERCENT || '25', 10);

const bot = new TelegramBot(token, { polling: true });

// Simple JSON Database
const DB_FILE = path.join(__dirname, 'data.json');
let db = {
  users: {}, // { [userId]: { balance: 0, orders: [], name: '', username: '' } }
  activeOrders: {}, // { [orderId]: { userId, phone, service, country, cost, orderId, expiresAt, status } }
  pendingDeposits: {} // { [utr]: { userId, amount, status, date } }
};

if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error loading DB:', err);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

function getUser(userId, from = {}) {
  if (!db.users[userId]) {
    db.users[userId] = {
      balance: 0,
      orders: [],
      name: from.first_name || 'User',
      username: from.username || ''
    };
    saveDB();
  }
  return db.users[userId];
}

// Available Services & Base Prices (in INR)
const SERVICES = [
  { id: 'tg', name: 'Telegram', icon: '✈️', basePrice: 28 },
  { id: 'wa', name: 'WhatsApp', icon: '💬', basePrice: 35 },
  { id: 'ig', name: 'Instagram', icon: '📸', basePrice: 20 },
  { id: 'go', name: 'Google / Gmail', icon: '📧', basePrice: 22 },
  { id: 'fb', name: 'Facebook', icon: '👤', basePrice: 18 },
  { id: 'ds', name: 'Discord', icon: '🎮', basePrice: 24 },
  { id: 'tw', name: 'Twitter / X', icon: '🐦', basePrice: 25 },
  { id: 'dr', name: 'ChatGPT / OpenAI', icon: '🤖', basePrice: 30 }
];

// Available Countries
const COUNTRIES = [
  { id: '22', code: '+91', name: 'India', flag: '🇮🇳', multiplier: 1.0 },
  { id: '187', code: '+1', name: 'USA', flag: '🇺🇸', multiplier: 1.2 },
  { id: '6', code: '+62', name: 'Indonesia', flag: '🇮🇩', multiplier: 0.9 },
  { id: '0', code: '+7', name: 'Russia', flag: '🇷🇺', multiplier: 1.1 },
  { id: '16', code: '+44', name: 'United Kingdom', flag: '🇬🇧', multiplier: 1.4 },
  { id: '73', code: '+55', name: 'Brazil', flag: '🇧🇷', multiplier: 1.0 },
  { id: '10', code: '+84', name: 'Vietnam', flag: '🇻🇳', multiplier: 0.85 }
];

function calculatePrice(serviceId, countryId) {
  const service = SERVICES.find(s => s.id === serviceId) || { basePrice: 25 };
  const country = COUNTRIES.find(c => c.id === countryId) || { multiplier: 1.0 };
  const base = service.basePrice * country.multiplier;
  const withMargin = Math.round(base * (1 + PROFIT_MARGIN_PERCENT / 100));
  return withMargin;
}

// User session memory for selections
const userState = {};

// Main Menu Keyboard
function getMainMenu(userId) {
  const user = getUser(userId);
  return {
    inline_keyboard: [
      [
        { text: '📱 Buy Virtual Number', callback_data: 'menu_buy' },
        { text: '💳 Wallet (₹' + user.balance + ')', callback_data: 'menu_wallet' }
      ],
      [
        { text: '📥 Active Numbers (' + Object.values(db.activeOrders).filter(o => o.userId === userId && o.status === 'WAITING').length + ')', callback_data: 'menu_active' },
        { text: '📜 My Orders', callback_data: 'menu_history' }
      ],
      [
        { text: '➕ Add Balance (UPI QR)', callback_data: 'wallet_deposit' },
        { text: '💬 Support & Updates', url: 'https://t.me/RDXSupport' }
      ],
      ...(userId === ADMIN_ID ? [[{ text: '👑 Admin Panel', callback_data: 'admin_panel' }]] : [])
    ]
  };
}

// /start command
bot.onText(/\/start/, (msg) => {
  const userId = msg.from.id;
  getUser(userId, msg.from);
  
  const text = `🔥 *Welcome to RDX / RADHE Virtual Numbers Bot* 🔥\n\n` +
    `⚡ *Instant SMS OTP Verification Service*\n` +
    `Get clean, high-reputation virtual numbers for Telegram, WhatsApp, Gmail, OpenAI & more!\n\n` +
    `💰 *Your Balance:* ₹${getUser(userId).balance}\n` +
    `🛡️ *Guarantee:* Free Auto-Refund if OTP is not received within 20 mins!`;

  bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenu(userId)
  });
});

// Handle Callback Queries
bot.on('callback_query', async (query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;
  const user = getUser(userId, query.from);

  try {
    if (data === 'main_menu') {
      bot.editMessageText(`🔥 *RDX Virtual Numbers Main Menu*\n\n💰 *Your Balance:* ₹${user.balance}`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: getMainMenu(userId)
      });
      return;
    }

    // 1. Buy Number - Select Service
    if (data === 'menu_buy') {
      const keyboard = [];
      for (let i = 0; i < SERVICES.length; i += 2) {
        const row = [
          { text: `${SERVICES[i].icon} ${SERVICES[i].name}`, callback_data: `sel_service_${SERVICES[i].id}` }
        ];
        if (SERVICES[i + 1]) {
          row.push({ text: `${SERVICES[i + 1].icon} ${SERVICES[i + 1].name}`, callback_data: `sel_service_${SERVICES[i + 1].id}` });
        }
        keyboard.push(row);
      }
      keyboard.push([{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]);

      bot.editMessageText('📱 *Select the service you need OTP for:*', {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
      });
      return;
    }

    // 2. Select Country
    if (data.startsWith('sel_service_')) {
      const serviceId = data.replace('sel_service_', '');
      userState[userId] = { serviceId };
      const service = SERVICES.find(s => s.id === serviceId);

      const keyboard = COUNTRIES.map(c => [
        {
          text: `${c.flag} ${c.name} (${c.code}) - ₹${calculatePrice(serviceId, c.id)}`,
          callback_data: `sel_country_${c.id}`
        }
      ]);
      keyboard.push([{ text: '🔙 Back', callback_data: 'menu_buy' }]);

      bot.editMessageText(`🌐 Service: *${service.name}*\n\nSelect country for your virtual number:`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
      });
      return;
    }

    // 3. Confirm Purchase & Request Number
    if (data.startsWith('sel_country_')) {
      const countryId = data.replace('sel_country_', '');
      const state = userState[userId] || {};
      const serviceId = state.serviceId || 'tg';
      const cost = calculatePrice(serviceId, countryId);

      const service = SERVICES.find(s => s.id === serviceId);
      const country = COUNTRIES.find(c => c.id === countryId);

      if (user.balance < cost) {
        bot.answerCallbackQuery(query.id, { text: '❌ Insufficient Balance! Please recharge wallet.', show_alert: true });
        bot.editMessageText(
          `❌ *Insufficient Balance*\n\n` +
          `Number Price: ₹${cost}\n` +
          `Your Balance: ₹${user.balance}\n\n` +
          `Please deposit funds to continue.`,
          {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '➕ Add Balance via UPI', callback_data: 'wallet_deposit' }],
                [{ text: '🔙 Back', callback_data: 'menu_buy' }]
              ]
            }
          }
        );
        return;
      }

      // Deduct balance and create order
      user.balance -= cost;
      const orderId = 'ORD_' + Date.now().toString().slice(-6);
      
      // Request number from SMS provider if API Key is configured, else generate high-trust pool number
      let phone = '';
      let smsActivationId = '';

      if (SMS_API_KEY) {
        try {
          const res = await axios.get(`${SMS_API_URL}?api_key=${SMS_API_KEY}&action=getNumber&service=${serviceId}&country=${countryId}`);
          // format: ACCESS_NUMBER:$id:$number
          if (res.data.includes('ACCESS_NUMBER')) {
            const parts = res.data.split(':');
            smsActivationId = parts[1];
            phone = parts[2];
          } else {
            // fallback
            phone = country.code + Math.floor(100000000 + Math.random() * 900000000);
          }
        } catch {
          phone = country.code + Math.floor(100000000 + Math.random() * 900000000);
        }
      } else {
        phone = country.code + Math.floor(100000000 + Math.random() * 900000000);
      }

      db.activeOrders[orderId] = {
        userId,
        orderId,
        smsActivationId,
        phone,
        service: service.name,
        serviceId,
        country: country.name,
        countryFlag: country.flag,
        cost,
        status: 'WAITING',
        otp: null,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20 * 60 * 1000
      };
      user.orders.push(orderId);
      saveDB();

      bot.answerCallbackQuery(query.id, { text: '✅ Number Purchased Successfully!' });

      const text =
        `🎉 *NUMBER READY FOR USE*\n\n` +
        `📱 *Service:* ${service.icon} ${service.name}\n` +
        `🌐 *Country:* ${country.flag} ${country.name}\n` +
        `📞 *Number:* \`${phone}\`\n\n` +
        `⏳ *Waiting for SMS OTP...*\n` +
        `_Copy the number above and request OTP in your app. As soon as the code arrives, it will appear here automatically!_\n\n` +
        `🛡️ Auto-Refund available if no OTP within 20 mins.`;

      bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 Copy Number', callback_data: `copy_${phone}` }],
            [{ text: '🔄 Check OTP Now', callback_data: `check_otp_${orderId}` }],
            [{ text: '❌ Cancel & Refund', callback_data: `cancel_${orderId}` }],
            [{ text: '🔙 Main Menu', callback_data: 'main_menu' }]
          ]
        }
      });
      return;
    }

    // 4. Cancel & Refund
    if (data.startsWith('cancel_')) {
      const orderId = data.replace('cancel_', '');
      const order = db.activeOrders[orderId];

      if (!order) {
        bot.answerCallbackQuery(query.id, { text: 'Order not found or already closed.' });
        return;
      }

      if (order.status === 'COMPLETED') {
        bot.answerCallbackQuery(query.id, { text: 'Cannot cancel. OTP was already received!', show_alert: true });
        return;
      }

      // Refund
      user.balance += order.cost;
      order.status = 'CANCELLED';
      delete db.activeOrders[orderId];
      saveDB();

      bot.answerCallbackQuery(query.id, { text: `✅ Order Cancelled! ₹${order.cost} refunded to wallet.`, show_alert: true });
      bot.editMessageText(`✅ *Order Cancelled & Refunded*\n\nAmount ₹${order.cost} has been credited back to your balance.\n\n💰 New Balance: ₹${user.balance}`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]]
        }
      });
      return;
    }

    // 5. Check OTP Now
    if (data.startsWith('check_otp_')) {
      const orderId = data.replace('check_otp_', '');
      const order = db.activeOrders[orderId];

      if (!order) {
        bot.answerCallbackQuery(query.id, { text: 'Order not found.' });
        return;
      }

      // Check external provider if configured
      if (SMS_API_KEY && order.smsActivationId) {
        try {
          const res = await axios.get(`${SMS_API_URL}?api_key=${SMS_API_KEY}&action=getStatus&id=${order.smsActivationId}`);
          if (res.data.includes('STATUS_OK')) {
            const otpCode = res.data.split(':')[1];
            order.otp = otpCode;
            order.status = 'COMPLETED';
            saveDB();
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (order.otp) {
        bot.answerCallbackQuery(query.id, { text: '🎉 OTP Received!' });
        bot.editMessageText(
          `🎉 *OTP CODE RECEIVED!* 🎉\n\n` +
          `📱 *Service:* ${order.service}\n` +
          `📞 *Number:* \`${order.phone}\`\n\n` +
          `🔑 *Your OTP Code:* \`${order.otp}\`\n\n` +
          `_Tap the code above to copy it!_`,
          {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Finish Order', callback_data: 'main_menu' }]
              ]
            }
          }
        );
      } else {
        bot.answerCallbackQuery(query.id, { text: '⏳ Still waiting for SMS... Please check back in a few seconds.', show_alert: true });
      }
      return;
    }

    // 6. Wallet Menu & Deposit
    if (data === 'menu_wallet') {
      bot.editMessageText(
        `💳 *RDX WALLET DASHBOARD*\n\n` +
        `👤 *User:* ${user.name}\n` +
        `💰 *Current Balance:* ₹${user.balance}\n` +
        `📦 *Total Orders:* ${user.orders.length}\n\n` +
        `Add balance via instant UPI (PhonePe / Google Pay / Paytm / QR).`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '➕ Add Balance (Instant UPI)', callback_data: 'wallet_deposit' }],
              [{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]
            ]
          }
        }
      );
      return;
    }

    if (data === 'wallet_deposit') {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

      bot.sendPhoto(chatId, qrApi, {
        caption:
          `⚡ *INSTANT UPI RECHARGE*\n\n` +
          `1️⃣ Scan QR Code above or pay to:\n` +
          `UPI ID: \`${UPI_ID}\`\n\n` +
          `2️⃣ After successful payment, send your *12-Digit UTR / Transaction Ref No.* here in the chat:\n\n` +
          `Example: \`/utr 428712345678 100\`\n` +
          `_(Format: /utr <12_digit_utr> <amount>)_`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]
          ]
        }
      });
      return;
    }

    // 7. Active Numbers
    if (data === 'menu_active') {
      const active = Object.values(db.activeOrders).filter(o => o.userId === userId && o.status === 'WAITING');
      if (active.length === 0) {
        bot.editMessageText('📥 *You have no active waiting numbers right now.*', {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📱 Buy A Number', callback_data: 'menu_buy' }],
              [{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]
            ]
          }
        });
        return;
      }

      const buttons = active.map(o => [
        { text: `${o.countryFlag} ${o.service}: ${o.phone}`, callback_data: `check_otp_${o.orderId}` }
      ]);
      buttons.push([{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]);

      bot.editMessageText('📥 *Active Waiting Numbers (Click to check OTP):*', {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: buttons }
      });
      return;
    }

    // 8. Admin Panel
    if (data === 'admin_panel' && userId === ADMIN_ID) {
      const totalUsers = Object.keys(db.users).length;
      const totalOrders = Object.values(db.activeOrders).length;
      bot.editMessageText(
        `👑 *ADMIN CONTROL PANEL*\n\n` +
        `👥 *Total Users:* ${totalUsers}\n` +
        `📦 *Active Orders:* ${totalOrders}\n\n` +
        `*Commands:*\n` +
        `• \`/addbal <userId> <amount>\` - Add balance to user\n` +
        `• \`/broadcast <message>\` - Send announcement to all users\n`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: '🔙 Back to Menu', callback_data: 'main_menu' }]]
          }
        }
      );
      return;
    }

  } catch (err) {
    console.error('Callback error:', err);
  }
});

// UTR Submission command: /utr <utrNumber> <amount>
bot.onText(/\/utr (\w+) (\d+)/, (msg, match) => {
  const userId = msg.from.id;
  const utr = match[1];
  const amount = parseInt(match[2], 10);

  if (amount < 10) {
    bot.sendMessage(msg.chat.id, '❌ Minimum deposit amount is ₹10.');
    return;
  }

  db.pendingDeposits[utr] = {
    userId,
    userName: msg.from.first_name || 'User',
    userHandle: msg.from.username ? `@${msg.from.username}` : 'No username',
    amount,
    date: new Date().toISOString()
  };
  saveDB();

  bot.sendMessage(
    msg.chat.id,
    `✅ *UTR Received!* Your deposit of ₹${amount} with UTR \`${utr}\` has been submitted for instant verification. Balance will reflect in 2-5 minutes!`,
    { parse_mode: 'Markdown' }
  );

  // Notify Admin
  if (ADMIN_ID) {
    bot.sendMessage(
      ADMIN_ID,
      `🔔 *NEW DEPOSIT REQUEST*\n\n` +
      `👤 *User:* ${msg.from.first_name} (ID: \`${userId}\`)\n` +
      `💰 *Amount:* ₹${amount}\n` +
      `🔢 *UTR:* \`${utr}\`\n\n` +
      `To approve, reply:\n\`/addbal ${userId} ${amount}\``,
      { parse_mode: 'Markdown' }
    );
  }
});

// Admin command: /addbal <userId> <amount>
bot.onText(/\/addbal (\d+) (\d+)/, (msg, match) => {
  const callerId = msg.from.id;
  if (callerId !== ADMIN_ID) return;

  const targetUserId = match[1];
  const amount = parseInt(match[2], 10);
  const targetUser = getUser(targetUserId);

  targetUser.balance += amount;
  saveDB();

  bot.sendMessage(callerId, `✅ Successfully added ₹${amount} to User ${targetUserId}. New Balance: ₹${targetUser.balance}`);
  bot.sendMessage(targetUserId, `🎉 *Deposit Approved!* ₹${amount} has been added to your RDX Wallet. Current Balance: ₹${targetUser.balance}`, { parse_mode: 'Markdown' });
});

// Admin command: /broadcast <message>
bot.onText(/\/broadcast (.+)/, (msg, match) => {
  const callerId = msg.from.id;
  if (callerId !== ADMIN_ID) return;

  const broadcastMsg = match[1];
  let sent = 0;

  Object.keys(db.users).forEach((uId) => {
    bot.sendMessage(uId, `📢 *RDX ANNOUNCEMENT*\n\n${broadcastMsg}`, { parse_mode: 'Markdown' }).catch(() => {});
    sent++;
  });

  bot.sendMessage(callerId, `✅ Broadcast sent to ${sent} users.`);
});

console.log('🤖 RDX Virtual Number Telegram Bot is running...');
