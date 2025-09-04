const micButton = document.getElementById('micButton');
const convertButton = document.getElementById('convertButton');
const eraseButton = document.getElementById('eraseButton');
const chatBox = document.getElementById('chatBox');
const output = document.getElementById('output');
const toEnglish = document.getElementById('toEnglish');
const toHindi = document.getElementById('toHindi');

let recognition;
let isRecording = false;

// ✅ Speech Recognition
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatBox.value = transcript;
  };

  recognition.onend = () => {
    isRecording = false;
    micButton.textContent = '🎤 Start Recording';
  };
} else {
  micButton.disabled = true;
  alert('Your browser does not support speech recognition.');
}

// 🎤 Start/Stop Recording
micButton.addEventListener('click', () => {
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
    isRecording = true;
    micButton.textContent = '🛑 Stop Recording';
  }
});

// 🔊 Speak (Female Voice)
convertButton.addEventListener('click', () => {
  const textToRead = chatBox.value;
  if (!textToRead.trim()) return;

  const utterance = new SpeechSynthesisUtterance(textToRead);

  // Pick female voice
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Google UK English Female'));
  if (femaleVoice) utterance.voice = femaleVoice;

  speechSynthesis.cancel(); // stop any previous speech
  speechSynthesis.speak(utterance);
});

// 🗑️ Erase text
eraseButton.addEventListener('click', () => {
  chatBox.value = "";
  speechSynthesis.cancel();
});

// 🌐 Translate to English
toEnglish.addEventListener('click', () => {
  const text = chatBox.value;
  if (!text.trim()) return;

  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hi|en`)
    .then(res => res.json())
    .then(data => {
      chatBox.value = data.responseData.translatedText;
    });
});

// 🌐 Translate to Hindi
toHindi.addEventListener('click', () => {
  const text = chatBox.value;
  if (!text.trim()) return;

  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`)
    .then(res => res.json())
    .then(data => {
      chatBox.value = data.responseData.translatedText;
    });
});
