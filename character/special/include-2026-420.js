/**
 * URL指定で外部HTMLを読み込む関数
 */
async function loadExternalHTML(url, targetSelector) {
    try {
        const fetchUrl = `${url}?v=${new Date().getTime()}`;
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        const html = await response.text();
        const target = document.querySelector(targetSelector);
        if (target) {
            target.innerHTML = html;
        }
    } catch (error) {
        console.error("HTML読み込み失敗:", error);
    }
}

/**
 * メイン初期化処理
 */
document.addEventListener("DOMContentLoaded", async function() {
    const BASE_URL = 'https://uni-guild.com/common/'; 
    const headerUrl = BASE_URL + 'header-41-v1.0.6.html';
    const footerUrl = BASE_URL + 'footer-41-v1.1.html';

    const loadAssets = Promise.all([
        loadExternalHTML(headerUrl, '#header-container'),
        loadExternalHTML(footerUrl, '#footer-container')
    ]);

    // --- ロード演出ロジック ---
    const loader = document.getElementById('page-loader');
    const percentTxt = document.getElementById('load-percent');
    let progress = 0;
    let isFinished = false;

    // カウントアップタイマー
    const progressTimer = setInterval(() => {
        if (isFinished) return;

        if (progress < 85) {
            progress += Math.random() * 2; 
        } else if (progress < 99) {
            progress += 0.1; // スマホで画像が重いとここで止まって見えるのを防ぐ
        }

        if (percentTxt) {
            if (Math.random() > 0.98) {
                percentTxt.innerText = "ERR%";
            } else {
                percentTxt.innerText = `${Math.floor(progress)}%`;
            }
        }
    }, 60);

    // 終了処理
    const finishLoading = () => {
        if (isFinished) return;
        isFinished = true;
        clearInterval(progressTimer);

        if (percentTxt) {
            percentTxt.innerText = "100%";
            percentTxt.style.color = "#0f0";
            percentTxt.style.textShadow = "0 0 30px #0f0";
        }

        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initFooterCounter();
                }, 600);
            }
        }, 800);
    };

    // 【スマホ対策】画像が重すぎても5秒経ったら強制的に開く
    const forceTimer = setTimeout(finishLoading, 5000);

    window.addEventListener('load', async () => {
        await loadAssets; 
        clearTimeout(forceTimer); // 正常に読み込めたらタイマー解除
        setTimeout(finishLoading, 1500); // 溜めを作ってから終了
    });

    // --- インタラクション ---
    const visual = document.getElementById('target-visual');
    const img = document.getElementById('main-img');
    const charName = document.querySelector('.char-name-ja');

    if (visual) {
        let poreCount = 0;
        visual.addEventListener('click', (e) => {
            poreCount++;
            showFloatingText(`毛穴計数中... ${poreCount}`, 'red', e.clientX, e.clientY);
            if (poreCount > 15) {
                triggerGlitchedEffect("同時接続枠超過: 計測を中止してください");
                poreCount = 0;
            }
        });

        let movement = 0;
        visual.addEventListener('mousemove', () => {
            movement++;
            if (movement > 300) {
                showFloatingText("☕ 微糖の缶コーヒーを検知 ☕", "orange", window.innerWidth/2, window.innerHeight/2);
                visual.style.filter = "sepia(1) contrast(2)";
                setTimeout(() => visual.style.filter = "contrast(1.1)", 1000);
                movement = 0;
            }
        });
    }

    if (charName) {
        charName.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (img) {
                img.style.imageRendering = "pixelated";
                img.style.filter = "grayscale(1) contrast(0.5)";
            }
            alert("CRITICAL ERROR: 解像度が土ブロック(16bit)に退行しました。");
            setTimeout(() => location.reload(), 2000);
        });
    }
});

function initFooterCounter() {
    const counterElement = document.getElementById('entity-counter');
    if (!counterElement) return;
    setInterval(() => {
        let currentNum = parseInt(counterElement.innerText.replace(/,/g, ''));
        if (isNaN(currentNum)) return;
        currentNum += Math.floor(Math.random() * 155) + 1;
        counterElement.innerText = currentNum.toLocaleString();
    }, 2500);
}

function showFloatingText(text, color, x, y) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = `position:fixed; left:${x}px; top:${y}px; color:${color}; font-weight:bold; z-index:10000; pointer-events:none; animation:fadeOutUp 1s forwards;`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
}

function triggerGlitchedEffect(msg) {
    document.body.style.animation = "glitched 0.1s infinite";
    setTimeout(() => {
        alert(`[ERROR] ${msg}`);
        document.body.style.animation = "";
    }, 100);
}