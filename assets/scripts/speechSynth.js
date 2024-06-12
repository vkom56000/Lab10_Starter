const synth = window.speechSynthesis;
let voices;
let volume = 0.5;

window.addEventListener('DOMContentLoaded', init);

function init() {
  setTimeout(() => populateVoices(), 50);
  bindListeners();
}

function populateVoices() {
  const voiceSelect = document.querySelector('#voice-select');
  voices = synth.getVoices();
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.innerHTML = `${voice.name} (${voice.lang})`;
    option.setAttribute('value', `${voice.name} (${voice.lang})`);
    option.setAttribute('data-index', voiceSelect.children.length - 1);
    voiceSelect.appendChild(option);
  });
}

function bindListeners() {
  const talkBtn = document.querySelector('#explore > button');
  const textarea = document.querySelector('#explore > textarea');
  const volumeControl = document.querySelector('#volume');

  talkBtn.addEventListener('click', () => {
    let textToSpeak = textarea.value;
    let utterThis = new SpeechSynthesisUtterance(textToSpeak);
    utterThis.voice = voices[getOptionIndex()];
    utterThis.volume = volume; // Set the volume of the speech synthesis
    synth.speak(utterThis);
    openMouth();
  });

  if (volumeControl) {
    volumeControl.addEventListener('input', updateVolume);
  }
}

function getOptionIndex() {
  const voiceSelect = document.querySelector('#voice-select');
  const option = voiceSelect.options[voiceSelect.selectedIndex];
  return option.getAttribute('data-index');
}

function updateVolume() {
  const volumeControl = document.querySelector('#volume');
  volume = volumeControl.value / 100;

  const volumeImg = document.querySelector('#volume-controls > img');
  let volumeLevel = 3;
  switch (true) {
    case (volumeControl.value == 0):
      volumeLevel = 0;
      break;
    case (volumeControl.value < 33):
      volumeLevel = 1;
      break;
    case (volumeControl.value < 67):
      volumeLevel = 2;
      break;
  }
  volumeImg.setAttribute('src', `assets/icons/volume-level-${volumeLevel}.svg`);
}

function openMouth() {
  let face = document.querySelector('#explore > img');
  face.setAttribute('src', 'assets/images/smiling-open.png');
  setTimeout(() => {
    if (synth.speaking) {
      openMouth();
    } else {
      face.setAttribute('src', 'assets/images/smiling.png');
    }
  }, 100);
}
