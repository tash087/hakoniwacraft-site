document.addEventListener("DOMContentLoaded", function() {

    // --- 1. 基本情報の取得と表示 ---
    
    // ユーザーエージェント
    document.getElementById("user-agent").textContent = navigator.userAgent;
    
    // 言語
    document.getElementById("language").textContent = navigator.language || navigator.userLanguage || "取得できませんでした";
    
    // モニタサイズ
    const width = window.screen.width;
    const height = window.screen.height;
    document.getElementById("screen-size").textContent = `${width} × ${height} ピクセル`;
    
    // モニタ表示色 (色深度)
    document.getElementById("color-depth").textContent = `${window.screen.colorDepth} ビット`;
    
    // リファラ（どこから来たか）
    document.getElementById("referrer").textContent = document.referrer || "（お使いのブラウザから取得できませんでした）";
    
    // ブラウザ情報
    document.getElementById("app-code-name").textContent = navigator.appCodeName;
    document.getElementById("app-name").textContent = navigator.appName;
    document.getElementById("platform").textContent = navigator.platform;
    
    // クッキー・Javaの有効性
    document.getElementById("cookie-enabled").textContent = navigator.cookieEnabled ? "true (利用可能)" : "false (利用不可)";
    
    // javaEnabledはメソッドなので実行して判定
    try {
        document.getElementById("java-enabled").textContent = navigator.javaEnabled() ? "true (利用可能)" : "false (利用不可)";
    } catch(e) {
        document.getElementById("java-enabled").textContent = "利用不可 / 非対応";
    }

    // パソコンの現在日時
    const now = new Date();
    document.getElementById("current-time").textContent = now.toLocaleString();

    // プラグイン情報 (セキュリティ対策により現代のブラウザでは限定的な情報のみ返されます)
    if (navigator.plugins && navigator.plugins.length > 0) {
        let pluginList = [];
        for (let i = 0; i < Math.min(navigator.plugins.length, 5); i++) { // 最大5つ表示
            pluginList.push(`${i+1}. ${navigator.plugins[i].name}`);
        }
        if (navigator.plugins.length > 5) {
            pluginList.push(`他 ${navigator.plugins.length - 5} 件のプラグイン...`);
        }
        document.getElementById("plugins-info").innerHTML = pluginList.join("<br>");
    } else {
        document.getElementById("plugins-info").textContent = "検出されなかったか、ブラウザにより保護されています。";
    }


    // --- 2. IPアドレスの取得 (外部パブリックAPIを利用) ---
    // ※JavaScript(フロントエンド)単体では自分のパブリックIPアドレスを知ることができないため、
    // 無料のIP確認サービス「ipify」に非同期通信を行って取得します。
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("ip-address").textContent = data.ip;
        })
        .catch(error => {
            document.getElementById("ip-address").textContent = "取得に失敗しました (広告ブロック等により拒否された可能性があります)";
            console.error("IP取得エラー:", error);
        });


    // --- 3. 位置情報取得 (Geolocation API) ---
    const locationBtn = document.getElementById("get-location-btn");
    const latTd = document.getElementById("geo-latitude");
    const lonTd = document.getElementById("geo-longitude");
    const statusTd = document.getElementById("geo-status");

    locationBtn.addEventListener("click", function() {
        if (!navigator.geolocation) {
            statusTd.textContent = "お使いのブラウザは位置情報に対応していません。";
            return;
        }

        statusTd.textContent = "位置情報を要求中（ブラウザの許可ダイアログを確認してください）...";

        navigator.geolocation.getCurrentPosition(
            // 取得成功時のコールバック
            function(position) {
                latTd.textContent = position.coords.latitude.toFixed(6) + " 度";
                lonTd.textContent = position.coords.longitude.toFixed(6) + " 度";
                statusTd.textContent = "取得成功";
            },
            // 取得失敗・拒否時のコールバック
            function(error) {
                latTd.textContent = "-";
                lonTd.textContent = "-";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        statusTd.textContent = "エラー: 位置情報の利用がユーザーによって拒否されました。";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        statusTd.textContent = "エラー: 位置情報が利用できません（GPS信号オフなど）。";
                        break;
                    case error.TIMEOUT:
                        statusTd.textContent = "エラー: タイムアウトしました。";
                        break;
                    default:
                        statusTd.textContent = "エラー: 不明なエラーが発生しました。";
                        break;
                }
            },
            // オプション
            {
                enableHighAccuracy: true, // 高精度GPS等の使用
                timeout: 10000,           // 10秒でタイムアウト
                maximumAge: 0             // キャッシュされた位置情報は使わない
            }
        );
    });
});