<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server History - 箱庭クラフト</title>

    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../images/server_icon.png" type="image/png">
    <link rel="shortcut icon" href="../images/server_icon.png" type="image/png">
    
    <script src="../js/include.js" defer></script>
    <script src="../js/day-count.js" defer></script>

    <style>
        :root {
            --main-orange: #e67e22;
            --dark-gray: #2c3e50;
            --bg-color: #f9f9f9;
        }

        #history-page-wrapper {
            background-color: var(--bg-color);
            padding: 60px 0;
            min-height: 100vh;
            color: #333;
            overflow-x: hidden;
        }

        .history-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
            transition: all 0.5s ease;
        }

        .page-title {
            text-align: center;
            font-size: 2.5rem;
            color: var(--main-orange);
            margin-bottom: 20px;
            font-weight: bold;
        }

        /* --- コントロールパネル --- */
        .controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            margin-bottom: 50px;
        }
        .control-group { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .control-label { font-size: 0.85rem; color: #888; width: 100%; text-align: center; margin-bottom: -5px; }

        .sort-btn {
            padding: 8px 18px;
            border: 2px solid var(--main-orange);
            background: white;
            color: var(--main-orange);
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
            text-decoration: none;
            font-size: 0.85rem;
        }
        .sort-btn.active { background: var(--main-orange); color: white; }

        /* --- 縦表示 (Vertical Timeline) --- */
        .view-vertical .timeline {
            position: relative;
            padding: 20px 0;
        }
        .view-vertical .timeline::before {
            content: ''; position: absolute; left: 50%; top: 0; bottom: 0;
            width: 4px; background: #ddd; transform: translateX(-50%);
        }
        .view-vertical .timeline-item {
            display: flex; justify-content: space-between; margin-bottom: 80px; width: 100%; position: relative;
        }
        .view-vertical .timeline-item:nth-child(even) { flex-direction: row-reverse; }
        .view-vertical .timeline-dot {
            position: absolute; left: 50%; top: 25px; width: 16px; height: 16px;
            background: var(--main-orange); border: 4px solid #fff; border-radius: 50%;
            transform: translateX(-50%); z-index: 2;
        }
        .view-vertical .timeline-content { width: 44%; background: #fff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

        /* --- 横表示 (Horizontal Slide) --- */
        .view-horizontal .history-container { max-width: 100%; }
        .view-horizontal .timeline {
            display: flex;
            overflow-x: auto;
            padding: 40px 20px;
            gap: 30px;
            scroll-snap-type: x mandatory;
            padding-bottom: 60px;
        }
        .view-horizontal .timeline::before {
            content: ''; position: absolute; left: 0; top: 160px; right: 0;
            height: 4px; background: #ddd; z-index: 1;
        }
        .view-horizontal .timeline-item {
            flex: 0 0 350px;
            scroll-snap-align: center;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .view-horizontal .timeline-dot {
            width: 20px; height: 20px; background: var(--main-orange);
            border: 4px solid #fff; border-radius: 50%;
            margin: 0 auto 20px auto; z-index: 2; position: relative; top: 113px;
        }
        .view-horizontal .timeline-content {
            background: #fff; border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-top: 130px; /* 線の下に配置 */
        }

        /* --- 共通パーツ --- */
        .event-gallery { display: flex; gap: 5px; overflow-x: auto; background: #f0f0f0; padding: 10px; }
        .gallery-img { height: 120px; border-radius: 4px; cursor: pointer; object-fit: cover; }
        .event-text { padding: 20px; }
        .event-date { color: var(--main-orange); font-weight: bold; }
        .badge { font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; color: #fff; text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
        .bg-major { background: #f1c40f; } .bg-update { background: #3498db; } .bg-event { background: #e74c3c; } .bg-origin { background: var(--dark-gray); }
        .event-description { font-size: 0.9rem; color: #666; line-height: 1.6; }

        /* ライトボックス */
        #lightbox {
            display: none; position: fixed; z-index: 10000;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); justify-content: center; align-items: center;
        }
        #lightbox img { max-width: 90%; max-height: 85%; border: 4px solid #fff; }

        @media (max-width: 768px) {
            .view-vertical .timeline::before { left: 20px; }
            .view-vertical .timeline-dot { left: 20px; transform: none; }
            .view-vertical .timeline-item, .view-vertical .timeline-item:nth-child(even) { flex-direction: row; }
            .view-vertical .timeline-content { width: calc(100% - 60px); margin-left: 60px; }
            .view-horizontal .timeline-item { flex: 0 0 280px; }
        }
    </style>
</head>
<body>

<div id="header-placeholder"></div>

<?php
// パラメータ取得
$order = $_GET['order'] ?? 'desc'; // desc:新しい順, asc:古い順
$view = $_GET['view'] ?? 'vertical'; // vertical:縦, horizontal:横

$json_file = '../data/history.json';
$history_data = json_decode(@file_get_contents($json_file), true) ?: [];

// 並び替え処理
usort($history_data, function($a, $b) use ($order) {
    return ($order === 'asc') ? strcmp($a['date'], $b['date']) : strcmp($b['date'], $a['date']);
});
?>

<div id="history-page-wrapper" class="view-<?php echo $view; ?>">
    <div class="history-container">
        <h1 class="page-title">📜 Server History</h1>

        <div class="controls">
            <div class="control-group">
                <div class="control-label">表示形式</div>
                <a href="?view=vertical&order=<?php echo $order; ?>" class="sort-btn <?php echo ($view === 'vertical') ? 'active' : ''; ?>">縦向き (Timeline)</a>
                <a href="?view=horizontal&order=<?php echo $order; ?>" class="sort-btn <?php echo ($view === 'horizontal') ? 'active' : ''; ?>">横向き (Slide)</a>
            </div>
            <div class="control-group">
                <div class="control-label">並び順</div>
                <a href="?view=<?php echo $view; ?>&order=desc" class="sort-btn <?php echo ($order === 'desc') ? 'active' : ''; ?>">新しい順 ↓</a>
                <a href="?view=<?php echo $view; ?>&order=asc" class="sort-btn <?php echo ($order === 'asc') ? 'active' : ''; ?>">古い順 ↑</a>
            </div>
        </div>

        <div class="timeline">
            <?php foreach ($history_data as $item): 
                $category = $item['category'] ?? 'event';
                $badge_class = 'bg-' . $category;
            ?>
                <div class="timeline-item <?php echo ($category === 'origin' ? 'origin-style' : ''); ?>">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <?php if (!empty($item['images'])): ?>
                            <div class="event-gallery">
                                <?php foreach ($item['images'] as $img): ?>
                                    <img src="<?php echo htmlspecialchars($img); ?>" class="gallery-img" onclick="openLightbox(this.src)">
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        <div class="event-text">
                            <span class="badge <?php echo $badge_class; ?>"><?php echo htmlspecialchars($category); ?></span>
                            <span class="event-date"><?php echo str_replace('-', '.', $item['date']); ?></span>
                            <h3 style="margin: 8px 0; font-size: 1.2rem;"><?php echo htmlspecialchars($item['title']); ?></h3>
                            <p class="event-description"><?php echo nl2br(htmlspecialchars($item['description'])); ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<div id="footer-placeholder"></div>

<div id="lightbox" onclick="this.style.display='none'"><img id="lightbox-img" src=""></div>

<script>
    function openLightbox(src) {
        document.getElementById('lightbox-img').src = src;
        document.getElementById('lightbox').style.display = 'flex';
    }
</script>

</body>
</html>