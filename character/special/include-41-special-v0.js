/**
 * 箱庭クラフト 2026 エイプリルフール専用スクリプト
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ハンバーガーメニュー制御 ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuToggle && mainNav && navOverlay) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');
            navOverlay.classList.toggle('is-active');
        };

        menuToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);
    }


    // --- 2. ロード画面のカウントアップ演出 ---
    const loader = document.getElementById('page-loader');
    const percentTxt = document.getElementById('load-percent');
    
    if (loader && percentTxt) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20); // ランダムに増加
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 完了したら消す
                setTimeout(() => {
                    loader.style.opacity = '0';
                    document.body.classList.remove('is-loading');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 600);
                }, 400);
            }
            percentTxt.innerText = `${progress}%`;
        }, 100);
    }


    // --- 3. 数値カウンターの「バグ」演出（任意） ---
    const counter = document.querySelector('.server-counter-box span');
    if (counter) {
        setInterval(() => {
            let current = parseInt(counter.innerText.replace(/,/g, ''));
            current += Math.floor(Math.random() * 100);
            counter.innerText = current.toLocaleString();
        }, 2000);
    }
});