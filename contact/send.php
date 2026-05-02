<?php
/**
 * 箱庭クラフト お問い合わせ送信プログラム (Cloudflare Turnstile & IP対応版)
 * 修正版：cURL通信エラー対策済み
 */

// --- 設定エリア ---
$to_email        = "contact@mail.uni-guild.com"; 
$site_name       = "箱庭クラフト";
$thanks_url      = "https://hakoniwa-craft.com/contact";
// Cloudflareで発行した「シークレットキー」をここに入力
$turnstile_secret = "0x4AAAAAACuYCnB-Vf-0Bcix9LQ8SxUjyrk"; 
// -----------------

mb_language("Japanese");
mb_internal_encoding("UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Cloudflare Turnstile 認証 ---
    $turnstile_response = isset($_POST['cf-turnstile-response']) ? $_POST['cf-turnstile-response'] : '';
    $remote_ip = isset($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : $_SERVER['REMOTE_ADDR'];

    // Cloudflareへ検証リクエスト
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://challenges.cloudflare.com/turnstile/v1/siteverify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret'   => $turnstile_secret,
        'response' => $turnstile_response,
        'remoteip' => $remote_ip
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // 【重要】サーバー環境による通信エラーを防ぐ設定
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // SSL証明書の検証をスキップ
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);           // タイムアウト設定（10秒）

    $response = curl_exec($ch);
    
    // cURL自体のエラーが発生していないか確認
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        curl_close($ch);
        die("サーバー間通信エラーが発生しました。設定を確認してください: " . $error_msg);
    }
    
    curl_close($ch);
    
    // 結果をデコード
    $result = json_decode($response, true);

    // 認証失敗時の処理（結果がnull、またはsuccessがfalseの場合）
    if (!isset($result['success']) || !$result['success']) {
        die("認証に失敗しました。Botと判断されたか、認証サーバーに接続できませんでした。ブラウザの戻るボタンで戻り、やり直してください。");
    }

    // --- フォームデータの受け取りとサニタイズ ---
    $name    = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
    $email   = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
    $subject_user = htmlspecialchars($_POST['subject'] ?? '', ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');

    // メールの件名と本文の構築
    $mail_subject = "【{$site_name}】お問い合わせ：{$subject_user}";
    $mail_body  = "--------------------------------------------------\n";
    $mail_body .= " {$site_name} 公式サイトからのお問い合わせ\n";
    $mail_body .= "--------------------------------------------------\n\n";
    $mail_body .= "【お名前】\n{$name}\n\n";
    $mail_body .= "【メールアドレス】\n{$email}\n\n";
    $mail_body .= "【件名】\n{$subject_user}\n\n";
    $mail_body .= "【内容】\n{$message}\n\n";
    $mail_body .= "--------------------------------------------------\n";
    $mail_body .= "送信元IP: " . $remote_ip . "\n";

    // メールヘッダーの設定
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // メール送信の実行
    if (mb_send_mail($to_email, $mail_subject, $mail_body, $headers)) {
        // 送信完了画面の表示
        echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><title>送信完了</title>";
        echo "<link rel='stylesheet' href='https://uni-guild.com/css/style-v1.0.css'>";
        echo "</head><body style='background-color:#fdfaf5;'>";
        echo "<div style='text-align:center; padding:100px 20px; font-family:\"Zen Maru Gothic\", sans-serif;'>";
        echo "<h2 style='color:#d4a373;'>お問い合わせを送信しました</h2>";
        echo "<p>内容を確認次第、担当者より返信いたします。</p>";
        echo "<div style='margin-top:30px;'><a href='{$thanks_url}' style='display:inline-block; padding:10px 25px; background:#d4a373; color:white; text-decoration:none; border-radius:50px;'>フォームへ戻る</a></div>";
        echo "</div></body></html>";
    } else {
        echo "メールの送信に失敗しました。サーバーのメール送信機能が無効な可能性があります。";
    }
} else {
    // POST以外でのアクセスの場合はリダイレクト
    header("Location: " . $thanks_url);
    exit;
}
?>