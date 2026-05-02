(function() {

    // 現在の情報を取得

    var logData = {

        u: window.location.href,    // フルURL

        q: window.location.search   // ?以降の文字列

    };



    // データを送信

    var target = 'https://uni-guild.com/admin/access-log/log.php';

    var params = '?u=' + encodeURIComponent(logData.u) + '&q=' + encodeURIComponent(logData.q) + '&t=' + Date.now();



    // ビーコン（送信専用）として実行

    if (navigator.sendBeacon) {

        navigator.sendBeacon(target + params);

    } else {

        fetch(target + params, { mode: 'no-cors' });

    }

})();