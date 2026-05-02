/**
 * URL指定で外部HTMLを読み込む関数
 * @param {string} url - 読み込むHTMLのフルURLまたはパス
 * @param {string} targetSelector - 挿入先の要素セレクタ
 */
async function loadExternalHTML(url, targetSelector) {
    try {
        // キャッシュバスター（?v=...）を付与して最新のファイルを強制取得
        const fetchUrl = `${url}?v=${new Date().getTime()}`;
        const response = await fetch(fetchUrl);
        
        if (!response.ok) throw new Error(`HTTPエラー! ステータス: ${response.status}`);
        
        const html = await response.text();
        const target = document.querySelector(targetSelector);
        
        if (target) {
            target.innerHTML = html;
        } else {
            console.warn(`ターゲットが見つかりません: ${targetSelector}`);
        }
    } catch (error) {
        console.error("HTML読み込み失敗:", error);
    }
}

/**
 * メイン初期化処理
 */
document.addEventListener("DOMContentLoaded", async function() {
    // --- 1. URLの定義 ---
    // あなたのドメインに合わせてここを変更してください
    const BASE_URL = 'https://uni-guild.com/common/'; 
    const headerUrl = BASE_URL + 'header-41-v1.0.5.html';
    const footerUrl = BASE_URL + 'footer-41-v1.1.html';

    // --- 2. 非同期で読み込みを実行 ---
    // 並列で読み込むことで速度を向上させます
    await Promise.all([
        loadExternalHTML(headerUrl, '#header-container'),
        loadExternalHTML(footerUrl, '#footer-container')
    ]);

    // --- 3. 読み込み完了後のギミック開始 ---
    initFooterCounter();

    // --- 4. ロード画面解除ロジック ---
    const hideLoader = () => {
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 600);
            }
        }, 1200);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    // --- 5. インタラクション（既存ギミック） ---
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