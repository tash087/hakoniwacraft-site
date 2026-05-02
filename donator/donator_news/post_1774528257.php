<?php 
session_start();
// 権限チェック：ログインしていない、または admin/donator 以外は拒否
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['donator', 'admin'])) {
    http_response_code(403);
    die("アクセス権限がありません。このページを閲覧するにはログインが必要です。");
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test - 箱庭クラフト</title>
    
    <link rel="stylesheet" href="../../css/common.css?v=1774528257">
    <link rel="stylesheet" href="../../css/style.css?v=1774528257">
    <link rel="stylesheet" href="../../css/news.css?v=1774528257">
    <link rel="shortcut icon" href="../../images/server_icon.png">
    
    <script src="../../js/include.js?v=93qu4" defer></script>
   <script src="../../js/day-count.js?v=daycount" defer></script>
    <style>
        .news-detail-container { max-width: 900px; margin: 50px auto; background: #fff; padding: 40px; border-radius: 15px; border: 1px solid #f1c40f; }
        .donator-badge { background: #f1c40f; color: #000; padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
    </style>
</head>
<body class="sub-page news-detail">
    <div id="header-placeholder"></div>
    <main class="container">
        <article class="news-detail-container">
            <header style="border-bottom: 2px solid #f1c40f; margin-bottom: 20px; padding-bottom: 10px;">
                <span class="donator-badge">DONATOR ONLY</span>
                <span style="color:#888; margin-left:10px;">2026.03.26</span>
                <h1 style="margin: 10px 0;">test</h1>
                <small>Posted by 運営</small>
            </header>
            <section class="news-content">
                test            </section>
            <footer style="margin-top: 40px; text-align: center;">
                <a href="../donator-lounge.php" class="btn-nav">ラウンジへ戻る</a>
            </footer>
        </article>
    </main>
    <div id="footer-placeholder"></div>
</body>
</html>