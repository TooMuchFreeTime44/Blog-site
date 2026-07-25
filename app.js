const express = require('express');
const app = express();
const PORT = 3000;

let posts = [];

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/post_blog', (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    res.json({
        status: "received"
    });
});

app.get('/api/post_list', (req, res) => {
    res.json(posts);
});

app.listen(PORT, () => {
    console.log('Server is running at http://localhost:' + PORT);
});