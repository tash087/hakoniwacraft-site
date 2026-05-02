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
 * - 2026.01.XX ヘッダー重なり防止のパディング追加
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
    
    // タイトルからマークダウン記法を除去
    $clean_title = preg_replace('/^#+\s+/', '', $title);
    
    ob_start(); 
    ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title><?php echo htmlspecialchars($clean_title); ?> - 箱庭クラフト通信</title>
    <meta name="description" content="<?php echo htmlspecialchars($excerpt); ?>">
    <meta name="author" content="<?php echo htmlspecialchars($author); ?>">
    
    <!-- OGP (SNSシェア用) -->
    <meta property="og:title" content="<?php echo htmlspecialchars($clean_title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($excerpt); ?>">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="箱庭クラフト">
    <meta property="article:published_time" content="<?php echo date('Y-m-d', strtotime(str_replace('.', '-', $date))); ?>">
    <meta property="article:section" content="<?php echo htmlspecialchars($category); ?>">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($clean_title); ?>">
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
        "headline": "<?php echo htmlspecialchars($clean_title); ?>",
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

    /* =========================================
       ヘッダー重なり防止（強制パディング）
       ========================================= */
    .section-padding {
        padding-top: 160px !important;
        padding-bottom: 80px;
    }

    /* カテゴリバッジ */
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

    /* ニュース詳細（個別記事ページ） */
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
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            height: auto !important; 
            min-height: auto !important;
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
        line-height: 1.4 !important;
        font-weight: 800;
        margin: 20px 0 16px;
        letter-spacing: -0.01em;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
        display: block;
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

    /* 表組み */
    .cmd-table {
        width: 100%;
        border-collapse: collapse;
        margin: 32px 0;
        font-size: 0.95rem;
        border-radius: 16px;
        overflow: hidden;
    }

    .cmd-table th {
        background: #f5f5f7;
        padding: 14px 18px;
        border-bottom: 2px solid var(--border-light);
        text-align: left;
        font-weight: 800;
        color: var(--primary-color);
    }

    .cmd-table td {
        padding: 12px 18px;
        border-bottom: 1px solid var(--border-light);
    }

    .cmd-table code {
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 0.85rem;
        color: #d35400;
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
    }

    .btn-primary-nav {
        background: var(--primary-color);
        color: white;
    }

    .btn-primary-nav:hover {
        filter: brightness(0.9);
    }

    /* 青ボックス */
    .box-blue {
        background: #eef4ff;
        border-left: 4px solid #3b82f6;
        border-radius: 20px;
        padding: 24px 28px;
        margin: 32px 0;
    }

    /* レスポンシブ */
    @media (max-width: 768px) {
        .section-padding {
            padding-top: 130px !important;
            padding-bottom: 60px;
        }
        
        .news-detail-container {
            padding: 32px 20px;
        }
        
        .news-title {
            font-size: 1.6rem;
        }
    }

    @media (max-width: 480px) {
        .section-padding {
            padding-top: 110px !important;
            padding-bottom: 50px;
        }
        
        .news-title {
            font-size: 1.4rem;
            line-height: 1.4 !important;
        }
        
        .news-content h2 {
            font-size: 1.4rem;
        }
        
        .news-content h3 {
            font-size: 1.2rem;
        }
        
        .news-footer {
            flex-direction: column;
            align-items: stretch;
        }
        
        .btn-nav {
            text-align: center;
        }
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
                <h1 class="news-title"><?php echo nl2br(htmlspecialchars($clean_title)); ?></h1>
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
</body>
</html>
    <?php
    return ob_get_clean();
}
?>