import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('editor');
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <>
      <NavBar view={view} setView={setView} />
      {view === 'editor' && (
        <EditorMode />
      )}
      {view === 'reader' && (
        <ReaderMode 
        onSelectedPost={(post) => {
          setSelectedPost(post)
          setView('single')
        }}/>
      )}
      {view === 'single' && (
        <SingleReaderMode selectedPost={selectedPost} />
      )}
    </>
  )
}

function NavBar({view, setView}) {
  return (
    <header id="main-header">
      <h1 className="logo">Inkpad</h1>
      <nav className="nav-links">
        {view !== 'single' ? (
          <>
            <button
              id="go-to-editor"
              disabled={view === 'editor'}
              onClick={() => setView('editor')}
            >Editor</button>
            <button
              id="go-to-reader"
              disabled={view === 'reader'}
              onClick={() => setView('reader')}
            >Reader</button>
          </>
        ) : (
          <button
            id="back-button"
            onClick={() => setView('reader')}
          >Back</button>
        )}
      </nav>
    </header>
  )
}

function EditorMode() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = async () => {
    try {
      let blog = {
        title: title,
        content: content,
        createdAt: Date.now()
      };

      const response = await fetch('/api/post_blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(blog)
      });

      if(response.ok) {
        setTitle('');
        setContent('');
        console.log('Post published');
      }
    } catch (err) {
      console.error('Failed to publish post:', err);
    }
  }

  return (
    <>
      <h2>Editor</h2>
      <textarea
        id="title-area"
        placeholder="Title here..."
        rows="1"
        cols="50"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        ></textarea>
      <br />
      <textarea
        id="content-area"
        placeholder="Write here..."
        rows="19"
        cols="50"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        ></textarea>
      <br />
      <button id="publish-button" disabled={title.trim() === ''} onClick={handlePublish}>Publish</button>
    </>
  )
}

function ReaderMode({ onSelectedPost }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/post_list')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to fetch posts:', err))
  }, []);

  return (
    <>
      <h2>Reader</h2>
      <menu id="title-list" style={{ listStyleType: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post._id}
            onClick={() => onSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </menu>
    </>
  )
}

function SingleReaderMode({ selectedPost }) {
  if (!selectedPost) {
    return null
  }
  return (
    <>
      <h2>Reader</h2>
      <h3 id="title-location">{selectedPost.title}</h3>
      <p id="content-location" style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</p>
    </>
  )
}

export default App