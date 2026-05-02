/**
 * 箱庭クラフト 共通スクリプト (include.js)
 * エラー(ReferenceError)を回避するため、関数定義を先頭に配置
 */

// --- 1. アニメーション・ユーティリティ関数 ---
function closeBannerAnimation(el) {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px) scale(0.95)";
    setTimeout(() => { el.remove(); }, 400);
}

// --- 2. メニュー・ログイン関連関数 ---
// --- 2. メニュー・ログイン関連関数 ---
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.onclick = function() {
            // aria-expanded の状態を反転（アクセシビリティ向上）
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            
            // CSSアニメーション用のクラス付与
            this.classList.toggle('active'); // 三本線の変形用
            mainNav.classList.toggle('open');  // メニュー表示用
            
            // メニューが開いている間は背景スクロールを禁止
            document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        };
    }
}

function loadLoginMenu() {
    const navUl = document.querySelector('#main-nav ul');
    if (!navUl) return;

    fetch('/common/login-infomation.html')
        .then(res => res.text())
        .then(htmlData => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const userRole = localStorage.getItem('userRole');
            const userName = localStorage.getItem('userName') || 'メンバー';

            let targetId = 'auth-guest';
            if (isLoggedIn === 'true') {
                if (userRole === 'admin') targetId = 'auth-admin';
                else if (userRole === 'donator') targetId = 'auth-donator';
            }

            const selectedMenu = tempDiv.querySelector(`#${targetId}`);
            if (selectedMenu) {
                const nameSpan = selectedMenu.querySelector('.user-display-name');
                if (nameSpan) nameSpan.textContent = userName + "さん";
                navUl.querySelectorAll('.dynamic-auth').forEach(n => n.remove());
                const fragment = document.createRange().createContextualFragment(selectedMenu.innerHTML);
                Array.from(fragment.children).forEach(child => child.classList.add('dynamic-auth'));
                navUl.appendChild(fragment);
            }
        }).catch(err => console.error("Login info error:", err));
}

// --- 3. クッキー関連関数 ---
function loadExternalPerformanceScripts() {
    const GA_ID = 'G-XXXXXXXXXX'; // 自身のIDに
    if (!GA_ID.startsWith('G-')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID);
}

function loadCookieUI(path) {
    fetch(path)
        .then(res => res.text())
        .then(data => {
            const existing = document.getElementById('cookie-banner');
            if (existing) existing.remove();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            const banner = tempDiv.firstElementChild;
            const placeholder = document.getElementById('cookie-placeholder') || document.body;
            placeholder.appendChild(banner);

            document.getElementById('btn-cookie-accept').onclick = () => {
                localStorage.setItem("cookie_accepted", "true");
                localStorage.setItem("cookie_settings", JSON.stringify({performance: true, updated: new Date()}));
                closeBannerAnimation(banner);
                loadExternalPerformanceScripts();
            };
            document.getElementById('btn-cookie-close').onclick = () => closeBannerAnimation(banner);
            document.getElementById('btn-goto-settings').onclick = (e) => {
                e.preventDefault();
                window.location.href = '/pages/cookie-settings-page.html';
            };
        }).catch(err => console.error("Cookie UI error:", err));
}

function setupCookieBanner() {
    const settings = JSON.parse(localStorage.getItem("cookie_settings") || '{}');
    if (settings.performance === true) loadExternalPerformanceScripts();
    if (localStorage.getItem("cookie_accepted") !== "true") {
        loadCookieUI('/common/cookie-process.html');
    }
}

function initCookieSettingsButtons() {
    document.querySelectorAll('.ot-sdk-show-settings').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            window.location.href = '/pages/cookie-settings-page.html';
        };
    });
}

// --- 4. 実行セクション (DOMContentLoaded) ---
document.addEventListener("DOMContentLoaded", function() {
    // ヘッダー
    fetch('/common/header.html')
        .then(res => res.text())
        .then(data => {
            const hp = document.getElementById('header-placeholder');
            if (hp) { hp.innerHTML = data; initMobileMenu(); loadLoginMenu(); }
        }).catch(err => console.error("Header error:", err));

    // フッター
    fetch('/common/footer.html')
        .then(res => res.text())
        .then(data => {
            const fp = document.getElementById('footer-placeholder');
            if (fp) { fp.innerHTML = data; initCookieSettingsButtons(); }
        }).catch(err => console.error("Footer error:", err));

    // クッキー
    setupCookieBanner();
});

// グローバル関数
window.logoutProcess = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    location.reload();
};