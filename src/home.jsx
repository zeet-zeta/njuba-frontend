import React, { useState } from 'react';
import './css/home.css'
import { UserAvatar } from './avatar';
import { Categories } from './category';
import { NewPost } from './newpost';
import { Post } from './post';

function Home() {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '/login';
  }
  const username = localStorage.getItem('username');
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');//提升状态

  return (
    <div className="app">
      <div className="sidebar">
        <h2>NJUba</h2>
        <h2>Hello, {username}</h2>
        <UserAvatar refresh={refresh} setRefresh={setRefresh}/>
        <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="main-content">
        <NewPost posts={posts} setPosts={setPosts} setPostsCount={setPostsCount}/>
        <Post category={selectedCategory} posts={posts} setPosts={setPosts} refresh={refresh} postsCount={postsCount} setPostsCount={setPostsCount}/>
      </div>
    </div>
  );
}
export default Home;