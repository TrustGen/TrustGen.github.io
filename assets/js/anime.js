
// script.js
const images = [
    // 'assets/img/background/background_1.jpg',
    'assets/img/background/18.jpg',
    // 'assets/img/background/30.jpg',
    'assets/img/background/37.jpg'
];
let currentIndex = 0;
const changeInterval = 10000; // 切换间隔，毫秒
function changeBackground() {
    const background = document.getElementById('background');
    currentIndex = (currentIndex + 1) % images.length;
    console.log(currentIndex);
    background.style.backgroundImage = `url('${images[currentIndex]}')`;
}

// 初始化时设置初始背景图片
document.addEventListener("DOMContentLoaded", () => {
    const background = document.getElementById('background');
    background.style.backgroundImage = `url('${images[currentIndex]}')`;
});

setInterval(changeBackground, changeInterval); // 每隔几秒切换背景




const textElement = document.querySelector('.title-text');
const messages = ['你好，我是一名刚入坑不久的大三在校生。', 'TrustGen', 'Trustworthy Generative Models'];

// 延时函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 打印逐字动画
async function typeText(message) {
    for (let i = 0; i <= message.length; i++) {
        textElement.innerHTML = message.slice(0, i);
        await delay(100); // 打字速度控制
    }
}

// 删除逐字动画
async function deleteText(message) {
    for (let i = message.length; i >= 0; i--) {
        textElement.innerHTML = message.slice(0, i);
        await delay(100); // 删除速度控制
    }
}

// 循环打印和删除
async function startTypingAnimation() {
    while (true) {
        for (const message of messages) {
            await typeText(message);
            await delay(1000); // 停留时间
            await deleteText(message);
        }
    }
}









document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("background-video");
    const backgroundContainer = document.querySelector(".img-background-container");
    const textContainer = document.getElementById("title-container");
    const logoContainer = document.getElementById("logo-img");

    // 当视频播放结束时，依次显示背景容器和文字
    video.addEventListener("ended", function () {
        backgroundContainer.style.display = "block"; // 显示背景容器
        video.classList.add("shrink"); // 缩小视频
        setTimeout(() => {
            backgroundContainer.style.opacity = 1; // 背景容器淡入
        }, 0);

        // 背景淡入完成后再显示文字容器
        setTimeout(() => {
            textContainer.style.opacity = 1;
            logoContainer.style.opacity = 1;
            textContainer.style.transform = "translateY(0)";
            // 开始打字动画
            startTypingAnimation();
        }, 1000); // 延迟文字显示，确保背景淡入完成
    });
});

