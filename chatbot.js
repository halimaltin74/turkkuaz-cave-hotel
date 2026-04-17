const BOOKING_URL = 'https://www.booking.com/hotel/tr/turquaz-cave.html';

const KB = [
  { tags: ['rezervasyon','rezerve','book','müsait','müsaitlik','oda var','yer var','boş','dolu','tarih','fiyat','gecelik'], type: 'booking', answer: 'Rezervasyon yapmak ve müsaitlik kontrolü için sizi rezervasyon sayfamıza yönlendiriyorum.' },
  { tags: ['check-in','giriş saati','kaçta giriş','check in'], answer: '⏰ Giriş saatimiz (check-in) <strong>14:00</strong>\'tır.' },
  { tags: ['check-out','çıkış saati','kaçta çıkış','check out','ne zamana kadar'], answer: '⏰ Çıkış saatimiz (check-out) <strong>11:00</strong>\'dir.' },
  { tags: ['kahvaltı','sabah yemeği','yemek','büfe'], answer: '🍳 Her sabah <strong>08:30–10:30</strong> arasında ücretsiz açık büfe kahvaltı sunuyoruz. Vejetaryen ve helal seçenekler mevcuttur.' },
  { tags: ['wifi','internet','wi-fi','bağlantı'], answer: '📶 Tüm odalarda ve ortak alanlarda <strong>ücretsiz Wi-Fi</strong> mevcuttur.' },
  { tags: ['otopark','park','araç','araba'], answer: '🚗 Otelimizde <strong>ücretsiz otopark</strong> bulunmaktadır.' },
  { tags: ['transfer','havalimanı','havaalanı','ulaşım','kayseri','nevşehir','nasıl gelinir'], answer: '✈️ Transfer hizmetimiz mevcuttur:<br>• <strong>Nevşehir Havalimanı</strong> – 29 km (~30 dk)<br>• <strong>Kayseri Havalimanı</strong> – 60 km (~55 dk)<br>Detaylar için resepsiyonumuzu arayınız.' },
  { tags: ['adres','nerede','konum','nereye','lokasyon'], answer: '📍 <strong>Aydınlı Mah. Çakmaklı Sok. No:17, Göreme, Nevşehir</strong><br>Göreme merkezine yürüme mesafesindeyiz.' },
  { tags: ['telefon','ara','iletişim','whatsapp','numara'], answer: '📞 <strong>+90 384 271 22 07</strong><br>📱 WhatsApp: <strong>+90 545 271 30 50</strong><br>✉️ info@turquazcavehotel.com' },
  { tags: ['oda','kaç oda','room','suite','süit','aile','çift','üç kişilik','single','double'], answer: '🛏️ 5 oda tipimiz var:<br>• Standart Mağara Oda ($53\'ten)<br>• Konfor Çift Kişilik ($85\'ten)<br>• Üç Kişilik Oda ($110\'dan)<br>• Aile Süiti ($150\'den)<br>• Dağ Manzaralı Oda ($210\'dan)<br>Toplam 9 butik odamız mevcuttur.' },
  { tags: ['balon','sıcak hava','uçuş','balloon'], answer: '🎈 Sıcak hava balonu turları için tur masamız aracılığıyla rezervasyon yapabilirsiniz. Terasımızdan her sabah muhteşem balon manzarası eşliğinde kahvaltı yapılabilir.' },
  { tags: ['bisiklet','bike','kira'], answer: '🚲 Göreme\'yi keşfetmek için <strong>bisiklet kiralama</strong> hizmetimiz mevcuttur.' },
  { tags: ['havuz','yüzme','pool'], answer: 'Otelimizde şu an yüzme havuzu bulunmamaktadır; ancak eşsiz teras manzaramız ve tüm konfor imkânlarımızla hizmetinizdeyiz.' },
  { tags: ['mağara','kaya','cave','tarihi','otantik'], answer: '🏛️ Odalarımız gerçek kaya formasyonlarına oyulmuş otantik mağara odalardır. Doğal yalıtım sayesinde yazın serin, kışın ısınır.' },
  { tags: ['puan','yorum','değerlendirme','tripadvisor','rating'], answer: '⭐ TripAdvisor\'da <strong>4.6 / 5</strong> puan, 272 değerlendirme. "Harika konum, muhteşem atmosfer ve samimi personel" en sık geçen yorumlar.' },
  { tags: ['merhaba','selam','hi','hello','iyi günler'], answer: '👋 Merhaba! Ben Turquaz Cave Hotel sanal asistanıyım. Otelimiz hakkında her şeyi sorabilirsiniz!' },
  { tags: ['teşekkür','sağol','tamam','harika','süper','güzel'], answer: '😊 Rica ederim! Başka sorunuz olursa buradayım. Güzel bir konaklama dileriz!' },
];

function findAnswer(input) {
  const text = input.toLowerCase();
  for (const item of KB) {
    if (item.tags.some(tag => text.includes(tag))) return item;
  }
  return null;
}

const toggle   = document.getElementById('chat-toggle');
const window_  = document.getElementById('chat-window');
const messages = document.getElementById('chat-messages');
const quickEl  = document.getElementById('chat-quick-replies');
const input    = document.getElementById('chat-input');
const sendBtn  = document.getElementById('chat-send');
const closeBtn = document.getElementById('chat-close-btn');
const badge    = document.querySelector('.chat-badge');

let isOpen = false;

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
    addUserMsg(btn.textContent.replace(/[🛏️🍳📍✈️📞📅]/g, '').trim());
    respond(btn.dataset.msg);
    quickEl.style.display = 'none';
  });
});

sendBtn.addEventListener('click', send);
input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

function send() {
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  quickEl.style.display = 'none';
  addUserMsg(val);
  setTimeout(() => respond(val), 500);
}

function addUserMsg(text) {
  const d = document.createElement('div');
  d.className = 'msg msg-user';
  d.textContent = text;
  messages.appendChild(d);
  scrollBottom();
}

function addBotMsg(html, booking) {
  const typing = document.createElement('div');
  typing.className = 'msg msg-bot typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(typing);
  scrollBottom();
  setTimeout(() => {
    typing.remove();
    const d = document.createElement('div');
    d.className = 'msg msg-bot';
    d.innerHTML = html;
    if (booking) {
      const a = document.createElement('a');
      a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener';
      a.className = 'chat-booking-btn';
      a.textContent = '📅 Rezervasyon Sayfasına Git';
      d.appendChild(a);
    }
    messages.appendChild(d);
    scrollBottom();
  }, 700);
}

function respond(text) {
  const result = findAnswer(text);
  if (!result) {
    addBotMsg('Üzgünüm, bu konuda bilgim yok. Bizi arayabilirsiniz: <strong>+90 384 271 22 07</strong>');
    return;
  }
  addBotMsg(result.answer, result.type === 'booking');
}

function scrollBottom() { messages.scrollTop = messages.scrollHeight; }

// İlk selamlama mesajı
setTimeout(() => {
  addBotMsg('👋 Merhaba! Turquaz Cave Hotel hakkında merak ettiğiniz her şeyi sorabilirsiniz. Size nasıl yardımcı olabilirim?');
}, 800);
