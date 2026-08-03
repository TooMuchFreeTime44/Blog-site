import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 3000;

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then(() => {
        console.log('Database connection succesful')

        app.listen(PORT, () => {
            console.log('Server is running');
        });
    })
    .catch((err) => console.log('Database connection error:', err));
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/post_blog', async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content
        });
        await newPost.save();

        res.json({ status: "success", message: "Post saved to database!" });
    } catch(err) {
        console.error('Error saving post to database:', err);
        res.status(500).json({ error: "Failed to save post to database." });
    }
});

app.get('/api/post_list', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch(err) {
        console.error('Error retrieving posts from database:', err);
        res.status(500).json({ error: "Failed to retrieve posts from database" });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('/(.*)', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}