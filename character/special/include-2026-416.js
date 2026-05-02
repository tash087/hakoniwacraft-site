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
    // --- 1. 定義とHTML読み込み ---
    const BASE_URL = 'https://uni-guild.com/common/'; 
    const headerUrl = BASE_URL + 'header-41-v1.0.6.html';
    const footerUrl = BASE_URL + 'footer-41-v1.1.html';

    // ヘッダー・フッターの読み込みを開始
    const loadAssets = Promise.all([
        loadExternalHTML(headerUrl, '#header-container'),
        loadExternalHTML(footerUrl, '#footer-container')
    ]);

    // --- 2. 豪華なカウントアップ演出 ---
    const loader = document.getElementById('page-loader');
    const percentTxt = document.getElementById('load-percent');
    let progress = 0;

    // カウントアップのタイマー（読み込みを「じわじわ」見せる）
    const progressTimer = setInterval(() => {
        // 90%まではランダムに増えるが、最後は慎重に
        if (progress < 90) {
            progress += Math.floor(Math.random() * 3) + 1; // 1〜3ずつ増える
        } else if (progress < 99) {
            progress += 0.5; // 90%を超えたら超スローダウン
        }

        if (percentTxt) {
            percentTxt.innerText = `${Math.floor(progress)}%`;
        }
    }, 80); // 更新間隔

    // 全ての準備（外部HTML + ページ全体のLoadイベント）が整うのを待つ
    window.addEventListener('load', async () => {
        await loadAssets; // HTMLの読み込み完了を待機
        
        // 外部読み込みが終わっても、少しの間「溜め」を作る
        setTimeout(() => {
            clearInterval(progressTimer); // タイマー停止
            
            // 一気に100%へ
            progress = 100;
            if (percentTxt) percentTxt.innerText = "100%";
            if (percentTxt) percentTxt.style.color = "#0f0"; // 完了で緑色に（お好みで）

            // 100%になってから少し余韻を残して消す
            setTimeout(() => {
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        // 読み込み完了後にカウンター開始
                        initFooterCounter();
                    }, 600);
                }
            }, 500);
        }, 2000); // ここで「最低2秒」は必ず表示されるように遅延させています
    });

    // --- 3. インタラクション（既存ギミック） ---
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

/**
 * カウンター数値更新
 */
function initFooterCounter() {
    const counterElement = document.getElementById('entity-counter');
    if (!counterElement) return;

    setInterval(() => {
        let currentNum = parseInt(counterElement.innerText.replace(/,/g, ''));
        if (isNaN(currentNum)) return;

        currentNum += Math.floor(Math.random() * 155) + 1;
        counterElement.innerText = currentNum.toLocaleString();
        
        if (Math.random() > 0.9) {
            counterElement.style.color = "#ff0";
            setTimeout(() => { counterElement.style.color = "#fff"; }, 100);
        }
    }, 2500);
}

// 共通エフェクト関数
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