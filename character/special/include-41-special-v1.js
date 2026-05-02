/**
 * 箱庭クラフト 2026 エイプリルフール専用スクリプト
 * 「50,000dpi 実体化おじさん」完全統合版
 */

/**
 * URL指定で外部HTMLを読み込む関数
 */
async function loadExternalHTML(url, targetSelector) {
    try {
        const fetchUrl = `${url}?v=${new Date().getTime()}`; // キャッシュ対策
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

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. 外部HTML（ヘッダー・フッター）の読み込み ---
    // ※設置場所に合わせてBASE_URLを調整してください
    const BASE_URL = 'https://uni-guild.com/common/'; 
    await Promise.all([
        loadExternalHTML(BASE_URL + 'header-41-v1.0.5.html', '#header-container'),
        loadExternalHTML(BASE_URL + 'footer-41-v1.1.html', '#footer-container')
    ]);

    // --- 2. ロード画面のカウントアップ演出 ---
    const loader = document.getElementById('page-loader');
    const percentTxt = document.getElementById('load-percent'); // HTMLに <span id="load-percent">0%</span> がある場合
    
    if (loader) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    document.body.classList.remove('is-loading');
                    setTimeout(() => { loader.style.display = 'none'; }, 600);
                }, 500);
            }
            if (percentTxt) percentTxt.innerText = `${progress}%`;
        }, 120);
    }

    // --- 3. 50,000dpi 専用ギミック（画像・名前・警告） ---
    const visual = document.getElementById('target-visual');
    const img = document.getElementById('main-img');
    const charName = document.querySelector('.char-name-ja');

    if (visual) {
        // 【毛穴の計数】クリックイベント
        let poreCount = 0;
        visual.addEventListener('click', (e) => {
            poreCount++;
            showFloatingText(`毛穴計数中... ${poreCount}`, '#f00', e.clientX, e.clientY);
            if (poreCount > 15) {
                triggerGlitchedEffect("同時接続枠超過: 計測を中止してください");
                poreCount = 0;
            }
        });

        // 【缶コーヒー検知】マウス移動
        let movement = 0;
        visual.addEventListener('mousemove', () => {
            movement++;
            if (movement > 300) {
                showFloatingText("☕ 微糖の缶コーヒーを検知 ☕", "#ffae00", window.innerWidth/2, window.innerHeight/2);
                visual.style.filter = "sepia(1) contrast(2) saturate(2)";
                setTimeout(() => { visual.style.filter = ""; }, 1000);
                movement = 0;
            }
        });
    }

    // 【過去の否定】名前右クリックで16bit退行
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

    // --- 4. 数値カウンターの「異常増殖」演出 (フッター読み込み後に実行) ---
    initFooterCounter();
});

/**
 * フッター内のカウンター制御
 */
function initFooterCounter() {
    const counterElement = document.getElementById('entity-counter');
    if (!counterElement) return;

    setInterval(() => {
        let currentNum = parseInt(counterElement.innerText.replace(/,/g, ''));
        if (isNaN(currentNum)) return;

        currentNum += Math.floor(Math.random() * 155) + 1;
        counterElement.innerText = currentNum.toLocaleString();
        
        // 稀に発光
        if (Math.random() > 0.9) {
            counterElement.style.color = "#ff0";
            counterElement.style.textShadow = "0 0 20px #f00";
            setTimeout(() => { 
                counterElement.style.color = ""; 
                counterElement.style.textShadow = "";
            }, 150);
        }
    }, 2500);
}

/**
 * 浮遊テキスト表示用
 */
function showFloatingText(text, color, x, y) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = `
        position:fixed; left:${x}px; top:${y}px; color:${color}; 
        font-weight:bold; z-index:10000; pointer-events:none; 
        font-family:monospace; animation:fadeOutUp 1s forwards;
        text-shadow: 0 0 5px #000;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1000);
}

/**
 * 画面グリッチ・警告演出
 */
function triggerGlitchedEffect(msg) {
    document.body.style.animation = "glitched 0.1s infinite";
    const flash = document.createElement('div');
    flash.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,0,0,0.3); z-index:10001; pointer-events:none;";
    document.body.appendChild(flash);

    setTimeout(() => {
        alert(`[ERROR] ${msg}`);
        document.body.style.animation = "";
        flash.remove();
    }, 200);
}

// CSS用のアニメーション定義（JSから動的に追加）
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeOutUp {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-50px); }
}
`;
document.head.appendChild(style);