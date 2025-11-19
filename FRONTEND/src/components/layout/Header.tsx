import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Menu, X, PawPrint, Bell, User, LogOut, 
    PlusCircle, LayoutDashboard, Search, LogIn 
} from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Verifica Login e Notificações ao mudar de rota
        const userStored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userStored && token) {
            setUser(JSON.parse(userStored));
            fetchUnreadCount(token);
        } else {
            setUser(null);
            setUnreadCount(0);
        }

        // 2. Efeito de sombra ao rolar
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]); 

    const fetchUnreadCount = async (token: string) => {
        try {
            const response = await fetch('http://localhost:3000/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const count = data.filter((n: any) => !n.read).length;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Erro ao buscar notificações");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsMenuOpen(false);
        navigate('/login');
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header 
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-3 border-b border-gray-100'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    
                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                        <div className="bg-orange-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                            <PawPrint className="text-white h-6 w-6" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                            Meupet<span className="text-orange-500">.com</span>
                        </span>
                    </Link>

                    {/* --- DESKTOP NAVIGATION --- */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                            <Search size={18} /> Buscar
                        </Link>

                        {user ? (
                            <>
                                {/* Link Meus Anúncios */}
                                <Link to="/meus-anuncios" className="text-gray-600 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                                    <LayoutDashboard size={18} /> Meus Anúncios
                                </Link>

                                {/* Botão Notificações com Badge */}
                                <Link to="/notificacoes" className="relative text-gray-600 hover:text-orange-500 transition-colors p-1">
                                    <Bell size={22} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="h-6 w-px bg-gray-200"></div>

                                {/* Perfil Dropdown */}
                                <div className="flex items-center gap-4">
                                    <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-sm hidden lg:block">
                                            <p className="font-bold text-gray-700 leading-none">{user.name.split(' ')[0]}</p>
                                        </div>
                                    </Link>

                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sair">
                                        <LogOut size={20} />
                                    </button>

                                    <Link to="/cadastrar-pet" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                                        <PlusCircle size={18} />
                                        Anunciar
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-bold flex items-center gap-1">
                                    <LogIn size={18} /> Entrar
                                </Link>
                                <Link to="/registrar" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-bold transition-all">
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* --- MOBILE MENU BUTTON --- */}
                    <div className="flex items-center gap-3 md:hidden">
                        {/* Notificação no Mobile (Fora do menu para acesso rápido) */}
                        {user && (
                            <Link to="/notificacoes" className="relative text-gray-600 mr-2">
                                <Bell size={24} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        
                        <button 
                            className="text-gray-600 hover:text-orange-500 transition-colors p-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU DRAWER --- */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 py-6 space-y-4 flex flex-col">
                    
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 px-2 pb-4 border-b border-gray-100 mb-2">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Olá, {user.name.split(' ')[0]}</p>
                                    <p className="text-xs text-gray-500">{user.name}</p>
                                </div>
                            </div>

                            <Link to="/cadastrar-Pet" onClick={closeMenu} className="bg-orange-500 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm">
                                <PlusCircle size={20} />
                                Anunciar Pet
                            </Link>

                            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                <Search size={20} /> Buscar Pets
                            </Link>

                            <Link to="/meus-anuncios" onClick={closeMenu} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                <LayoutDashboard size={20} /> Meus Anúncios
                            </Link>

                            <Link to="/notificacoes" onClick={closeMenu} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                <div className="relative">
                                    <Bell size={20} />
                                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                                </div>
                                Notificações {unreadCount > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">{unreadCount} nova(s)</span>}
                            </Link>

                            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                <User size={20} /> Meu Perfil
                            </Link>

                            <button onClick={handleLogout} className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-lg w-full text-left font-semibold mt-2">
                                <LogOut size={20} /> Sair da conta
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                <Search size={20} /> Buscar Pets
                            </Link>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <Link to="/login" onClick={closeMenu} className="text-center py-3 font-bold text-gray-600 hover:text-orange-500 bg-gray-50 rounded-lg">
                                    Entrar
                                </Link>
                                <Link to="/registrar" onClick={closeMenu} className="text-center py-3 font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-lg">
                                    Criar Conta
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;