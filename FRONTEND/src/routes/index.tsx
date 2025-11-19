import { Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';

// Pages
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import CadastrarPetPage from '../pages/CadastrarPet';
import MeusAnunciosPage from '../pages/MeusAnuncios';
import ProfilePage from '../pages/Profile';
import PetDetailsPage from '../pages/PetDetails';
import NotificacoesPage from '../pages/Notificacoes';

export const AppRoutes = () => (
  <Routes>
    {/* Rotas com Layout Principal (com Header) */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/cadastrar-pet" element={<CadastrarPetPage />} />
      <Route path="/meus-anuncios" element={<MeusAnunciosPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/pet/:id" element={<PetDetailsPage />} />
      <Route path="/notificacoes" element={<NotificacoesPage />} />
    </Route>
    
    {/* Rotas de Autenticação (Layout limpo, centralizado) */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />
    </Route>
  </Routes>
);