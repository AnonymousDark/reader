document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');
    const readButton = document.getElementById('readButton');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const rewindButton = document.getElementById('rewindButton');
    const forwardButton = document.getElementById('forwardButton');
    const stopButton = document.getElementById('stopButton');
    const themeToggleButton = document.getElementById('themeToggleButton');
    const themeIcon = document.getElementById('themeIcon');

    let voices = [];
    let utterance;
    let currentIndex = 0;
    let text = '';

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();
        updateVoiceList();
    }

    function updateVoiceList() {
        voiceSelect.innerHTML = '';
        voices.forEach((voice, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    function speak() {
        if (utterance) {
            speechSynthesis.cancel();
        }

        utterance = new SpeechSynthesisUtterance(text.slice(currentIndex));
        utterance.voice = voices[voiceSelect.value];
        utterance.rate = speedRange.value;

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                currentIndex = event.charIndex;
            }
        };

        utterance.onend = () => {
            currentIndex = 0;
            playButton.style.display = 'inline';
            pauseButton.style.display = 'none';
        };

        speechSynthesis.speak(utterance);
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline';
    }

    function readText() {
        text = textInput.value;
        currentIndex = 0;
        speak();
    }

    function pauseText() {
        speechSynthesis.pause();
        playButton.style.display = 'inline';
        pauseButton.style.display = 'none';
    }

    function playText() {
        speechSynthesis.resume();
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline';
    }

    function stopText() {
        speechSynthesis.cancel();
        currentIndex = 0;
        playButton.style.display = 'inline';
        pauseButton.style.display = 'none';
    }

    function rewindText() {
        currentIndex = Math.max(0, currentIndex - 10);
        speak();
    }

    function forwardText() {
        currentIndex = Math.min(text.length - 1, currentIndex + 10);
        speak();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark');
        themeIcon.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                textInput.value = e.target.result;
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid text file.');
        }
    });

    speedRange.addEventListener('input', () => {
        speedValue.textContent = speedRange.value;
    });

    readButton.addEventListener('click', readText);
    playButton.addEventListener('click', playText);
    pauseButton.addEventListener('click', pauseText);
    stopButton.addEventListener('click', stopText);
    rewindButton.addEventListener('click', rewindText);
    forwardButton.addEventListener('click', forwardText);

    themeToggleButton.addEventListener('click', toggleTheme);

    if (typeof speechSynthesis !== 'undefined') {
        populateVoiceList();
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
});
