import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/HomePage';
import BlogPage from './pages/BlogPage';
// Agregá otras rutas si tenés Comunidad, Contacto, etc.

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
