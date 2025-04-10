import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommunityCard from '../components/CommunityCard';
import CommunityPopup from '../components/CommunityPopup';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Función para traer los posts desde la base de datos
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/obtenerPosts');
      if (response.data.success) {
        // Mapeamos la respuesta para darle la estructura que espera el front-end.
        const mappedPosts = response.data.posts.map(post => ({
          id: post.id_post,
          contenido: post.contenido_post,
          fecha: new Date(post.fecha_creacion).toLocaleString(),
          imagen_url: post.imagen_url,
          likes: post.likes,
          dislikes: post.dislikes,
          // Los estados de "liked" y "disliked" dependerán de la lógica de la sesión actual.
          liked: false,
          disliked: false
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Error al obtener posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Llamada al endpoint de dar like
  const handleLike = async (id) => {
    try {
      await axios.post('/api/darLike', { idPost: id });
      fetchPosts();
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  // Llamada al endpoint de dar dislike
  const handleDislike = async (id) => {
    try {
      await axios.post('/api/darDislike', { idPost: id });
      fetchPosts();
    } catch (error) {
      console.error('Error al dar dislike:', error);
    }
  };

  // Llamada al endpoint para publicar un post nuevo
  const handlePost = async () => {
    if (newPostContent.trim() === '') {
      return alert('El contenido no puede estar vacío.');
    }
    try {
      await axios.post('/api/publicarPost', { contenidoPost: newPostContent });
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

        <button className="button-add-post" onClick={() => setPopupOpen(true)}>
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
