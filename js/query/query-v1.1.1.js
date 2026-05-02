// URLSearchParamsでクエリを取得
const params = new URLSearchParams(window.location.search);
const name = params.get('name'); // member.php?name=tash087 の 'tash087' を取得

if (name) {
    // PHPファイル（save.php）にデータを送信する
    fetch('save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name)
    })
    .then(response => response.text())
    .then(data => console.log('サーバーからの応答:', data))
    .catch(error => console.error('エラー:', error));
}