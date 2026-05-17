// =========================================
// サーバーステータス表示機能
// mcsrvstat.us API使用
// =========================================

const ServerStatus = {
    // サーバーアドレス（環境に合わせて変更）[memo:play.hknw.link]

    // 更新間隔（ミリ秒）- 1分
    UPDATE_INTERVAL: 60000,

    // タイマーID
    timer: null,

    // 初期化
    init: function () {
        this.loadStatus();
        this.startAutoUpdate();
        this.bindEvents();
    },

    // イベントバインド
    bindEvents: function () {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadStatus(true));
        }
    },

    // 自動更新開始
    startAutoUpdate: function () {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.loadStatus(), this.UPDATE_INTERVAL);
    },

    // 自動更新停止
    stopAutoUpdate: function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    // ステータス読み込み
    loadStatus: async function (showAlert = false) {
        try {
            // ローディング表示
            this.setLoading(true);

            const response = await fetch(`https://api.mcsrvstat.us/3/play.hknw.link`, {
                headers: {
                    'User-Agent': 'HakoniwaCraft-Website/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.updateUI(data);

            if (showAlert) {
                console.log('サーバーステータスを更新しました');
            }
        } catch (error) {
            console.error('サーバーステータス取得エラー:', error);
            this.showError();
        } finally {
            this.setLoading(false);
        }
    },

    // UI更新
    updateUI: function (data) {
        const iconElement = document.getElementById('server-icon');
        const statusElement = document.getElementById('status-text');
        const motdBox = document.getElementById('motd-box');
        const playerCount = document.getElementById('player-count');
        const serverVersion = document.getElementById('server-version');
        const serverIp = document.getElementById('server-ip-address');
        const serverSoftware = document.getElementById('server-software');
        const serverIcon = document.getElementById('server-icon');
        const displayAddress = document.getElementById('display-address');

        if (data.online) {
            // オンライン時の表示
            if (statusElement) {
                statusElement.textContent = '● オンライン';
                statusElement.className = 'status-badge online';
            }
            if (iconElement) {
                if (data.icon) {
                    iconElement.src = data.icon;
                    iconElement.alt = 'サーバーアイコン';
                } else {
                    // アイコンがない場合はデフォルトアイコンを設定
                    iconElement.src = '/images/webp/server_icon.webp';
                    iconElement.alt = data.motd && data.motd.clean ? data.motd.clean.join(' ') : '箱庭クラフト サーバー';
                }
            }

            // MOTD
            if (motdBox && data.motd && data.motd.html) {
                motdBox.innerHTML = data.motd.html.join('<br>');
            } else if (motdBox && data.motd && data.motd.clean) {
                motdBox.textContent = data.motd.clean.join(' ');
            } else {
                motdBox.textContent = '箱庭クラフト - ようこそ！';
            }

            // プレイヤー数
            if (playerCount && data.players) {
                playerCount.textContent = `${data.players.online || 0} / ${data.players.max || 0}`;
            }

            // バージョン
            if (serverVersion) {
                if (data.version) {
                    serverVersion.textContent = data.version;
                } else if (data.protocol && data.protocol.name) {
                    serverVersion.textContent = data.protocol.name;
                } else {
                    serverVersion.textContent = '1.21.4';
                }
            }


            // ソフトウェア
            if (serverSoftware) {
                serverSoftware.textContent = data.software || 'Paper 1.21.4';
            }

            // サーバーアイコン
            if (serverIcon && data.icon) {
                serverIcon.src = data.icon;
            }

            // 表示アドレス
            if (displayAddress) {
                displayAddress.textContent = this.SERVER_ADDRESS;
            }

        } else {
            // オフライン時の表示
            if (statusElement) {
                statusElement.textContent = '● オフライン';
                statusElement.className = 'status-badge offline';
            }

            if (motdBox) {
                motdBox.innerHTML = '⚠️ サーバーは現在オフラインです。<br>しばらく経ってから再度お試しください。';
            }

            if (playerCount) playerCount.textContent = '- / -';
            if (serverVersion) serverVersion.textContent = '-';
            if (serverIp) serverIp.textContent = '-';
            if (serverSoftware) serverSoftware.textContent = '-';
        }
    },

    // エラー表示
    showError: function () {
        const statusElement = document.getElementById('status-text');
        const motdBox = document.getElementById('motd-box');

        if (statusElement) {
            statusElement.textContent = '● エラー';
            statusElement.className = 'status-badge offline';
        }

        if (motdBox) {
            motdBox.innerHTML = '⚠️ ステータス情報を取得できませんでした。<br>ネットワーク接続を確認してください。';
        }
    },

    // ローディング表示
    setLoading: function (isLoading) {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.disabled = isLoading;
            refreshBtn.textContent = isLoading ? '🔄 更新中...' : '🔄 ステータスを更新';
        }
    }
};

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ServerStatus.init());
} else {
    ServerStatus.init();
}

// 外部公開
window.ServerStatus = ServerStatus;