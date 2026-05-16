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

// --- 2. モバイルメニュー関連関数 ---
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        // 既存のイベントリスナーを削除して再設定（重複防止）
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.onclick = function (e) {
            e.stopPropagation();
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            this.classList.toggle('active');
            mainNav.classList.toggle('open');
            
            // メニューが開いている間は背景スクロールを禁止
            document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        };
        
        // メニュー内のリンククリック時に閉じる
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.onclick = () => {
                newToggle.classList.remove('active');
                mainNav.classList.remove('open');
                newToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            };
        });
    }
}

// --- 3. ドロップダウンメニューのタッチ対応（スマホ用）---
function initDropdowns() {
    if (window.innerWidth > 768) return; // PCはホバーでOK
    
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (!link || !content) return;
        
        // タップでドロップダウンを開閉
        link.onclick = (e) => {
            e.preventDefault();
            // 他のドロップダウンを閉じる
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open-dropdown');
                }
            });
            dropdown.classList.toggle('open-dropdown');
        };
        
        // ドロップダウン内のリンククリック時は閉じる
        content.querySelectorAll('a').forEach(subLink => {
            subLink.onclick = () => {
                dropdown.classList.remove('open-dropdown');
            };
        });
    });
}

// --- 4. クッキー関連関数 ---
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
            if (placeholder) placeholder.appendChild(banner);

            const acceptBtn = document.getElementById('btn-cookie-accept');
            const closeBtn = document.getElementById('btn-cookie-close');
            const settingsBtn = document.getElementById('btn-goto-settings');

            if (acceptBtn) {
                acceptBtn.onclick = () => {
                    localStorage.setItem("cookie_accepted", "true");
                    localStorage.setItem("cookie_settings", JSON.stringify({ performance: true, updated: new Date() }));
                    closeBannerAnimation(banner);
                };
            }
            if (closeBtn) closeBtn.onclick = () => closeBannerAnimation(banner);
            if (settingsBtn) {
                settingsBtn.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = '/pages/cookie-settings-page.html';
                };
            }
        }).catch(err => console.error("Cookie UI error:", err));
}

function setupCookieBanner() {
    const settings = JSON.parse(localStorage.getItem("cookie_settings") || '{}');
    if (settings.performance === true) {
        // loadExternalPerformanceScripts();
    }
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

// --- 5. カウンター初期化 ---
function initServerCounter() {
    if (typeof window.ServerCounter !== 'undefined') {
        window.ServerCounter.init();
    }
}

// --- 6. ヘッダー読み込み後の処理 ---
function onHeaderLoaded() {
    initMobileMenu();
    initDropdowns();
}

// --- 7. 実行セクション (DOMContentLoaded) ---
document.addEventListener("DOMContentLoaded", function () {
    // ヘッダー読み込み
    fetch('/common/header-v1.1.html')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(data => {
            const hp = document.getElementById('header-placeholder');
            if (hp) {
                hp.innerHTML = data;
                onHeaderLoaded(); // ヘッダー読み込み完了後に初期化
            }
        })
        .catch(err => console.error("Header error:", err));

    // フッター読み込み
    fetch('/common/footer-v1.0.html?t=' + Date.now())
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(data => {
            const fp = document.getElementById('footer-placeholder');
            if (fp) {
                fp.innerHTML = data;
                initCookieSettingsButtons();
                initServerCounter();
            }
        })
        .catch(err => console.error("Footer error:", err));

    // クッキーバナー（必要に応じて）
    // setupCookieBanner();
});

// グローバル関数
window.logoutProcess = function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    location.reload();
};