<?php
/**
 * 箱庭クラフト お問い合わせ送信プログラム (Method Not Allowed 対策版)
 */

// --- 設定エリア ---
$to_email        = "contact@mail.uni-guild.com"; 
$site_name       = "箱庭クラフト";
$thanks_url      = "https://hakoniwa-craft.com/contact";
$turnstile_secret = "0x4AAAAAACuYCnB-Vf-0Bcix9LQ8SxUjyrk"; 
// -----------------

mb_language("Japanese");
mb_internal_encoding("UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $turnstile_response = $_POST['cf-turnstile-response'] ?? '';
    $remote_ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

    // --- Cloudflare検証 (ここを修正しました) ---
    $url = "https://challenges.cloudflare.com/turnstile/v1/siteverify";
    $post_data = [
        'secret'   => $turnstile_secret,
        'response' => $turnstile_response,
        'remoteip' => $remote_ip
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true); // 明示的にPOSTを使用
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']); // ヘッダーを明示
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $curl_error = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); // HTTPステータスコードを取得
    curl_close($ch);
    
    $result = json_decode($response, true);

    // --- エラー判定の強化 ---
    if ($http_code !== 200 || !isset($result['success']) || !$result['success']) {
        echo "<h2>認証エラーの詳細</h2>";
        echo "<p>HTTPステータス: " . htmlspecialchars($http_code) . "</p>";
        
        if ($http_code == 405) {
            echo "<p>原因: <strong>Method Not Allowed</strong> (サーバーの通信設定により、POSTリクエストが拒否されました。URLの末尾などを確認してください。)</p>";
        }

        if (isset($result['error-codes'])) {
            echo "<p>エラーコード: " . implode(', ', $result['error-codes']) . "</p>";
        }
        
        echo "<p>レスポンス内容: " . htmlspecialchars($response) . "</p>";
        echo "<hr><a href='javascript:history.back()'>戻ってやり直す</a>";
        exit;
    }

    // --- 以下、メール送信処理 (前回と同じ) ---
    $name    = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $email   = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
    $subject_user = htmlspecialchars($_POST['subject'] ?? '', ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');

    $mail_subject = "【{$site_name}】お問い合わせ：{$subject_user}";
    $mail_body  = "【お名前】\n{$name}\n\n【メールアドレス】\n{$email}\n\n【内容】\n{$message}\n\n送信元IP: {$remote_ip}";

    $headers = "From: " . $to_email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mb_send_mail($to_email, $mail_subject, $mail_body, $headers)) {
        echo "送信完了しました。";
    } else {
        echo "メール送信失敗。";
    }
}
?>