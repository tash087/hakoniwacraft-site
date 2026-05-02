const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/save-data', (req, res) => {
    const newData = req.body.data;

    // 'output.txt' に追記（改行付き）
    fs.appendFile('output.txt', newData + '\n', (err) => {
        if (err) {
            console.error('書き込み失敗:', err);
            return res.status(500).send('Server Error');
        }
        res.send('Saved!');
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));