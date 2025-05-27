import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './Pages/HomePage';
import BlogPage from './Pages/BlogPage';
import CommunityPage from './Pages/CommunityPage';
import ProductPage from './Pages/ProductPage';
import LoginPage from './Pages/Login';
import SearchResults from './Pages/SearchResults'; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/producto" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Layout>
  );
}

export default App;
