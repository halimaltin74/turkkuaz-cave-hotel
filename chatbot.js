const BOOKING_URL = 'https://www.booking.com/hotel/tr/turquaz-cave.html';
const API_URL = '/api/chat';

const toggle   = document.getElementById('chat-toggle');
const window_  = document.getElementById('chat-window');
const messages = document.getElementById('chat-messages');
const quickEl  = document.getElementById('chat-quick-replies');
const input    = document.getElementById('chat-input');
const sendBtn  = document.getElementById('chat-send');
const closeBtn = document.getElementById('chat-close-btn');
const badge    = document.querySelector('.chat-badge');

let isOpen = false;
let history = [];
let isTyping = false;

function toggleChat(force) {
  isOpen = force !== undefined ? force : !isOpen;
  window_.classList.toggle('open', isOpen);
  toggle.classList.toggle('active', isOpen);
  if (isOpen) { badge.style.display = 'none'; setTimeout(() => input.focus(), 300); }
}

toggle.addEventListener('click', () => toggleChat());
closeBtn.addEventListener('click', () => toggleChat(false));

document.querySelectorAll('.qr-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.msg;
    addUserMsg(btn.textContent.replace(/[🛏️🍳📍✈️📞📅]/gu, '').trim());
    quickEl.style.display = 'none';
    sendToAgent(text);
  });
});

sendBtn.addEventListener('click', send);
input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

function send() {
  const val = input.value.trim();
  if (!val || isTyping) return;
  input.value = '';
  quickEl.style.display = 'none';
  addUserMsg(val);
  sendToAgent(val);
}

function addUserMsg(text) {
  const d = document.createElement('div');
  d.className = 'msg msg-user';
  d.textContent = text;
  messages.appendChild(d);
  scrollBottom();
}

function showTyping() {
  const t = document.createElement('div');
  t.className = 'msg msg-bot typing-indicator';
  t.id = 'typing-bubble';
  t.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(t);
  scrollBottom();
}

function hideTyping() {
  const t = document.getElementById('typing-bubble');
  if (t) t.remove();
}

function addBotMsg(html, showBooking) {
  const d = document.createElement('div');
  d.className = 'msg msg-bot';
  d.innerHTML = html;
  if (showBooking) {
    const a = document.createElement('a');
    a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'chat-booking-btn';
    a.textContent = '📅 Rezervasyon Sayfasına Git';
    d.appendChild(a);
  }
  messages.appendChild(d);
  scrollBottom();
}

function scrollBottom() { messages.scrollTop = messages.scrollHeight; }

async function sendToAgent(text) {
  if (isTyping) return;
  isTyping = true;
  input.disabled = true;
  sendBtn.disabled = true;

  history.push({ role: 'user', content: text });
  showTyping();

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();
    hideTyping();

    if (!res.ok || data.error) {
      addBotMsg('Üzgünüm, şu an bir sorun oluştu. Bizi arayabilirsiniz: <strong>+90 384 271 22 07</strong>');
      history.pop();
    } else {
      const reply = data.reply;
      history.push({ role: 'assistant', content: reply });

      const showBooking = /rezervasyon|booking|book|müsait/i.test(text);
      addBotMsg(reply.replace(/\n/g, '<br>'), showBooking);
    }
  } catch {
    hideTyping();
    addBotMsg('Bağlantı hatası. Bizi arayabilirsiniz: <strong>+90 384 271 22 07</strong>');
    history.pop();
  }

  isTyping = false;
  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

// İlk selamlama
setTimeout(() => {
  addBotMsg('👋 Merhaba! Turquaz Cave Hotel hakkında merak ettiğiniz her şeyi sorabilirsiniz. Size nasıl yardımcı olabilirim?');
}, 800);
