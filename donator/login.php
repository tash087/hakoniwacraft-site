<?php
session_start();
// すでにログインしている場合はラウンジへ飛ばす
if (isset($_SESSION['user_id'])) {
    header("Location: ../donator/donator-lounge.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン | 箱庭クラフト</title>
<link rel="stylesheet" href="https://uni-guild.com/css/common.css?random=vhq09w83eb">
<link rel="stylesheet" href="https://uni-guild.com/css/style.css?random=vhq09w83eb">
<link rel="stylesheet" href="https://uni-guild.com/css/about-update.css?random=vhq09w83eb">
<link rel="stylesheet" href="https://uni-guild.com/css/news.css?random=vhq09w83eb">
<link rel="shortcut icon" href="https://uni-guild.com/images/server_icon.png" type="image/png">
<script src="https://uni-guild.com/js/include.js?random=vhq09w83eb" defer></script>
<script src="https://uni-guild.com/js/day-count.js?random=vhq09w83eb" defer></script>
<script src="https://uni-guild.com/js/slider.js?random=vhq09w83eb" defer></script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

    <style>
        .login-help {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px dashed #ddd;
            font-size: 0.85rem;
            color: #666;
            line-height: 1.6;
        }
        .help-link {
            color: #e67e22;
            text-decoration: none;
            font-weight: bold;
        }
        .help-link:hover {
            text-decoration: underline;
        }
        .forgot-password {
            display: block;
            margin-top: 10px;
            text-align: right;
            font-size: 0.8rem;
        }

        /* 2. Turnstileウィジェットのスタイル調整 */
        .cf-turnstile {
            margin: 15px 0;
            display: flex;
            justify-content: center;
        }
        /* ボタンが無効な時の見た目 */
        .btn-primary-nav:disabled {
            background-color: #ccc !important;
            cursor: not-allowed !important;
            opacity: 0.7;
        }
    </style>

    <script>
        // 3. 認証成功時にボタンを有効化する関数
        function onTurnstileSuccess() {
            document.getElementById('login-btn').disabled = false;
        }
    </script>
</head>
<body>
    <div id="header-placeholder"></div>

    <main class="container">
        <div class="login-card">
            <div class="login-header">
                <h1>Member Login</h1>
                <p>寄付者・運営専用ラウンジへ</p>
            </div>

            <form action="../admin/auth.php" method="POST">
                
                <div class="form-group">
                    <label for="user_id">Minecraft ID (ログインID)</label>
                    <input type="text" id="user_id" name="user_id" placeholder="IDを入力" 
                           autocomplete="username" required>
                </div>

                <div class="form-group">
                    <label for="password">パスワード</label>
                    <input type="password" id="password" name="password" placeholder="••••••••" 
                           autocomplete="current-password" required>
                    <a href="#help-info" class="forgot-password help-link">パスワードを忘れた場合(下部記載)</a>
                </div>

                <div class="cf-turnstile" 
                     data-sitekey="0x4AAAAAACuYCgGwnWsvAE-_" 
                     data-callback="onTurnstileSuccess"></div>

                <button type="submit" id="login-btn" class="btn-nav btn-primary-nav" 
                        style="width: 100%; border: none; cursor: pointer; margin-top: 15px; padding: 12px;" 
                        disabled>
                    ログイン
                </button>
            </form>

            <div id="help-info" class="login-help">
                <p><strong>【新規登録をご希望の方】</strong><br>
                当サーバーでは運営による手動登録制を採用しております。アカウント作成や寄付特典の反映については、<a href="https://discord.gg/your-link" class="help-link" target="_blank">公式Discord</a>の「お問い合わせ」よりご連絡ください。</p>
                
                <p style="margin-top: 15px;"><strong>【寄付について】</strong><br>
                サーバーの維持・運営をご支援いただける方は、こちらの<a href="../pages/donation-info.html" class="help-link">寄付に関するご案内</a>をご確認ください。</p>

                <p style="margin-top: 15px;"><strong>【ログインできない方】</strong><br>
                パスワードを忘れた場合やログインできない場合は、ご本人様確認のため運営まで直接お申し付けください。</p>

                <p style="margin-top:25px; text-align: center;"><a href="../index.html">← ホームへ戻る</a></p>
            </div>
        </div>
    </main>

    <div id="footer-placeholder"></div>
</body>
</html>