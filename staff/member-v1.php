<?php
// 1. JSONファイルの読み込み
$json_file = __DIR__ . '/data/staff_data.json'; // 先ほど作成したJSONのファイル名
if (!file_exists($json_file)) {
    die("エラー: データファイルが見つかりません。");
}

$json_data = json_decode(file_get_contents($json_file), true);
$staff_list = $json_data['staff'];

$name_param = $_GET['name'] ?? '';

// メンバーが存在しない場合の処理
if (!array_key_exists($name_param, $staff_list)) {
    header("HTTP/1.1 404 Not Found");
    // 404専用の仮データを流し込む
    $member = [
        'title' => '404 Not Found - 箱庭クラフト！',
        'description' => '指定されたページは見つかりませんでした。',
        'icon_emoji' => '🚫',
        'name' => 'Member <br> Not Found',
        'role_lead' => '404 Error',
        'status' => 'Unknown',
        'id' => 'default', // 汎用アイコンなどがあれば
        'department' => '---',
        'main_role' => '---',
        'start_date_raw' => '',
        'start_date_text' => '---',
        'roots' => '---',
        'motto' => '---',
        'content_blocks' => [
            [
                'title' => 'ページが見つかりません',
                'text' => 'お探しのメンバーページは削除されたか、URLが間違っている可能性があります。入力した名前（' . htmlspecialchars($name_param) . '）を再度ご確認ください。'
            ]
        ],
        'message' => 'お手数ですが、一覧ページより再度お探しください。'
    ];
    $is_404 = true;
} else {
    $member = $staff_list[$name_param];
    $is_404 = false;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($member['title']); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($member['description']); ?>">
<link rel="stylesheet" href="https://uni-guild.com/css/common.css?random=vhq09w83e">
<link rel="stylesheet" href="https://uni-guild.com/css/style.css?random=vhq09w83e">
<link rel="stylesheet" href="https://uni-guild.com/css/about-update.css?random=vhq09w83e">
<link rel="stylesheet" href="https://uni-guild.com/css/news.css?random=vhq09w83e">

<link rel="shortcut icon" href="https://uni-guild.com/images/server_icon.png" type="image/png">

<script src="https://uni-guild.com/js/include.js?random=vhq09w83e" defer></script>
<script src="https://uni-guild.com/js/day-count.js?random=vhq09w83e" defer></script>
<script src="https://uni-guild.com/js/slider.js?random=vhq09w83e" defer></script>
<!-- staff[member.php限定 js / css] -->
<script src="data/staff_list.js" defer></script>
<link rel="stylesheet" href="data/staff.css?v=1.0.1">
<!-- テスト-query取得 -->
<script src="https://uni-guild.com/js/query/query-v1.2.js"></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <main class="container section-padding">
        <section class="staff-detail-container">
            <div class="staff-hero">
                <h1 class="page-title"><?php echo $member['icon_emoji']; ?> <span class="text-primary-color"><?php echo htmlspecialchars($member['name']); ?></span></h1>
                <p class="staff-role-lead"><?php echo htmlspecialchars($member['role_lead']); ?></p>
            </div>

            <div class="staff-main-layout">
                <aside class="staff-info-card">
                    <div class="staff-visual">
                        <img src="../images/<?php echo htmlspecialchars($member['id']); ?>_icon.png" alt="<?php echo htmlspecialchars($member['name']); ?>" class="staff-large-icon">
                        <div class="staff-status"><?php echo htmlspecialchars($member['status']); ?></div>
                    </div>
                    
                    <dl class="staff-data-list">
                        <dt>担当部門</dt><dd><?php echo htmlspecialchars($member['department']); ?></dd>
                        <dt>主な役割</dt><dd><?php echo htmlspecialchars($member['main_role']); ?></dd>
                        <dt>運営歴</dt>
                        <dd id="<?php echo htmlspecialchars($member['id']); ?>-period" data-start-date="<?php echo htmlspecialchars($member['start_date_raw']); ?>">
                            <?php echo htmlspecialchars($member['start_date_text']); ?>
                        </dd>
                        <dt>ルーツ</dt><dd><?php echo htmlspecialchars($member['roots']); ?></dd>
                        <dt>個人のモットー</dt><dd><?php echo htmlspecialchars($member['motto']); ?></dd>
                    </dl>
                </aside>

                <article class="staff-content-body">
                    <section class="content-block">
                        <?php foreach ($member['content_blocks'] as $block): ?>
                            <h3><?php echo htmlspecialchars($block['title']); ?></h3>
                            <p><?php echo nl2br(htmlspecialchars($block['text'])); ?></p>
                        <?php endforeach; ?>
                    </section>

                    <blockquote class="message-quote-box">
                        <div class="quote-body">
                            <h4 class="quote-author"><?php echo htmlspecialchars($member['name']); ?> からのメッセージ</h4>
                            <p><?php echo nl2br(htmlspecialchars($member['message'])); ?></p>
                        </div>
                    </blockquote>
                </article>
            </div>

            <nav class="button-area-flex">
                <a href="#" id="prev-staff" class="btn-nav btn-primary-nav">← Loading...</a>
                <a href="../pages/about.html" class="btn-nav btn-outline-nav">運営紹介一覧へ</a>
                <a href="#" id="next-staff" class="btn-nav btn-primary-nav">Loading... →</a>
            </nav>
        </section>
    </main>

    <div id="footer-placeholder"></div>
</body>
</html>