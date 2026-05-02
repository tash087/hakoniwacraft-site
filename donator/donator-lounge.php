<?php
session_start();

// 1. ログインチェック: セッションがない、または権限が donator/admin 以外ならログイン画面へ
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['donator', 'admin'])) {
    header("Location: ../donator/login.php");
    exit;
}

// お知らせデータの読み込みパス
$json_path = '../admin/donator-user/donator_news.json';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>寄付者専用ラウンジ | 箱庭クラフト</title>
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="shortcut icon" href="../images/server_icon.png" type="image/png">
    <script src="../js/include.js?v=js-0326-thu" defer></script>
    <script src="../js/day-count.js" defer></script>
    <style>
        .news-item {
            margin-bottom: 25px;
            padding: 20px;
            border-left: 5px solid #f1c40f;
            background: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border-radius: 0 10px 10px 0;
            transition: transform 0.2s;
        }
        .news-item:hover {
            transform: translateX(5px);
        }
        .news-date {
            font-size: 0.85rem;
            color: #999;
            margin-bottom: 5px;
        }
        .news-title {
            color: #d35400;
            margin: 0 0 10px 0;
            font-size: 1.25rem;
        }
        .news-content {
            line-height: 1.7;
            color: #333;
        }
    </style>
</head>
<body>
    <div id="header-placeholder"></div>

    <main class="container section">
        <div style="text-align:center; padding: 40px 20px; background:#fffcf5; border-radius:30px; border:2px solid #f1c40f;">
            <span style="background:#f1c40f; color:#fff; padding:5px 15px; border-radius:20px; font-weight:bold;">DONATOR ONLY</span>
            <h1 style="margin-top:20px;">💎 寄付者専用ラウンジ</h1>
            <p style="font-size:1.2rem; margin: 20px 0;">
                ようこそ、<strong><?php echo htmlspecialchars($_SESSION['user_name']); ?></strong> さん！
            </p>
            <p>いつも箱庭クラフトへの温かいご支援、心より感謝申し上げます。</p>
        </div>

<div class="card" style="margin-top:30px; text-align: left;">
    <h3 style="border-bottom: 2px solid #f1c40f; padding-bottom: 10px; margin-bottom: 20px;">🎁 現在の特典・お知らせ</h3>
    
    <?php
    $json_path = '../admin/donator-user/donator_news.json';

    if (file_exists($json_path)) {
        $json_data = file_get_contents($json_path);
        $news_list = json_decode($json_data, true);

        if (!empty($news_list)) {
            foreach ($news_list as $news) {
                // ファイル名だけを取り出す（念のための処理）
                $file_name = basename($news['file']);
                
                // 【修正ポイント】リンク先を donator_news/ファイル名 に固定する
                $link_url = "donator_news/" . $file_name;

                echo "<div style='margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;'>";
                echo "<span style='font-size: 0.8rem; color: #999; margin-right: 10px;'>" . htmlspecialchars($news['date']) . "</span>";
                echo "<a href='" . htmlspecialchars($link_url) . "' style='color: #d35400; text-decoration: none; font-weight: bold;'>" . htmlspecialchars($news['title']) . "</a>";
                echo "</div>";
            }
        } else {
            echo "<p style='color: #999; text-align: center;'>現在、新しいお知らせはありません。</p>";
        }
    }
    ?>
</div>
    </main>

    <div id="footer-placeholder"></div>
</body>
</html>