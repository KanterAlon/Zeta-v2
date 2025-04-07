import React, { useState, useEffect } from 'react';
import CommunityCard from '../components/CommunityCard';
import CommunityPopup from '../components/CommunityPopup';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('communityPosts');
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      // Posts de ejemplo
      const sample = [
        {
          id: 'post_1',
          contenido: '¡Bienvenidos a la comunidad!',
          imagen_url: '',
          fecha: new Date().toLocaleString(),
          likes: 0,
          dislikes: 0,
          liked: false,
          disliked: false
        }
      ];
      localStorage.setItem('communityPosts', JSON.stringify(sample));
      setPosts(sample);
    }
  }, []);

  const updateLocalStorage = (updated) => {
    localStorage.setItem('communityPosts', JSON.stringify(updated));
    setPosts(updated);
  };

  const handleLike = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        const liked = !post.liked;
        return {
          ...post,
          liked,
          disliked: liked ? false : post.disliked,
          likes: liked ? post.likes + 1 : post.likes - 1,
          dislikes: liked && post.disliked ? post.dislikes - 1 : post.dislikes
        };
      }
      return post;
    });
    updateLocalStorage(updated);
  };

  const handleDislike = (id) => {
    const updated = posts.map(post => {
      if (post.id === id) {
        const disliked = !post.disliked;
        return {
          ...post,
          disliked,
          liked: disliked ? false : post.liked,
          dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1,
          likes: disliked && post.liked ? post.likes - 1 : post.likes
        };
      }
      return post;
    });
    updateLocalStorage(updated);
  };

  const handlePost = () => {
    if (newPostContent.trim() === '') return alert('El contenido no puede estar vacío.');

    const newPost = {
      id: 'post_' + Date.now(),
      contenido: newPostContent,
      imagen_url: '', // después podés agregar upload
      fecha: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false
    };

    const updated = [newPost, ...posts];
    updateLocalStorage(updated);
    setNewPostContent('');
    setPopupOpen(false);
  };

  return (
    <>
      <section className="community-section">
        <div className="inner-community">
          <h1 className="community-title">Comunidad</h1>
          <div className="community-cards-container">
            {posts.length === 0 ? (
              <p>No hay posts aún. ¡Sé el primero en publicar!</p>
            ) : (
              posts.map(post => (
                <CommunityCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onDislike={handleDislike}
                />
              ))
            )}
          </div>
        </div>

        <button className="button-add-post" onClick={() => setPopupOpen(true)}>
          <img src="/img/icon_button_add.svg" />
        </button>
      </section>

      <CommunityPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onPost={handlePost}
        content={newPostContent}
        setContent={setNewPostContent}
      />
    </>
  );
};

export default CommunityPage;
