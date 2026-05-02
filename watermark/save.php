<?php
header('Content-Type: application/json');

// エラー出力を抑制（JSONを壊さないため）
error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['image'])) {
    $raw = $_POST['image'];
    
    // Base64デコード
    if (preg_match('/^data:image\/(\w+);base64,/', $raw, $matches)) {
        $ext = strtolower($matches[1]);
        $data = base64_decode(substr($raw, strpos($raw, ',') + 1));
        
        if (!$data) {
            echo json_encode(['success' => false, 'message' => 'デコード失敗']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'データ形式エラー']);
        exit;
    }

    // 保存ディレクトリ作成
    $dir = 'image/';
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }

    // ファイル名生成
    $filename = 'mf_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $path = $dir . $filename;

    // 書き込み
    if (file_put_contents($path, $data)) {
        echo json_encode(['success' => true, 'filename' => $filename]);
    } else {
        echo json_encode(['success' => false, 'message' => '書き込み権限エラー']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'リクエスト無効']);
}