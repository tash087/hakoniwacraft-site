<?php
header("Access-Control-Allow-Origin: *");

// ログ保存先の設定
$dir = __DIR__ . '/save-data';
$file = $dir . '/output.txt';
if (!is_dir($dir)) { mkdir($dir, 0755, true); }

// デバッグ用：届いたすべてのデータを確認するための処理
$all_post = print_r($_POST, true);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && !empty($_POST['query'])) {
    $queryData = $_POST['query'];
    $logEntry = "[" . date('Y-m-d H:i:s') . "] SUCCESS: " . $queryData . "\n";
    file_put_contents($file, $logEntry, FILE_APPEND | LOCK_EX);
    echo "Success: Saved " . htmlspecialchars($queryData);
} else {
    // データが届かなかった場合、原因をログに書き込む
    $errorLog = "[" . date('Y-m-d H:i:s') . "] ERROR: Method=$method, ReceivedData=$all_post \n";
    file_put_contents($file, $errorLog, FILE_APPEND | LOCK_EX);
    
    echo "No data received. (Method: $method)";
}