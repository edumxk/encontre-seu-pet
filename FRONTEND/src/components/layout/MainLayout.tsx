import { Outlet } from 'react-router-dom';
import Header from './Header'; 
export const MainLayout = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            {/* O "container" e "padding" que estavam no <main> dos HTMLs vêm para cá */}
            <main className="container mx-auto p-4 md:p-8">
                <Outlet /> {/* As páginas (Home, CadastrarPet) serão renderizadas aqui */}
            </main>
        </div>
    );
};