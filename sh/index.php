<?php
// --- 設定 ---
$site_key = "0x4AAAAAACuYCgGwnWsvAE-_"; // ★Cloudflareで取得したサイトキーを入力
$secret_key = "0x4AAAAAACuYCnB-Vf-0Bcix9LQ8SxUjyrk"; // ★Cloudflareで取得したシークレットキーを入力
$db_file = "links.db";             // データベースファイル名
$script_url = "https://uni-guild.com/sh/"; // ★このファイルのURL

// データベース準備
$db = new PDO("sqlite:$db_file");
$db->exec("CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, url TEXT)");

// --- 1. 転送処理 ---
if (isset($_GET['id'])) {
    $stmt = $db->prepare("SELECT url FROM links WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $link = $stmt->fetch();

    if ($link) {
        header("Location: " . $link['url']);
        exit;
    } else {
        die("有効なリンクではありません。");
    }
}

// --- 2. 管理画面の処理 ---
$message = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // --- Turnstile 検証処理 ---
    $token = $_POST['cf-turnstile-response'] ?? '';
    $verify_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $verify_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret' => $secret_key,
        'response' => $token,
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);

    // 検証成功（人間であると判断された）場合のみ保存
    if ($result['success']) {
        if (!empty($_POST['long_url']) && !empty($_POST['short_id'])) {
            $stmt = $db->prepare("INSERT OR REPLACE INTO links (id, url) VALUES (?, ?)");
            $stmt->execute([$_POST['short_id'], $_POST['long_url']]);
            $generated_url = $script_url . "?id=" . htmlspecialchars($_POST['short_id']);
            $message = "作成完了！: <a href='$generated_url' target='_blank'>$generated_url</a>";
        }
    } else {
        $message = "<span style='color:red;'>認証に失敗しました。チェックを入れてやり直してください。</span>";
    }
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
<link rel="shortcut icon" href="../images/server_icon.png" type="image/png">

    <script>
        document.write('<script src="../js/loader.js?v=' + Date.now() + '"><\/script>');
    </script>
    <meta charset="UTF-8">
    <title>短縮URL作成</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
        input { width: 100%; padding: 8px; margin: 10px 0; display: block; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer; margin-top: 10px; }
        .msg { margin-top: 20px; padding: 10px; background: #f8f9fa; word-break: break-all; }
        .cf-turnstile { margin: 15px 0; }
    </style>
</head>
<body>
    <h3>短縮URL作成フォーム</h3>
    <form method="post">
        <label>元の長いURL:</label>
        <input type="url" name="long_url" placeholder="https://example.com/..." required>
        
        <label>短縮ID（好きな英数字）:</label>
        <input type="text" name="short_id" placeholder="my-link" required>
        
        <div class="cf-turnstile" data-sitekey="<?php echo $site_key; ?>"></div>
        
        <button type="submit">URLを作成する</button>
    </form>

    <?php if ($message): ?>
        <div class="msg"><?php echo $message; ?></div>
    <?php endif; ?>
</body>
</html>