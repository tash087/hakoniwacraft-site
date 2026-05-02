<?php
/**
 * ニュース詳細ページ 自動生成テンプレート
 * 【2026.03.07 完全版】箱庭クラフト・スタイル完全準拠
 * 
 * 更新履歴：
 * - 2026.01.XX カテゴリ別メタカラー対応
 * - 2026.01.XX 構造化データ（JSON-LD）追加
 * - 2026.01.XX 目次自動生成機能追加（オプション）
 * - 2026.01.XX CSS整理・変数統一
 */

function generate_news_html($title, $date, $category, $author, $content) {
    // カテゴリ別のメタカラー設定
    $category_colors = [
        '重要' => ['color' => '#ef4444', 'icon' => '⚠️', 'description' => 'サーバー運営に関する重要なお知らせ'],
        'アップデート' => ['color' => '#3b82f6', 'icon' => '⚙️', 'description' => 'プラグイン追加・機能変更などの技術情報'],
        'イベント' => ['color' => '#c084fc', 'icon' => '🎉', 'description' => '建築祭・交流会などのコミュニティ情報'],
        'お知らせ' => ['color' => '#22c55e', 'icon' => '📢', 'description' => '通常のお知らせ・鯖主近況']
    ];
    
    $current_color = $category_colors[$category]['color'] ?? '#22c55e';
    $current_icon = $category_colors[$category]['icon'] ?? '📢';
    $current_desc = $category_colors[$category]['description'] ?? '';
    
    // 抜粋文生成（OGP用）
    $excerpt = mb_substr(strip_tags($content), 0, 120, 'UTF-8') . '...';
    
    ob_start(); 
    ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title><?php echo htmlspecialchars($title); ?> - 箱庭クラフト通信</title>
    <meta name="description" content="<?php echo htmlspecialchars($excerpt); ?>">
    <meta name="author" content="<?php echo htmlspecialchars($author); ?>">
    
    <!-- OGP (SNSシェア用) -->
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($excerpt); ?>">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="箱庭クラフト">
    <meta property="article:published_time" content="<?php echo date('Y-m-d', strtotime(str_replace('.', '-', $date))); ?>">
    <meta property="article:section" content="<?php echo htmlspecialchars($category); ?>">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($excerpt); ?>">
    
    <!-- テーマカラー（カテゴリ連動） -->
    <meta name="theme-color" content="<?php echo $current_color; ?>">
    
    <!-- CSS -->
    <link rel="stylesheet" href="../css/common.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../css/style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../css/news-v1.0.css?v=<?php echo time(); ?>">
    <script src="../js/include.js?v=<?php echo time(); ?>" defer></script>
    <script src="../js/day-count.js?v=<?php echo time(); ?>" defer></script>
    <script src="../js/slider.js?v=<?php echo time(); ?>" defer></script>
    <link rel="shortcut icon" href="../images/server_icon.png">
    
    <!-- 構造化データ（SEO強化） -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": "<?php echo htmlspecialchars($title); ?>",
        "datePublished": "<?php echo date('Y-m-d', strtotime(str_replace('.', '-', $date))); ?>",
        "author": {
            "@type": "Person",
            "name": "<?php echo htmlspecialchars($author); ?>"
        },
        "publisher": {
            "@type": "Organization",
            "name": "箱庭クラフト",
            "logo": {
                "@type": "ImageObject",
                "url": "https://hakoniwa-craft.com/images/server_icon.png"
            }
        },
        "articleSection": "<?php echo htmlspecialchars($category); ?>",
        "description": "<?php echo htmlspecialchars($excerpt); ?>"
    }
    </script>
    
    <style>
    /* =========================================
       箱庭クラフト ニュース共通パーツ
       ========================================= */

    /* ルート変数（共通） */
    :root {
        --primary-color: <?php echo $current_color; ?>;
        --accent-color: <?php echo $current_color; ?>;
        --text-color: #2d2d3a;
        --light-text: #888;
        --white: #ffffff;
        --bg-gray: #f8f8fa;
        --border-light: #e0ddd9;
    }

    /* カテゴリバッジ（丸みのあるモダンなデザイン） */
    .news-category-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(230, 126, 34, 0.12);
        color: var(--primary-color);
        font-size: 0.75rem;
        padding: 4px 14px;
        border-radius: 100px;
        font-weight: 700;
        white-space: nowrap;
        letter-spacing: 0.3px;
    }

    /* カテゴリ別バッジのバリエーション */
    .news-category-badge.important {
        background: rgba(239, 68, 68, 0.12);
        color: #ef4444;
    }

    .news-category-badge.update {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
    }

    .news-category-badge.event {
        background: rgba(192, 132, 252, 0.12);
        color: #c084fc;
    }

    /* =========================================
       ニュースアーカイブ（一覧ページ）
       ========================================= */

    /* フィルターボタンエリア */
    .filter-container {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 50px;
        flex-wrap: wrap;
    }

    .filter-btn {
        background: var(--white);
        border: 1px solid var(--border-light);
        padding: 10px 22px;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 700;
        color: var(--light-text);
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .filter-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        transform: translateY(-2px);
    }

    .filter-btn.active {
        background: var(--primary-color);
        color: var(--white);
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);
    }

    /* ニュースカード一覧 */
    .news-list-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 900px;
        margin: 0 auto;
    }

    .news-card-item {
        background: var(--white);
        padding: 24px 32px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 25px;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        border: 1px solid transparent;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }

    .news-card-item:hover {
        transform: translateX(8px);
        box-shadow: 0 12px 28px rgba(230, 126, 34, 0.1);
        border-color: rgba(230, 126, 34, 0.2);
        background: #fffdf9;
    }

    .news-card-item .news-date {
        font-weight: 700;
        color: var(--light-text);
        font-size: 0.9rem;
        min-width: 100px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .news-card-item .news-date:before {
        content: "📅";
        font-size: 0.85rem;
    }

    .news-card-item .news-category-badge {
        font-size: 0.7rem;
        padding: 3px 12px;
    }

    /* カード内タイトル */
    .news-card-title {
        font-weight: 700;
        color: var(--text-color);
        font-size: 1.05rem;
        flex: 1;
        transition: color 0.2s;
        line-height: 1.4;
        word-wrap: break-word;
        overflow-wrap: break-word;
        display: flex;
        align-items: center;
    }

    .news-card-item:hover .news-card-title {
        color: var(--primary-color);
    }

    /* カード内のメタ情報行 */
    .news-card-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    /* =========================================
       ニュース詳細（個別記事ページ）
       ========================================= */

    .news-detail-container {
        max-width: 900px;
        margin: 0 auto;
        background: var(--white);
        padding: 48px 48px;
        border-radius: 28px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.04);
        position: relative;
        z-index: 1;
    }

    /* ヘッダー */
    .news-header {
        border-bottom: 2px dashed var(--border-light);
        margin-bottom: 40px;
        padding-bottom: 28px;
    }

    .news-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 16px;
    }

    .news-meta .news-date {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--light-text);
        font-size: 0.9rem;
    }

    .news-meta .news-date:before {
        content: "📅";
    }

    /* 詳細ページタイトル */
    .news-title {
        font-size: clamp(1.6rem, 5vw, 2.4rem);
        color: var(--text-color);
        line-height: 1.35 !important;
        font-weight: 800;
        margin: 16px 0 12px;
        letter-spacing: -0.01em;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: auto-phrase;
        text-wrap: pretty;
        max-width: 100%;
    }

    .news-author-info {
        font-size: 0.85rem;
        color: var(--light-text);
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .news-author-info:before {
        content: "✍️";
        font-size: 0.85rem;
    }

    .news-author-info strong {
        color: var(--primary-color);
        font-weight: 700;
    }

    /* 本文エリア */
    .news-content {
        line-height: 1.85;
        font-size: 1.05rem;
        color: var(--text-color);
    }

    /* 本文内見出し */
    .news-content h2 {
        font-size: 1.6rem;
        margin: 2rem 0 1rem;
        padding-left: 14px;
        border-left: 4px solid var(--primary-color);
        color: var(--text-color);
        font-weight: 700;
        line-height: 1.35;
        word-wrap: break-word;
    }

    .news-content h3 {
        font-size: 1.3rem;
        margin: 1.5rem 0 0.8rem;
        color: var(--text-color);
        font-weight: 600;
        line-height: 1.4;
        word-wrap: break-word;
    }

    /* 本文内のボックス（汎用） */
    .news-content .box {
        background: var(--bg-gray);
        border-radius: 20px;
        padding: 24px 28px;
        margin: 32px 0;
        border-left: 4px solid var(--primary-color);
    }

    /* 緑ボックス（アップデート・成功系） */
    .news-content .box-green,
    .info-box-green {
        background: #f1f9f1;
        border-left: 4px solid #22c55e;
        border-radius: 20px;
        padding: 24px 28px;
        margin: 32px 0;
    }

    /* 青ボックス（補足説明系） */
    .news-content .box-blue {
        background: #eef4ff;
        border-left: 4px solid #3b82f6;
        border-radius: 20px;
        padding: 24px 28px;
        margin: 32px 0;
    }

    /* コマンド表示 */
    .news-content .command {
        background: #1e1e2e;
        color: #e4e4e7;
        font-family: 'SF Mono', 'Courier New', monospace;
        padding: 12px 18px;
        border-radius: 12px;
        font-size: 0.9rem;
        overflow-x: auto;
        margin: 20px 0;
    }

    /* ボタン */
    .news-content .btn {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.2s;
        margin: 8px 4px;
    }

    .news-content .btn:hover {
        filter: brightness(0.9);
        transform: translateY(-2px);
    }

    .news-content .btn-secondary {
        background: #6b7280;
    }

    /* 鯖主メッセージ */
    .news-content .owner-message {
        background: linear-gradient(135deg, #fef9f0 0%, #fff5e6 100%);
        border-radius: 24px;
        padding: 28px 32px;
        margin: 40px 0;
        border: 1px solid rgba(230, 126, 34, 0.2);
    }

    .news-content .owner-message .name {
        font-size: 0.85rem;
        color: var(--primary-color);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
    }

    .news-content .owner-message .name:before {
        content: "🌱";
        font-size: 1rem;
    }

    /* 本文内の表組み */
    .cmd-table,
    .news-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 32px 0;
        font-size: 0.95rem;
        border-radius: 16px;
        overflow: hidden;
    }

    .cmd-table th,
    .news-content th {
        background: #f5f5f7;
        padding: 14px 18px;
        border-bottom: 2px solid var(--border-light);
        text-align: left;
        font-weight: 800;
        color: var(--primary-color);
    }

    .cmd-table td,
    .news-content td {
        padding: 12px 18px;
        border-bottom: 1px solid var(--border-light);
    }

    .cmd-table code,
    .news-content code {
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 6px;
        font-family: 'SF Mono', 'Courier New', monospace;
        font-size: 0.85rem;
        color: #d35400;
    }

    /* 本文内の画像 */
    .news-content img {
        max-width: 100%;
        height: auto;
        border-radius: 20px;
        margin: 32px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    /* 目次スタイル */
    .table-of-contents {
        background: var(--bg-gray);
        border-radius: 20px;
        padding: 24px 28px;
        margin: 32px 0;
    }

    .table-of-contents p {
        font-weight: 800;
        margin-bottom: 16px;
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .table-of-contents p:before {
        content: "📑";
    }

    .table-of-contents ul {
        margin: 0;
        padding-left: 1.5rem;
    }

    .table-of-contents li {
        margin: 8px 0;
    }

    .table-of-contents a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .table-of-contents a:hover {
        text-decoration: underline;
    }

    /* 記事下ナビゲーション */
    .news-footer {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 60px;
        padding-top: 40px;
        border-top: 2px dashed var(--border-light);
        flex-wrap: wrap;
    }

    .btn-nav {
        display: inline-block;
        padding: 10px 28px;
        border-radius: 50px;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.2s;
    }

    .btn-outline-nav {
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        background: transparent;
    }

    .btn-outline-nav:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
    }

    .btn-primary-nav {
        background: var(--primary-color);
        color: white;
    }

    .btn-primary-nav:hover {
        filter: brightness(0.9);
        transform: translateY(-2px);
    }

    /* =========================================
       ダークモード対応
       ========================================= */
    @media (prefers-color-scheme: dark) {
        :root {
            --white: #1f1f2e;
            --text-color: #e4e4e7;
            --light-text: #a1a1aa;
            --bg-gray: #2a2a35;
            --border-light: #3f3f46;
        }

        .news-detail-container {
            background: #1f1f2e;
        }

        .news-card-item {
            background: #1f1f2e;
        }

        .news-card-item:hover {
            background: #2a2a35;
        }

        .news-content .box {
            background: #2a2a35;
        }

        .news-content .box-green,
        .info-box-green {
            background: #1a2a1f;
        }

        .news-content .box-blue {
            background: #1a2a3f;
        }

        .news-content .owner-message {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-color: #2d2d44;
        }

        .cmd-table th,
        .news-content th {
            background: #2a2a35;
            border-bottom-color: #3f3f46;
        }

        .cmd-table td,
        .news-content td {
            border-bottom-color: #2d2d35;
        }

        .table-of-contents {
            background: #2a2a35;
        }

        .filter-btn {
            background: #1f1f2e;
            border-color: #3f3f46;
            color: #a1a1aa;
        }

        .filter-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
    }

    /* =========================================
       レスポンシブ
       ========================================= */
    @media (max-width: 768px) {
        .news-detail-container {
            padding: 32px 20px;
            border-radius: 0;
            margin: 0;
        }

        .news-card-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 20px;
        }

        .news-card-item .news-date {
            min-width: auto;
        }

        .news-card-title {
            font-size: 1rem;
            line-height: 1.45;
        }

        .news-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }

        .btn-nav {
            text-align: center;
            width: 100%;
        }

        .filter-container {
            gap: 8px;
            margin-bottom: 30px;
        }

        .filter-btn {
            padding: 8px 16px;
            font-size: 0.8rem;
        }

        .news-content h2 {
            font-size: 1.4rem;
        }

        .news-content h3 {
            font-size: 1.2rem;
        }

        .news-content .box,
        .news-content .box-green,
        .news-content .box-blue {
            padding: 18px 20px;
        }
    }

    @media (max-width: 480px) {
        .news-title {
            font-size: 1.4rem;
            line-height: 1.4 !important;
            letter-spacing: -0.3px;
        }

        .news-meta {
            gap: 10px;
            font-size: 0.8rem;
        }

        .news-content {
            font-size: 0.98rem;
        }

        .cmd-table th,
        .cmd-table td,
        .news-content th,
        .news-content td {
            padding: 10px 12px;
            font-size: 0.85rem;
        }
    }

    /* 長いタイトル用の特別対応 */
    .news-title[data-long="true"] {
        font-size: clamp(1.3rem, 4vw, 2rem);
        line-height: 1.45;
    }

    /* タイトルが2行以上の場合の行間調整 */
    .news-title br {
        display: block;
        content: "";
        margin: 2px 0;
    }
    </style>
</head>
<body class="sub-page news-detail">
    <div id="header-placeholder"></div>
    
    <main class="container section-padding">
        <article class="news-detail-container">
            <header class="news-header">
                <div class="news-meta">
                    <span class="news-date"><?php echo htmlspecialchars($date); ?></span>
                    <span class="news-category-badge"><?php echo htmlspecialchars($category); ?></span>
                </div>
                <h1 class="news-title"><?php echo nl2br(htmlspecialchars(preg_replace('/^#+\s+/', '', $title))); ?></h1>
                <div class="news-author-info"><?php echo htmlspecialchars($author); ?></div>
            </header>

            <section class="news-content">
                <?php echo $content; ?>
            </section>

            <footer class="news-footer">
                <div class="news-footer-nav">
                    <a href="archive.html" class="btn-nav btn-outline-nav">📰 ニュース一覧へ戻る</a>
                    <a href="../index.html" class="btn-nav btn-primary-nav">🏠 トップページへ戻る</a>
                </div>
                <div style="margin-top: 16px;">
                    <a href="../pages/about.html" style="font-size: 0.8rem; color: var(--primary-color); text-decoration: underline;">📖 サーバーについて詳しく知る</a>
                </div>
                <div style="margin-top: 12px; font-size: 0.7rem; color: #999;">
                    © 箱庭クラフト | Powered by HAKONIWA Studio
                </div>
            </footer>
        </article>
    </main>

    <div id="footer-placeholder"></div>
    
    <!-- 目次自動生成スクリプト -->
    <script>
    (function() {
        const content = document.querySelector('.news-content');
        if (!content) return;
        
        const headings = content.querySelectorAll('h2');
        if (headings.length <= 1) return;
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<p>📑 この記事の目次</p><ul></ul>';
        const tocList = toc.querySelector('ul');
        
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = 'section-' + index;
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        });
        
        const firstHeading = headings[0];
        if (firstHeading) {
            firstHeading.parentNode.insertBefore(toc, firstHeading);
        }
    })();
    </script>
</body>
</html>
    <?php
    return ob_get_clean();
}
?>