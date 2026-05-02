// メンバーが増減した際は、この配列の順番を入れ替えるだけで全ページに反映されます
const STAFF_LIST = [
    { name: "tash087", id: "tash087" },
    { name: "kosasokami", id: "kosasokami" },
    { name: "Luke_Astrea", id: "luke_astrea" },
    { name: "chihiro829", id: "chihiro829" }
];

document.addEventListener("DOMContentLoaded", () => {
    // 1. URLから ?name=xxx の値を取得する
    const urlParams = new URLSearchParams(window.location.search);
    const currentName = urlParams.get('name');

    // 2. 配列の中から現在のメンバーのインデックスを探す
    const currentIndex = STAFF_LIST.findIndex(s => s.id === currentName);

    // メンバーが見つかった場合のみボタンを更新
    if (currentIndex !== -1) {
        // 3. 前後のインデックスを計算（ループするように設定）
        const prevIndex = (currentIndex - 1 + STAFF_LIST.length) % STAFF_LIST.length;
        const nextIndex = (currentIndex + 1) % STAFF_LIST.length;

        const prevBtn = document.getElementById('prev-staff');
        const nextBtn = document.getElementById('next-staff');

        // 4. ボタンのリンクとテキストを書き換え
        if (prevBtn) {
            prevBtn.href = `member?name=${STAFF_LIST[prevIndex].id}`;
            prevBtn.innerHTML = `← ${STAFF_LIST[prevIndex].name}`;
        }
        if (nextBtn) {
            nextBtn.href = `member?name=${STAFF_LIST[nextIndex].id}`;
            nextBtn.innerHTML = `${STAFF_LIST[nextIndex].name} →`;
        }
    } else {
        // 万が一URLパラメータがない、またはリストにない場合
        const prevBtn = document.getElementById('prev-staff');
        const nextBtn = document.getElementById('next-staff');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
});