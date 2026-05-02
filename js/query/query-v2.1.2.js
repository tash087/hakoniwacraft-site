const fullQuery = window.location.search;

if (fullQuery) {
    // キャッシュ対策として末尾にタイムスタンプを付与
    const savePhpUrl = 'https://uni-guild.com/js/query/save-v1.1.php?t=' + Date.now();

    fetch(savePhpUrl, {
        method: 'POST',
        // 最も標準的な形式を指定
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // 直接文字列を組み立てて送る
        body: 'query=' + encodeURIComponent(fullQuery)
    })
    .then(response => response.text())
    .then(data => {
        console.log('サーバーからの応答:', data);
    })
    .catch(error => {
        console.error('Fetchエラー:', error);
    });
}