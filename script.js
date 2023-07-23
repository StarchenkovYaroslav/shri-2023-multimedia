const videosSrc = [
    'http://localhost:3000/vids/1.mp4',
    'http://localhost:3000/vids/2.mp4',
    'http://localhost:3000/vids/3.mp4',
    'http://localhost:3000/vids/4.mp4',
    'http://localhost:3000/vids/5.mp4',
];

const MAX_SLIDER_WIDTH = 400;
const initialBrightness = 100
const initialContrast = 100

let playingVideoIndex = 0

let videosElements
let progressBarsElements
let storiesElement

start()

function start() {
    render()
    init()
}

function render() {
    const progressContainer = document.querySelector('.progress');
    storiesElement = document.querySelector('.stories');

    const videos = videosSrc.map((src, index) => {
        return `<div class="stories__story">
                    <video id="video-${index}" class="stories__video" src="${src}" muted></video>
                </div>`
    }).join('')

    const progressBars = videosSrc.map((_src, index) => {
        return `<span class="progress__bar">
                    <span id="progress-${index}" class="progress__bar-value"></span>
                </span>`
    }).join('')

    storiesElement.insertAdjacentHTML(
        'beforeend',
        videos,
    );

    progressContainer.insertAdjacentHTML(
        'beforeend',
        progressBars,
    );
}

function init() {
    videosElements = Array.from(document.querySelectorAll('.stories__video'))
        .sort((video_1, video_2) => {
            return getVideoId(video_1) - getVideoId(video_2)
        })

    progressBarsElements = Array.from(document.querySelectorAll('.progress__bar'))
        .sort((progressBar_1, progressBar_2) => {
            return getProgressBarId(progressBar_1) - getProgressBarId(progressBar_2)
        })


    videosElements
        .forEach((currVideo, currVideoIndex, videos) => {
            currVideo.onended = (evt) => {
                if (currVideoIndex < videos.length - 1) {
                    changeVideo(evt.target, currVideoIndex + 1)
                }

            }

            currVideo.ontimeupdate = (evt) => {
                const currVideo = evt.target
                const progressBar = progressBarsElements[getVideoId(evt.target)]
                const progressBarValue = progressBar.querySelector('.progress__bar-value')

                progressBarValue.style.transform = `scaleX(${currVideo.currentTime / currVideo.duration})`
            }
        })

    document.querySelector('#next-button').addEventListener('click', () => {
        if (playingVideoIndex < videosElements.length - 1) {
            videosElements[playingVideoIndex].currentTime = videosElements[playingVideoIndex].duration
        }
    })

    document.querySelector('#previous-button').addEventListener('click', () => {
        const currVideo = videosElements[playingVideoIndex]

        if (currVideo.currentTime / currVideo.duration > 0.3) {
            currVideo.currentTime = 0
            if (currVideo.paused) {
                currVideo.play()
            }
        } else if (playingVideoIndex > 0) {
            changeVideo(currVideo, playingVideoIndex - 1, true)
        }
    })

    const brightnessInput = document.querySelector('#brightness-input')
    const contrastInput = document.querySelector('#contrast-input')

    const brightnessValue = document.querySelector('#brightness-input-value')
    const contrastValue = document.querySelector('#contrast-input-value')

    brightnessInput.oninput = (evt) => {
        brightnessValue.textContent = evt.target.value
        videosElements.forEach(videElement => {
            videElement.style.filter =
                `brightness(${evt.target.value / 100}) contrast(${contrastInput.value / 100})`
        })
    }

    contrastInput.oninput = (evt) => {
        contrastValue.textContent = evt.target.value
        videosElements.forEach(videElement => {
            videElement.style.filter =
                `brightness(${brightnessInput.value / 100}) contrast(${evt.target.value / 100})`
        })
    }

    storiesElement.onclick = () => {
        if (videosElements[playingVideoIndex].paused) {
            videosElements[playingVideoIndex].play()
        } else {
            videosElements[playingVideoIndex].pause()
        }
    }

    brightnessInput.value = initialBrightness
    contrastInput.value = initialContrast

    brightnessValue.textContent = String(initialBrightness)
    contrastValue.textContent = String(initialContrast)

    videosElements[playingVideoIndex].style.filter = 'brightness(1) contrast(1)'
    toggleVideoVisibility(videosElements[playingVideoIndex])
    videosElements[playingVideoIndex].play()
}

function changeVideo(videoToPause, videoToPlayIndex, back) {
    const videoToPlay = videosElements[videoToPlayIndex]

    toggleVideoVisibility(videoToPause)
    toggleVideoVisibility(videoToPlay)

    if (back) {
        videoToPause.currentTime = 0
    }
    videoToPause.pause()

    videoToPlay.play()

    playingVideoIndex = videoToPlayIndex
}

function getVideoId(video) {
    return Number(video.id.replace('video-', ''))
}

function getProgressBarId(progressBar) {
    return Number(progressBar.id.replace('progress-', ''))
}

function toggleVideoVisibility(video) {
    video.classList.toggle('stories__video_visible')
}
