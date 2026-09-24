# 🤖 RDX / RADHE Virtual Number & SMS OTP Telegram Bot

Ek complete, high-performance Telegram bot jo users ko **Virtual Phone Numbers** provide karta hai **Telegram, WhatsApp, Gmail, OpenAI/ChatGPT, Instagram** ke SMS verification / OTP ke liye.

---

## 🌟 Bot Features

- 📱 **All Popular Services**: Telegram, WhatsApp, Instagram, Google, Facebook, Discord, Twitter, ChatGPT.
- 🌍 **Multiple Countries**: India (+91), USA (+1), Indonesia (+62), Russia (+7), UK (+44), Brazil (+55), Vietnam (+84).
- ⚡ **Auto OTP Delivery**: 1-click OTP checking with sound alerts.
- 🛡️ **Auto-Refund Guarantee**: Agar OTP na aaye to user 1-click me cancel karke 100% refund apne wallet me le sakta hai.
- 💳 **UPI QR Code Wallet System**: User PhonePe / Google Pay / Paytm se scan karke balance add karta hai aur UTR submit karta hai.
- 👑 **Admin Control Panel**:
  - `/addbal <userId> <amount>` - User ke wallet me paise add karein.
  - `/broadcast <message>` - Sabhi bot users ko ek sath notification/message bhejein.
  - New deposit alert admin ke private chat me aata hai.

---

## 🚀 Setup & Run Kaise Karein (Sirf 3 Steps)

### Step 1: Telegram Bot Token Leina
1. Telegram par `@BotFather` ko message karein: `/newbot`
2. Apne bot ka naam aur username rakhein (jaise: `RDX_VirtualNumber_bot`).
3. BotFather aapko ek **HTTP API Token** dega.
4. Telegram par `@userinfobot` ko start karein aur apna **User ID (Admin ID)** note karein.

### Step 2: Environment File Configure Karein
`bot/.env` file banayein aur usme apni details daalein:

```env
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_ID=1234567890
UPI_ID=bajranggodara@upi
UPI_NAME=RDX_STORE
PROFIT_MARGIN_PERCENT=25
```

*(Optional: Agar aapke paas SMS-Activate ya 5SIM ki API key hai to `SMS_API_KEY` bhi daal sakte hain)*.

---

## 📲 Mobile Me 24/7 Run Karne Ka Tarika (Termux)

Aap apne Android mobile me **Termux** app se ise bina kisi computer ke chala sakte hain:

```bash
# 1. Termux kholein aur packages install karein:
pkg update && pkg install git nodejs -y

# 2. GitHub repository clone karein:
git clone https://github.com/vinitgodara453-collab/radhe-market.git
cd radhe-market/bot

# 3. Dependencies install karein:
npm install

# 4. Bot chalu karein:
node bot.js
```

---

## ☁️ Free Cloud Server Par Run Kaise Karein (Render / VPS)

1. [Render.com](https://render.com) par free account banayein.
2. **New ➔ Background Worker** select karein.
3. Apna GitHub repo `radhe-market` link karein.
4. **Root Directory**: `bot`
5. **Build Command**: `npm install`
6. **Start Command**: `node bot.js`
7. Environment Variables me apna `BOT_TOKEN` aur `ADMIN_ID` add karke **Deploy** kar dein!
Bot 24 ghante lifetime free chalta rahega!
