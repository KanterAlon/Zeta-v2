import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import CommunityPage from './Pages/CommunityPage';
import ProductPage from './Pages/ProductPage';
import LoginPage from './Pages/Login';
// Agregá otras rutas si tenés Comunidad, Contacto, etc.

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/producto" element={<ProductPage />} />
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
