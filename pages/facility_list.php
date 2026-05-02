<?php
$json_file = '../admin/facilities/facilities.json';
$facilities = json_decode(file_get_contents($json_file), true) ?: [];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>有料公共施設一覧</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../images/server_icon.png" type="image/png">
    <style>
        /* 既存のCSSをベースに調整 */
        <?php include('style.css'); ?>
        
        :root {
            --primary-color: #e67e22;
            --bg-color: #fdfaf6;
            --text-color: #4a4a4a;
            --white: #ffffff;
        }
        body { font-family: 'Zen Maru Gothic', sans-serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; }
        
        /* 施設一覧用カスタムスタイル */
        .facility-section { padding: 60px 20px; max-width: 1000px; margin: 0 auto; }
        .rule-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: var(--white);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .rule-table th {
            background-color: var(--primary-color);
            color: white;
            padding: 15px;
            text-align: center;
        }
        .rule-table td {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            text-align: center;
        }
        .rank-name { font-weight: 800; color: var(--text-color); }
        .price-tag { color: #e67e22; font-weight: bold; font-size: 1.1rem; }
        .desc-text { text-align: left; font-size: 0.9rem; line-height: 1.6; }
        .status-badge {
            font-size: 0.75rem;
            padding: 3px 8px;
            border-radius: 4px;
            background: #eee;
        }
        .status-active { background: #e8f5e9; color: #2e7d32; }

        /* カウンター表示用スタイル */
        
        @media (max-width: 600px) {
            .rule-table thead { display: none; }
            .rule-table tr { display: block; border-bottom: 2px solid var(--primary-color); margin-bottom: 10px; }
            .rule-table td { display: block; text-align: right; padding: 10px 20px; }
            .rule-table td::before { content: attr(data-label); float: left; font-weight: bold; color: var(--primary-color); }
            .desc-text { text-align: left !important; }
        }
    </style>
    <script src="../js/include.js?randomcode=pQ7@9g33" defer></script>
    <script src="../js/day-count.js?randomcode=pQ7@9g33" defer></script>
    <script src="../js/slider.js?randomcode=pQ7@9g33" defer></script>
</head>
<body>

<div id="header-placeholder"></div>

<section class="facility-section">
    <div class="section-title">
        有料公共施設一覧
        <span>Paid Public Facilities</span>
    </div>

    <div class="rule-info-box">
        <p>売上は一部作成者へ還元されます。</p>
    </div>

    <table class="rule-table">
        <thead>
            <tr>
                <th>施設名</th>
                <th>利用料金</th>
                <th>詳細説明</th>
            </tr>
        </thead>
        <tbody>
            <?php if(empty($facilities)): ?>
                <tr><td colspan="3">現在、登録されている施設はありません。</td></tr>
            <?php else: ?>
                <?php foreach($facilities as $item): ?>
                <tr>
                    <td class="rank-name" data-label="施設名">
                        <?php echo htmlspecialchars($item['name']); ?><br>
                        <span class="status-badge <?php echo ($item['status'] == '稼働中') ? 'status-active' : ''; ?>">
                            <?php echo htmlspecialchars($item['status']); ?>
                        </span>
                    </td>
                    <td class="price-tag" data-label="利用料金">
                        <?php echo htmlspecialchars($item['price']); ?>
                    </td>
                    <td class="desc-text" data-label="詳細説明">
                        <?php echo nl2br(htmlspecialchars($item['description'])); ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</section>

<div id="footer-placeholder"></div>

<script src="../js/include.js"></script>
<script src="../js/day-count.js"></script>

</body>
</html>