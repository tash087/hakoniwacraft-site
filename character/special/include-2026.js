/**
 * 外部HTMLの読み込み関数
 * @param {string} url - 読み込むHTMLのパス
 * @param {string} targetSelector - 挿入先の要素（bodyの最初や最後など）
 * @param {boolean} atStart - trueなら先頭に、falseなら末尾に挿入
 */
async function loadExternalHTML(url, targetSelector, atStart = false) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const html = await response.text();
        const target = document.querySelector(targetSelector);
        
        if (atStart) {
            target.insertAdjacentHTML('afterbegin', html);
        } else {
            target.insertAdjacentHTML('beforeend', html);
        }
    } catch (error) {
        console.error("HTML読み込みエラー:", error);
    }
}

/**
 * メイン初期化処理
 */
document.addEventListener("DOMContentLoaded", async function() {
    // --- 1. ヘッダーとフッターの読み込み ---
    // 非同期で読み込みが完了するのを待機（await）します
    await loadExternalHTML('common/header-41-v1.0.4.html', 'body', true);
    await loadExternalHTML('common/footer-41-v1.1.html', 'body', false);

    // --- 2. 外部HTML読み込み後に実行すべき処理 ---
    initFooterCounter(); // フッター内のカウンターを起動

    // --- 3. ロード画面の解除 ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 600);
            }
        }, 1200);
    });

    // --- 4. 既存の各種ギミック ---
    const visual = document.getElementById('target-visual');
    const img = document.getElementById('main-img');
    const charName = document.querySelector('.char-name-ja');

    if (visual) {
        // 【毛穴の計数】
        let poreCount = 0;
        visual.addEventListener('click', (e) => {
            poreCount++;
            showFloatingText(`毛穴計数中... ${poreCount}`, 'red', e.clientX, e.clientY);
            if (poreCount > 15) {
                triggerGlitchedEffect("同時接続枠超過: 計測を中止してください");
                poreCount = 0;
            }
        });

        // 【缶コーヒー検知】
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

    // 【過去の否定】
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
 * フッター・カウンター制御
 */
function initFooterCounter() {
    const counterElement = document.getElementById('entity-counter');
    if (!counterElement) return;

    setInterval(() => {
        let currentNum = parseInt(counterElement.innerText.replace(/,/g, ''));
        currentNum += Math.floor(Math.random() * 155) + 1;
        counterElement.innerText = currentNum.toLocaleString();
        
        if (Math.random() > 0.9) {
            counterElement.style.color = "#ff0";
            setTimeout(() => { counterElement.style.color = "#fff"; }, 100);
        }
    }, 2500);
}

// 共通関数（テキスト・エフェクト）
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