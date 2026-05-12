// =========================================
// ブラウザ情報自動記録システム
// Google Apps Script連携版
// =========================================

const BrowserTracker = {
    // Google Apps ScriptのURL（あなたのものに変更してください）
    GAS_URL: 'https://script.google.com/macros/s/AKfycbyHhhUtVLohmJ4qp57Gt8aS6p7pzs0YDNQpyOpkFP56iOYSN7tvl8Np7Lkddcy3tE01bQ/exec',
    
    // 記録フラグ（重複防止）
    hasRecorded: false,
    
    // 初期化
    init: function() {
        if (this.hasRecorded) return;
        
        // ページ読み込み後に自動実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.recordAll());
        } else {
            this.recordAll();
        }
    },
    
    // 全ての情報を記録
    recordAll: async function() {
        if (this.hasRecorded) return;
        
        const browserInfo = this.getBrowserInfo();
        const ipInfo = await this.getIPAddress();
        const locationInfo = await this.getLocationInfo();
        
        const allData = {
            ...browserInfo,
            ...ipInfo,
            ...locationInfo,
            pageUrl: window.location.href,
            pageTitle: document.title,
            timestamp: new Date().toISOString(),
            localTime: new Date().toLocaleString('ja-JP')
        };
        
        this.sendToSheet(allData);
        this.hasRecorded = true;
    },
    
    // ブラウザ情報を取得
    getBrowserInfo: function() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language || navigator.userLanguage || 'unknown',
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            screenColorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1,
            referrer: document.referrer || 'direct',
            cookieEnabled: navigator.cookieEnabled,
            platform: navigator.platform,
            appName: navigator.appName,
            appCodeName: navigator.appCodeName,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            localTime: new Date().toLocaleString('ja-JP')
        };
    },
    
    // IPアドレスを取得
    getIPAddress: async function() {
        try {
            // 複数のIP取得サービスを試行
            const services = [
                'https://api.ipify.org?format=json',
                'https://api.my-ip.io/ip.json',
                'https://ipapi.co/json/'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service, { mode: 'cors' });
                    const data = await response.json();
                    
                    if (data.ip) {
                        return { ip: data.ip };
                    }
                    if (data.ip_address) {
                        return { ip: data.ip_address };
                    }
                } catch (e) {
                    continue;
                }
            }
            return { ip: '取得失敗', ipError: '一時的なエラー' };
        } catch (error) {
            console.error('IP取得エラー:', error);
            return { ip: '取得失敗', ipError: error.message };
        }
    },
    
    // 位置情報を取得（ユーザー許可が必要）
    getLocationInfo: function() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ geoStatus: '非対応', latitude: null, longitude: null });
                return;
            }
            
            // タイムアウト設定（5秒）
            const timeoutId = setTimeout(() => {
                resolve({ geoStatus: 'タイムアウト（ユーザー応答なし）', latitude: null, longitude: null });
            }, 5000);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    resolve({
                        geoStatus: '取得成功',
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    clearTimeout(timeoutId);
                    let errorMsg = '';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = 'ユーザーが拒否';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = '位置情報利用不可';
                            break;
                        case error.TIMEOUT:
                            errorMsg = 'タイムアウト';
                            break;
                        default:
                            errorMsg = '不明なエラー';
                    }
                    resolve({ geoStatus: errorMsg, latitude: null, longitude: null });
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
            );
        });
    },
    
    // Googleスプレッドシートに送信
    sendToSheet: function(data) {
        // fetchが使えない環境用のフォールバック（画像ビーコン）
        if (!window.fetch) {
            this.sendViaBeacon(data);
            return;
        }
        
        fetch(this.GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => {
            console.error('送信エラー:', err);
            this.sendViaBeacon(data);
        });
    },
    
    // ビーコンAPIで送信（フォールバック）
    sendViaBeacon: function(data) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(this.GAS_URL, blob);
    }
};

// 自動実行
BrowserTracker.init();

// 外部公開（デバッグ用）
window.BrowserTracker = BrowserTracker;