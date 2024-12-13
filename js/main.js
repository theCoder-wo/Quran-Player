const container = document.querySelector(".container"),
  verseImg = container.querySelector(".img-area img"),
  verseName = container.querySelector(".song-details .name"),
  verseArtist = container.querySelector(".song-details .artist"),
  playPauseBtn = container.querySelector(".play-pause"),
  prevBtn = container.querySelector("#prev"),
  nextBtn = container.querySelector("#next"),
  mainAudio = container.querySelector("#main-audio"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  durationTime = container.querySelector(".max-duration"),
  repeatBtn = document.getElementById("repeat-plist"),
  displayPlaylist = document.getElementById("display-playlist"),
  playListContainer = document.getElementById("playlist-box");

let quranIndex = 0;
let isPlaying = false;

window.addEventListener("load", () => {
  loadVerse(quranIndex);
});

playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseVerse() : playVerse();
});

function loadVerse(quranIndex) {
  verseImg.src = allMusic[quranIndex].img;
  verseName.textContent = allMusic[quranIndex].name;
  verseArtist.textContent = allMusic[quranIndex].artist;
  mainAudio.src = allMusic[quranIndex].src;
}

function playVerse() {
  isPlaying = true;
  playPauseBtn.querySelector("i").innerHTML = "pause";
  mainAudio.play();
}

function pauseVerse() {
  isPlaying = false;
  playPauseBtn.querySelector("i").innerHTML = "play_arrow";
  mainAudio.pause();
}

// When I click on the Space Btn, Pause and run the audio:
document.addEventListener("keydown", (event) => {
  if (event.code == "Space") {
    if (mainAudio.paused) {
      playVerse();
    } else {
      pauseVerse();
    }
  }
});

// Next Verse Functionality:
nextBtn.addEventListener("click", () => {
  nextVerse();
});

function nextVerse() {
  quranIndex++;
  quranIndex > allMusic.length - 1
    ? (quranIndex = 0)
    : (quranIndex = quranIndex);
  loadVerse(quranIndex);
  playVerse();
}

// previous Verse Functionality:
prevBtn.addEventListener("click", () => {
  prevVerse();
});

const prevVerse = () => {
  quranIndex--;
  quranIndex < 0
    ? (quranIndex = allMusic.length - 1)
    : (quranIndex = quranIndex);
  loadVerse(quranIndex);
  playVerse();
};

// Repeat playlist, Repeat Song, and shuffling Functionality:
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerHTML;
  switch (getText) {
    case "repeat":
      repeatBtn.innerHTML = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one":
      repeatBtn.innerHTML = "shuffle";
      repeatBtn.setAttribute("title", "shuffling the playlist");
      break;
    case "shuffle":
      repeatBtn.innerHTML = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerHTML;
  switch (getText) {
    case "repeat":
      nextVerse();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadVerse(quranIndex);
      playVerse();
      break;
    case "shuffle":
      let randomIndex = Math.floor(Math.random() * allMusic.length);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length);
      } while (quranIndex == randomIndex);
      {
        quranIndex = randomIndex;
        loadVerse(quranIndex);
        playVerse();
        break;
      }
  }
});

//ProgressBar Functionality
mainAudio.addEventListener("timeupdate", (e) => {
  // Styling ProgressBar
  let currentTime = e.target.currentTime;
  let duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  mainAudio.addEventListener("loadeddata", () => {
    const interval = setInterval(() => {
      let currentTime = container.querySelector(".current-time");
      let _elapsed = mainAudio.currentTime;
      currentTime.innerHTML = formatTime(_elapsed);
    }, 1000);

    const _duration = mainAudio.duration;
    durationTime.innerHTML = formatTime(_duration);

    mainAudio.addEventListener("ended", () => {
      clearInterval(interval);
    });
  });
});

//Function for Formatting Time:
const formatTime = (time) => {
  if (time && !isNaN(time)) {
    let minutes =
      Math.floor(time / 60) < 10
        ? `0${Math.floor(time / 60)}`
        : `${Math.floor(time / 60)}`;
    let seconds =
      Math.floor(time % 60) < 10
        ? `0${Math.floor(time % 60)}`
        : `${Math.floor(time % 60)}`;
    return `${minutes}:${seconds}`;
  } else {
    return "00:00";
  }
};

// Handle the progress Area:
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let verseDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * verseDuration;

  playVerse();
});

// Dispaly the playlist of quran:
displayPlaylist.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent the click from propagating to the document

  playListContainer.innerHTML = "";

  playListContainer.classList.toggle("active");

  allMusic.forEach((verse, index) => {
    let li = document.createElement("li");
    li.textContent = `${verse.name}`;

    li.addEventListener("click", () => {
      loadVerse(index);
      playVerse();
      if (playListContainer.classList.contains("active")) {
        playListContainer.classList.remove("active");
      }
    });
    playListContainer.appendChild(li);
  });
});

// Click elsewhere on the screen, the active class will be removed:
document.addEventListener("click", () => {
  if (playListContainer.classList.contains("active")) {
    playListContainer.classList.remove("active");
  }
});
