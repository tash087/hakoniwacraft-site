// =========================================
// ダークモード切り替え機能
// ヘッダー内の指定コンテナに対応
// =========================================

const DarkMode = {
    // ストレージキー
    STORAGE_KEY: 'hakoniwa-dark-mode',
    
    // 現在の状態
    isDark: false,
    
    // 初期化
    init: function() {
        // 保存された設定を読み込み
        const saved = localStorage.getItem(this.STORAGE_KEY);
        
        if (saved !== null) {
            this.isDark = saved === 'true';
        } else {
            // システム設定を検出
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        this.apply();
        
        // ヘッダーの動的読み込みを待つ（include.js対策）
        this.waitForHeaderAndCreateButton();
    },
    
    // ヘッダー読み込み待機してボタン作成
    waitForHeaderAndCreateButton: function() {
        // 既に#dark-mode-containerがある場合は即座に作成
        if (document.getElementById('dark-mode-container')) {
            this.createToggleButton();
            return;
        }
        
        // ヘッダー読み込みを監視
        let attempts = 0;
        const maxAttempts = 50; // 5秒
        const checkInterval = setInterval(() => {
            attempts++;
            
            // 対象のコンテナまたはヘッダーが見つかった場合
            if (document.getElementById('dark-mode-container') || 
                document.querySelector('header, #header-placeholder')) {
                clearInterval(checkInterval);
                this.createToggleButton();
            }
            
            // タイムアウト（最終手段）
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                this.createToggleButton();
            }
        }, 100);
    },
    
    // ダークモード適用
    apply: function() {
        if (this.isDark) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
        
        // ボタンの状態を更新
        this.updateButtonState();
    },
    
    // トグル
    toggle: function() {
        this.isDark = !this.isDark;
        localStorage.setItem(this.STORAGE_KEY, this.isDark);
        this.apply();
        
        // イベント発火（他のスクリプトが監視可能）
        window.dispatchEvent(new CustomEvent('darkmode-change', { 
            detail: { isDark: this.isDark } 
        }));
    },
    
    // ボタン作成
    createToggleButton: function() {
        // 既存のボタンがあれば削除
        const existingBtn = document.getElementById('dark-mode-toggle');
        if (existingBtn) existingBtn.remove();
        
        // ボタン作成
        const button = document.createElement('button');
        button.id = 'dark-mode-toggle';
        button.className = 'dark-mode-toggle-btn';
        button.setAttribute('aria-label', 'ダークモード切り替え');
        button.innerHTML = this.isDark ? '☀️' : '🌙';
        button.title = this.isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え';
        button.addEventListener('click', () => this.toggle());
        
        // 配置先を優先順位で決定
        // 1. #dark-mode-container があればそこに配置
        const customContainer = document.getElementById('dark-mode-container');
        if (customContainer) {
            customContainer.appendChild(button);
            return;
        }
        
        // 2. .header-inner を探す
        const headerInner = document.querySelector('.header-inner');
        if (headerInner) {
            headerInner.appendChild(button);
            return;
        }
        
        // 3. header または #header-placeholder を探す
        const header = document.querySelector('header, #header-placeholder');
        if (header) {
            header.appendChild(button);
            return;
        }
        
        // 4. 最後の手段: body の先頭に配置
        document.body.insertBefore(button, document.body.firstChild);
    },
    
    // ボタンの表示更新
    updateButtonState: function() {
        const button = document.getElementById('dark-mode-toggle');
        if (button) {
            button.innerHTML = this.isDark ? '☀️' : '🌙';
            button.title = this.isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え';
        }
    },
    
    // 現在の状態を取得
    getState: function() {
        return this.isDark;
    },
    
    // ライトモードに強制設定
    setLight: function() {
        if (this.isDark) {
            this.toggle();
        }
    },
    
    // ダークモードに強制設定
    setDark: function() {
        if (!this.isDark) {
            this.toggle();
        }
    }
};

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DarkMode.init());
} else {
    DarkMode.init();
}

// 外部公開
window.DarkMode = DarkMode;