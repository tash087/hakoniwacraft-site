<?php
header("Access-Control-Allow-Origin: *");

$dir = __DIR__ . '/save-data';
$file = $dir . '/output.txt';
if (!is_dir($dir)) { mkdir($dir, 0755, true); }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && !empty($_POST['query'])) {
    $queryData = $_POST['query'];

    // --- ここからデコード（読みやすくする処理） ---
    // 1. URLエンコード（%20など）を元の文字（スペースなど）に戻す
    $queryData = urldecode($queryData);

    // 2. HTML実体参照（&amp;など）を元の記号（&）に戻す
    $queryData = html_entity_decode($queryData);
    // ------------------------------------------

    $logEntry = "[" . date('Y-m-d H:i:s') . "] SUCCESS: " . $queryData . "\n";
    
    // ログファイルに保存（生データを保存）
    file_put_contents($file, $logEntry, FILE_APPEND | LOCK_EX);
    
    // ブラウザへの表示用（XSS対策でhtmlspecialcharsを使用）
    echo "Success: Saved " . htmlspecialchars($queryData);

} else {
    $all_post = print_r($_POST, true);
    $errorLog = "[" . date('Y-m-d H:i:s') . "] ERROR: Method=$method, ReceivedData=$all_post \n";
    file_put_contents($file, $errorLog, FILE_APPEND | LOCK_EX);
    echo "No data received. (Method: $method)";
}