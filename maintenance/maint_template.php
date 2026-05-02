<?php
function render_update_logs($json_path = 'maint_logs.json') {
    // ファイルが存在するかチェック（デバッグ用メッセージ付き）
    if (!file_exists($json_path)) {
        return "";
    }

    $json_raw = file_get_contents($json_path);
    $logs = json_decode($json_raw, true);

    if (empty($logs)) {
        return "<p>現在、メンテナンス履歴はありません。</p>";
    }

    ob_start();
    ?>
    <style>
        .maint-list { list-style: none; padding: 0; background: #fff; border-radius: 8px; border: 1px solid #eee; margin: 10px 0; }
        .maint-item { display: flex; align-items: center; padding: 12px 15px; border-bottom: 1px solid #eee; }
        .maint-item:last-child { border-bottom: none; }
        .maint-date { font-family: monospace; color: #888; width: 90px; flex-shrink: 0; }
        .maint-badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 3px; color: #fff; margin-right: 12px; flex-shrink: 0; text-align: center; min-width: 60px; }
        .maint-title { flex: 1; text-decoration: none; color: #333; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .maint-title:hover { text-decoration: underline; color: #3498db; }
        .bg-MAINT { background: #3498db; } .bg-UPDATE { background: #2ecc71; } .bg-URGENT { background: #e74c3c; } .bg-FIX { background: #f1c40f; }
    </style>
    <div class="maint-list">
        <?php foreach ($logs as $log): ?>
            <div class="maint-item">
                <span class="maint-date"><?php echo htmlspecialchars($log['date']); ?></span>
                <span class="maint-badge bg-<?php echo htmlspecialchars($log['category']); ?>">
                    <?php echo htmlspecialchars($log['category']); ?>
                </span>
                <a href="<?php echo htmlspecialchars($log['url']); ?>" class="maint-title">
                    <?php echo htmlspecialchars($log['summary']); ?>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
}