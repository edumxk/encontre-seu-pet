import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        // Estilos extraídos de login.html e registrar-usuario.html
        <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                <Outlet /> {/* LoginPage ou RegisterPage serão renderizadas aqui */}
            </div>
        </div>
    );
};