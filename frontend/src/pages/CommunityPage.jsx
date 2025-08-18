import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import CommunityPopup from '../components/CommunityPopup';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '@clerk/clerk-react';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [auth, setAuth] = useState({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, getToken } = useAuth();

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
      let token;
      if (isLoaded && isSignedIn) {
        token = await getToken({ template: 'integration_fallback' });
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setAuth(res.data);
    } catch (err) {
      console.error('Error al verificar sesión:', err);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, [isLoaded, isSignedIn, getToken]);

  const handleLike = async (id) => {
    if (!auth.authenticated) return navigate('/login');
    const original = [...posts];
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      let liked = !p.liked;
      let disliked = liked ? false : p.disliked;
      let likes = p.likes;
      let dislikes = p.dislikes;
      if (p.liked) {
        likes -= 1;
      } else if (p.disliked) {
        dislikes -= 1;
        likes += 1;
      } else {
        likes += 1;
      }
      return { ...p, liked, disliked, likes, dislikes };
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/darLike`, { idPost: id }, {
        withCredentials: true
      });
    } catch (error) {
      setPosts(original);
      console.error('Error al dar like:', error);
    }
  };

  const handleDislike = async (id) => {
    if (!auth.authenticated) return navigate('/login');
    const original = [...posts];
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      let disliked = !p.disliked;
      let liked = disliked ? false : p.liked;
      let likes = p.likes;
      let dislikes = p.dislikes;
      if (p.disliked) {
        dislikes -= 1;
      } else if (p.liked) {
        likes -= 1;
        dislikes += 1;
      } else {
        dislikes += 1;
      }
      return { ...p, liked, disliked, likes, dislikes };
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/darDislike`, { idPost: id }, {
        withCredentials: true
      });
    } catch (error) {
      setPosts(original);
      console.error('Error al dar dislike:', error);
    }
  };

  const handlePost = async () => {
    if (!auth.authenticated) return navigate('/login');
    if (newPostContent.trim() === '') {
      return alert('El contenido no puede estar vacío.');
    }
    try {
      let imageUrl = null;
      if (selectedImage) {
        const key = import.meta.env.VITE_IMGBB_KEY;
        if (key) {
          const formData = new FormData();
          formData.append('image', selectedImage);
          try {
            const imgbbRes = await axios.post(
              `https://api.imgbb.com/1/upload?key=${key}`,
              formData
            );
            imageUrl = imgbbRes.data.data.url;
          } catch (err) {
            console.error('Error al subir la imagen a imgbb:', err);
            alert('No se pudo subir la imagen, se publicará sin ella.');
          }
        } else {
          console.warn('VITE_IMGBB_KEY no definido, omitiendo subida de imagen');
        }
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/publicarPost`,
        { contenidoPost: newPostContent, imagenUrl: imageUrl },
        {
          withCredentials: true
        }
      );
      fetchPosts();
      setNewPostContent('');
      setSelectedImage(null);
      setPreviewUrl(null);
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
        onClose={() => {
          setPopupOpen(false);
          setPreviewUrl(null);
          setSelectedImage(null);
        }}
        onPost={handlePost}
        content={newPostContent}
        setContent={setNewPostContent}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        setSelectedImage={setSelectedImage}
      />
    </>
  );
};

export default CommunityPage;
