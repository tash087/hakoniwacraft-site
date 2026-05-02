<?php
// 1. メンテナンス表示用テンプレートを読み込む
// パスが正しいか確認してください（index.phpから見てmaintenanceフォルダの中）
require_once '../maintenance/maint_template.php';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公式サイト | 箱庭クラフト</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* index.php 独自のレイアウト調整 */
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .section-title { font-size: 1.2rem; border-left: 5px solid #34495e; padding-left: 15px; margin: 30px 0 15px; }
    </style>
</head>
<body>

<div class="container">
    <h1>箱庭クラフト 公式サイト</h1>

    <section class="news-section">
        <h2 class="section-title">最新ニュース</h2>
        </section>

    <section class="update-log-section">
        <h2 class="section-title">Update LOG (メンテナンス履歴)</h2>
        
        <?php 
        // 関数を呼び出して表示する
        // 引数には index.php から見た JSON ファイルのパスを指定します
        echo render_update_logs('maint_logs.json'); 
        ?>
    </section>
</div>

</body>
</html>