<?php
/**
 * 箱庭クラフト お問い合わせ送信プログラム
 * (公式ドキュメント v0 準拠 / 成功時自動リダイレクト版)
 */

// --- 設定エリア ---
$to_email        = "contact@mail.uni-guild.com"; 
$site_name       = "箱庭クラフト";
$thanks_url      = "https://uni-guild.com/contact"; // 送信後に飛ばしたいURL
$turnstile_secret = "0x4AAAAAACuYCnB-Vf-0Bcix9LQ8SxUjyrk"; 
// -----------------

mb_language("Japanese");
mb_internal_encoding("UTF-8");

/**
 * Turnstileトークンを検証する関数
 */
function validateTurnstile($token, $secret, $remoteip = null) {
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $data = [
        'secret'   => $secret,
        'response' => $token
    ];
    if ($remoteip) {
        $data['remoteip'] = $remoteip;
    }

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 10
        ]
    ];
    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);

    if ($response === FALSE) {
        return ['success' => false, 'error-codes' => ['internal-error']];
    }
    return json_decode($response, true);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $token = $_POST['cf-turnstile-response'] ?? '';
    $remoteip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

    // 1. Turnstile検証
    $validation = validateTurnstile($token, $turnstile_secret, $remoteip);

    if ($validation['success']) {
        // 2. 認証成功：データ受け取り
        $name    = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
        $email   = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
        $subject = htmlspecialchars($_POST['subject'] ?? '', ENT_QUOTES, 'UTF-8');
        $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');

        // 3. メール本文作成
        $mail_subject = "【{$site_name}】お問い合わせ：{$subject}";
        $mail_body  = "お名前: {$name}\n";
        $mail_body .= "メール: {$email}\n\n";
        $mail_body .= "内容:\n{$message}\n\n";
        $mail_body .= "送信元IP: {$remoteip}";

        $headers = "From: contact@uni-guild.com\r\n"; // サーバー認証済みのドメインメール推奨
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // 4. メール送信実行
        if (mb_send_mail($to_email, $mail_subject, $mail_body, $headers)) {
            
            // --- 成功時：自動リダイレクト処理 ---
            // A. 即座にリダイレクトする場合（推奨）
            header("Location: " . $thanks_url . "?status=success");
            exit;

            /* // B. メッセージを出してから数秒後にリダイレクトしたい場合は、Aをコメントアウトして以下を使います
            echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'>";
            echo "<meta http-equiv='refresh' content='3;URL={$thanks_url}'>"; // 3秒後に移動
            echo "<title>送信完了</title></head><body style='text-align:center; padding-top:100px;'>";
            echo "<h2>お問い合わせを送信しました</h2><p>3秒後に元のページに戻ります...</p></body></html>";
            exit;
            */

        } else {
            die("メールの送信に失敗しました。サーバーの設定を確認してください。");
        }
    } else {
        // 5. 認証失敗
        $error_codes = isset($validation['error-codes']) ? implode(', ', $validation['error-codes']) : 'unknown';
        die("認証に失敗しました。ブラウザの戻るボタンでやり直してください。(Error: " . htmlspecialchars($error_codes) . ")");
    }
} else {
    header("Location: " . $thanks_url);
    exit;
}