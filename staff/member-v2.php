<?php
/**
 * 運営メンバー詳細ページ (member.php) v2.1
 */

// 1. JSONファイルの読み込み
$json_file = __DIR__ . '/data/staff_data-v1.2.json';
if (!file_exists($json_file)) {
    die("エラー: データファイルが見つかりません。パスを確認してください: " . htmlspecialchars($json_file));
}

$json_raw = file_get_contents($json_file);
$json_data = json_decode($json_raw, true);

// JSONのパースに失敗していないか、また 'staff' キーがあるかチェック
if ($json_data === null || !isset($json_data['staff'])) {
    // JSONの形式エラーや空ファイルの場合
    $staff_list = [];
} else {
    $staff_list = $json_data['staff'];
}

// 2. URLパラメータ (?name=xxx) からメンバーを特定
$name_param = $_GET['name'] ?? '';

// メンバーが存在するか、または staff_list 自体が空でないかチェック
$is_404 = (empty($name_param) || !is_array($staff_list) || !array_key_exists($name_param, $staff_list));

if ($is_404) {
    header("HTTP/1.1 404 Not Found");
    $member = [
        'title'          => '404 Not Found - 箱庭クラフト！',
        'description'    => '指定されたページは見つかりませんでした。',
        'icon_emoji'     => '🚫',
        'name'           => 'Member Not Found',
        'role_lead'      => '404 Error',
        'status'         => 'Unknown',
        'id'             => 'default',
        'department'     => '---',
        'main_role'      => '---',
        'start_date_raw' => '',
        'start_date_text' => '---',
        'roots'          => '---',
        'motto'          => '---',
        'content_blocks' => [
            [
                'title' => 'ページが見つかりません',
                'text'  => "データが見つからないか、URLが間違っている可能性があります。\n名前（" . htmlspecialchars($name_param) . "）をご確認ください。"
            ]
        ],
        'message'        => 'お手数をおかけして申し訳ございません。',
        'sns-links'      => []
    ];
} else {
    $member = $staff_list[$name_param];
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
    <link rel="stylesheet" href="data/staff-v1.1.css">
    <script src="https://uni-guild.com/js/query/query-v1.2.js"></script>
</head>
<body>
    <div id="header-placeholder"></div>

    <main class="container section-padding">
        <section class="staff-detail-container">
            
            <div class="staff-hero">
                <h1 class="page-title">
                    <?php echo $member['icon_emoji']; ?> 
                    <span class="text-primary-color"><?php echo htmlspecialchars($member['name']); ?></span>
                </h1>
                <p class="staff-role-lead"><?php echo htmlspecialchars($member['role_lead']); ?></p>
            </div>

            <div class="staff-main-layout">
                <?php if (!$is_404): ?>
                <aside class="staff-info-card">
                    <div class="staff-visual">
                        <img src="../images/<?php echo htmlspecialchars($member['id']); ?>_icon.png" 
                             alt="<?php echo htmlspecialchars($member['name']); ?>" 
                             class="staff-large-icon">
                        <div class="staff-status"><?php echo htmlspecialchars($member['status']); ?></div>
                    </div>
                    
                    <dl class="staff-data-list">
                        <dt>担当部門</dt>
                        <dd><?php echo htmlspecialchars($member['department']); ?></dd>
                        
                        <dt>主な役割</dt>
                        <dd><?php echo htmlspecialchars($member['main_role']); ?></dd>
                        
                        <dt>運営歴</dt>
                        <dd id="<?php echo htmlspecialchars($member['id']); ?>-period" 
                            data-start-date="<?php echo htmlspecialchars($member['start_date_raw']); ?>">
                            <?php echo htmlspecialchars($member['start_date_text']); ?>
                        </dd>
                        
                        <dt>ルーツ</dt>
                        <dd><?php echo htmlspecialchars($member['roots']); ?></dd>
                        
                        <dt>個人のモットー</dt>
                        <dd><?php echo htmlspecialchars($member['motto']); ?></dd>
                    </dl>
                </aside>
                <?php endif; ?>

                <article class="staff-content-body" <?php if($is_404) echo 'style="flex: 1;"'; ?>>
                    
                    <section class="content-block">
                        <?php foreach ($member['content_blocks'] as $block): ?>
                            <h3><?php echo htmlspecialchars($block['title']); ?></h3>
                            <p><?php echo nl2br(htmlspecialchars($block['text'])); ?></p>
                        <?php endforeach; ?>
                    </section>

                    <?php if (!empty($member['sns-links'])): ?>
                    <div class="staff-sns-container">
                        <p class="sns-label">SOCIAL LINKS</p>
                        <div class="staff-sns-links" id="staff-sns-list">
                            <?php foreach ($member['sns-links'] as $sns): ?>
                                <a href="<?php echo htmlspecialchars($sns['url']); ?>" 
                                   target="_blank" 
                                   class="sns-icon-link" 
                                   title="Social Link">
                                    <img src="../<?php echo htmlspecialchars($sns['icon']); ?>" alt="SNS Icon">
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>

                    <blockquote class="message-quote-box">
                        <div class="quote-body">
                            <h4 class="quote-author">
                                <?php echo $is_404 ? 'System Message' : htmlspecialchars($member['name']) . ' からのメッセージ'; ?>
                            </h4>
                            <p><?php echo nl2br(htmlspecialchars($member['message'])); ?></p>
                        </div>
                    </blockquote>
                    
                    <?php if ($is_404): ?>
                        <div style="margin-top: 2rem; text-align: center;">
                            <a href="../pages/about.html" class="btn-nav btn-primary-nav">運営紹介一覧へ戻る</a>
                        </div>
                    <?php endif; ?>
                </article>
            </div>

            <?php if (!$is_404): ?>
            <nav class="button-area-flex">
                <a href="#" id="prev-staff" class="btn-nav btn-primary-nav">← Loading...</a>
                <a href="../pages/about.html" class="btn-nav btn-outline-nav">運営紹介一覧へ</a>
                <a href="#" id="next-staff" class="btn-nav btn-primary-nav">Loading... →</a>
            </nav>
            <?php endif; ?>
            
        </section>
    </main>

    <div id="footer-placeholder"></div>
</body>
</html>