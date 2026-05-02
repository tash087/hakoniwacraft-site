(function() {
    // キャッシュバスター用の数値（1分ごとに更新）
    var v = Math.floor(Date.now() / 60000); 
    
    // 自ドメインのベースURL（ここを自分のドメインにする）
    var baseUrl = 'https://uni-guild.com';

    // CSSのリスト（/から始まるルートパスで記述）
    var cssFiles = [
        '/css/common.css',
        '/css/style.css',
        '/css/staff.css',
        '/css/about-update.css'
    ];

    // JSのリスト
    var jsFiles = [
        '/js/day-count.js',
        '/js/slider.js',
        '../js/include.js',
        '/js/logger.js' // ログ収集用
    ];

    // CSSを追加
    cssFiles.forEach(function(file) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        // https:// + ドメイン + パス + クエリ
        link.href = baseUrl + file + '?v=' + v;
        document.head.appendChild(link);
    });

    // JSを追加
    jsFiles.forEach(function(file) {
        var script = document.createElement('script');
        // https:// を強制
        script.src = (file.indexOf('http') === 0) ? file : baseUrl + file + '?v=' + v;
        script.async = false;
        document.head.appendChild(script);
    });
})();