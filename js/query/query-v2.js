// ?以降を丸ごと取得
const fullQuery = window.location.search;

if (fullQuery) {
    const savePhpUrl = 'https://uni-guild.com/js/query/save.php';

    const formData = new URLSearchParams();
    formData.append('query', fullQuery); // ここで 'query' という名前でデータを入れる

    fetch(savePhpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(response => response.text())
    .then(data => console.log('サーバーからの応答:', data))
    .catch(error => console.error('エラー:', error));
}