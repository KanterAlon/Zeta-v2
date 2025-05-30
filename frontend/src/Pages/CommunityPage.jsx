import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import CommunityPopup from '../components/CommunityPopup';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [auth, setAuth] = useState({ authenticated: false });
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/obtenerPosts`, {withCredentials: true});
      if (response.data.success) {
        const mappedPosts = response.data.posts.map(post => ({
          id: post.id_post,
          contenido: post.contenido_post,
          fecha: new Date(post.fecha_creacion).toLocaleString(),
          imagen_url: post.imagen_url,
          likes: post.likes,
          dislikes: post.dislikes,
          liked: false,
          disliked: false
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Error al obtener posts:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, {
        withCredentials: true
      });
      console.log(res)
      setAuth(res.data);
    } catch (err) {
      console.error('Error al verificar sesión:', err);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    if (!auth.authenticated) return navigate('/login');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/darLike`, { idPost: id }, {
        withCredentials: true
      });
      fetchPosts();
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleDislike = async (id) => {
    if (!auth.authenticated) return navigate('/login');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/darDislike`, { idPost: id }, {
        withCredentials: true
      });
      fetchPosts();
    } catch (error) {
      console.error('Error al dar dislike:', error);
    }
  };

  const handlePost = async () => {
    if (!auth.authenticated) return navigate('/login');
    if (newPostContent.trim() === '') {
      return alert('El contenido no puede estar vacío.');
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/publicarPost`, { contenidoPost: newPostContent }, {
        withCredentials: true
      });
      fetchPosts();
      setNewPostContent('');
      setPopupOpen(false);
    } catch (error) {
      console.error('Error al publicar el post:', error);
    }
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

        <button className="button-add-post" onClick={() => {
          if (!auth.authenticated) return navigate('/login');
          setPopupOpen(true);
        }}>
          <img src="./img/icon_button_add.svg" alt="Agregar post" />
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
