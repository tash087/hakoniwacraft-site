// URLSearchParamsでクエリを取得
const params = new URLSearchParams(window.location.search);
const name = params.get('name'); 

if (name) {
    // 保存先PHPのフルパスを指定
    const savePhpUrl = 'https://uni-guild.com/js/query/save.php';

    fetch(savePhpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
    })
    .then(data => console.log('サーバーからの応答:', data))
    .catch(error => console.error('エラー:', error));
}