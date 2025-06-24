import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import CommunityPopup from '../components/CommunityPopup';
import { FaPlus } from 'react-icons/fa';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [auth, setAuth] = useState({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
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
          liked: post.liked,
          disliked: post.disliked
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Error al obtener posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, {
        withCredentials: true
      });
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
            {loading ? (
              <Loader />
            ) : (
              <>
                <div
                  className="community-card create-post-card"
                  onClick={() => {
                    if (!auth.authenticated) return navigate('/login');
                    setPopupOpen(true);
                  }}
                >
                  <div className="bottom-community-card" style={{ alignItems: 'center' }}>
                    <FaPlus size={24} />
                    <p className="community-card-text">Crear un post</p>
                  </div>
                </div>
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
              </>
            )}
          </div>
        </div>
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
