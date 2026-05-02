<?php
/**
 * 建築物詳細ページ (building.php) v1.1
 */

// 1. JSONデータの読み込み
$json_file = __DIR__ . '/data/buildings.json';
if (!file_exists($json_file)) {
    die("エラー: データファイルが見つかりません。");
}
$json_data = json_decode(file_get_contents($json_file), true);
$building_list = $json_data['buildings'] ?? [];

// 2. URLパラメータ (?id=xxx) から建築物を特定
$id_param = $_GET['id'] ?? '';
$is_404 = (empty($id_param) || !isset($building_list[$id_param]));

if ($is_404) {
    header("HTTP/1.1 404 Not Found");
    $data = [
        'name' => 'Not Found',
        'icon_emoji' => '🚧',
        'hlid' => 'none',
        'category' => 'Unknown',
        'status' => '---',
        'location' => '---',
        'builder' => '---',
        'start_date' => '---',
        'style' => '---',
        'message' => '指定された建築データは見つかりませんでした。',
        'content_blocks' => [['title' => 'Error', 'text' => 'URLが正しいかご確認ください。']]
    ];
} else {
    $data = $building_list[$id_param];
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($data['name']); ?> - 建築物紹介</title>

    <link rel="stylesheet" href="https://uni-guild.com/css/common-v1.0.css">
    <link rel="stylesheet" href="https://uni-guild.com/css/style-v1.0.css">
    <link rel="stylesheet" href="https://uni-guild.com/css/about-update-v1.0.css">
    <link rel="stylesheet" href="https://uni-guild.com/css/news-v1.0.css">
    <link rel="shortcut icon" href="https://uni-guild.com/images/server_icon.png" type="image/png">

    <script src="https://uni-guild.com/js/include-v1.1.js" defer></script>
    <script src="https://uni-guild.com/js/day-count-v1.1.js" defer></script>
    <script src="https://uni-guild.com/js/slider-v1.0.js" defer></script>
    <script src="https://uni-guild.com/js/query/query-v2.1.2.js"></script>

    <link rel="stylesheet" href="data/building-v1.1.css">
</head>
<body>

<div id="loading-screen" class="loading-full-screen">
    <div class="loading-content">
        <div class="loading-5">
            <span>H</span><span>A</span><span>K</span><span>O</span><span>N</span><span>I</span><span>W</span><span>A</span>
            <span class="loading-space"> </span> <span>C</span><span>R</span><span>A</span><span>F</span><span>T</span>
        </div>
        <p class="loading-sub-text">
            Loading Blueprint: <span class="loading-target-name"><?php echo htmlspecialchars($data['name']); ?></span>...
        </p>
    </div>
</div>

<div id="header-placeholder"></div>

<main class="container section-padding">
    <section class="staff-detail-container">
        <div class="staff-hero">
            <h1 class="page-title">
                <?php echo $data['icon_emoji']; ?> 
                <span class="text-primary-color"><?php echo htmlspecialchars($data['name']); ?></span>
            </h1>
            <p class="staff-role-lead"><?php echo htmlspecialchars($data['category']); ?></p>
        </div>

        <div class="staff-main-layout">
            <aside class="staff-info-card">
                <div class="staff-visual">
                    <img src="../images/buildings/<?php echo $id_param; ?>_main.jpg" class="staff-large-icon" onerror="this.src='../images/default_building.png'">
                    <div class="staff-status"><?php echo htmlspecialchars($data['status']); ?></div>
                </div>
                <dl class="staff-data-list">
                    <dt>TPコマンド</dt>
                    <dd><code>/hltp <?php echo htmlspecialchars($data['hlid']); ?></code></dd>
                    <dt>所在地</dt>
                    <dd><?php echo htmlspecialchars($data['location']); ?></dd>
                    <dt>建築主</dt>
                    <dd><?php echo htmlspecialchars($data['builder']); ?></dd>
                    <dt>建築開始</dt>
                    <dd><?php echo htmlspecialchars($data['start_date']); ?></dd>
                    <dt>スタイル</dt>
                    <dd><?php echo htmlspecialchars($data['style']); ?></dd>
                </dl>
            </aside>

            <article class="staff-content-body">
                <section class="content-block">
                    <?php foreach ($data['content_blocks'] as $block): ?>
                        <h3><?php echo htmlspecialchars($block['title']); ?></h3>
                        <p><?php echo nl2br(htmlspecialchars($block['text'])); ?></p>
                    <?php endforeach; ?>
                </section>
                <blockquote class="message-quote-box">
                    <div class="quote-body">
                        <h4 class="quote-author">CONCEPT</h4>
                        <p><?php echo nl2br(htmlspecialchars($data['message'])); ?></p>
                    </div>
                </blockquote>
            </article>
        </div>
        <nav class="button-area-flex">
            <a href="index.html" class="btn-nav btn-outline-nav">建築物一覧へ戻る</a>
        </nav>
    </section>
</main>

<div id="footer-placeholder"></div>

<script>
    window.addEventListener('load', () => {
        setTimeout(() => { 
            const loader = document.getElementById('loading-screen');
            if(loader) loader.classList.add('loaded'); 
        }, 800);
    });
</script>
</body>
</html>