/**
 * script.js
 */

const sheetInstances = {};

// テーブルの基本設定
const commonConfig = {
    columns: [
        { title: '番地', width: 60, readOnly: true, align: 'center' },
        { title: 'Minecraft ID', width: 200, align: 'center' },
        { title: '契約更新期限', width: 120, align: 'center' },
        { title: '備考', width: 300, align: 'left' },
    ],
    allowInsertRow: false,
    allowDeleteRow: false,
    contextMenu: function() { return false; } // 右クリックメニューを無効化
};

/**
 * 初期空データの生成
 */
function generateDefaultData(rowCount) {
    return Array.from({ length: rowCount }, (_, i) => [i + 1, "", "", ""]);
}

/**
 * 初期化処理
 */
$(document).ready(function() {
    // 1. ひまわりトンネル (22軒)
    sheetInstances.himawari = jexcel(document.getElementById('himawari'), {
        ...commonConfig,
        data: generateDefaultData(22)
    });

    // 2. ぽぷらんトンネル (26軒)
    sheetInstances.poplaran = jexcel(document.getElementById('poplaran'), {
        ...commonConfig,
        data: generateDefaultData(26)
    });

    // 3. ショッピングモール (10軒)
    sheetInstances.shoppingmall = jexcel(document.getElementById('shoppingmall'), {
        ...commonConfig,
        data: generateDefaultData(10)
    });
});

/**
 * 抽選実行
 */
function runLottery() {
    const sheetKey = $('#targetSheet').val();
    const mcid = $('#playerID').val().trim();
    const status = $('#statusLabel');
    const table = sheetInstances[sheetKey];

    // バリデーション
    if (!mcid) {
        status.css('color', '#e74c3c').text("⚠️ IDを入力してください");
        return;
    }

    // 1. 全行スキャンして空き（ID列が空）のIndexを抽出
    const data = table.getData();
    let emptyRowIndexes = [];

    data.forEach((row, index) => {
        const idCell = row[1]; // Index 1 = Minecraft ID
        if (!idCell || idCell.toString().trim() === "") {
            emptyRowIndexes.push(index);
        }
    });

    // 2. 空き状況判定
    if (emptyRowIndexes.length === 0) {
        status.css('color', '#e74c3c').text("❌ 満員のため、このエリアでは抽選できません");
        return;
    }

    // 3. ランダム抽選
    const winnerIndex = emptyRowIndexes[Math.floor(Math.random() * emptyRowIndexes.length)];
    const addressNo = data[winnerIndex][0];

    // 4. 書き込み
    // setValueFromCoords(列, 行, 値)
    table.setValueFromCoords(1, winnerIndex, mcid);    // ID記入
    table.setValueFromCoords(2, winnerIndex, "03/31"); // 期限記入（例）

    // 5. 結果表示
    status.css('color', '#27ae60').text(`✅ 当選！ ${addressNo}番地に記入しました`);
    $('#playerID').val(""); // 入力欄リセット
}