// =========================================
// ダークモード切り替え機能
// #dark-mode-container専用対応
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
        this.waitForContainerAndCreateButton();
    },
    
    // コンテナ読み込み待機してボタン作成
    waitForContainerAndCreateButton: function() {
        // 既に#dark-mode-containerがある場合は即座に作成
        if (document.getElementById('dark-mode-container')) {
            this.createToggleButton();
            return;
        }
        
        // コンテナ読み込みを監視（最大10秒）
        let attempts = 0;
        const maxAttempts = 100; // 10秒
        const checkInterval = setInterval(() => {
            attempts++;
            
            const container = document.getElementById('dark-mode-container');
            if (container) {
                clearInterval(checkInterval);
                this.createToggleButton();
            }
            
            // タイムアウト（最終手段）
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('DarkMode: #dark-mode-container not found after 10 seconds');
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
    
    // ボタン作成（#dark-mode-containerのみ対象）
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
        
        // #dark-mode-container に配置（必須）
        const container = document.getElementById('dark-mode-container');
        if (container) {
            container.appendChild(button);
        } else {
            // コンテナがない場合はエラー出力（ボタンは作成しない）
            console.error('DarkMode: #dark-mode-container not found. Button not created.');
        }
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