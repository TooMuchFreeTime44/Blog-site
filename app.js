const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello, World and Michael Keliher! (from the Node.js backend!)" });
});

app.listen(PORT, () => {
    console.log('Server is running at http://localhost:' + PORT);
});