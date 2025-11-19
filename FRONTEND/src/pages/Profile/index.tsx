import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, MapPin, Phone, Mail, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '', // Email geralmente não deixamos editar fácil
        phone: '',
        city: '',
        state: ''
    });

    // 1. Buscar dados do perfil ao carregar a tela
    useEffect(() => {
        async function loadProfile() {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                // Preenche o formulário com o que veio do banco
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    city: data.city || '',
                    state: data.state || ''
                });

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Salvar alterações
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    city: formData.city,
                    state: formData.state
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
                
                // Atualiza o nome no localStorage também para o header refletir a mudança
                const userStored = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...userStored, name: formData.name }));
            } else {
                setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
            }

        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (isLoading) return <div className="p-8 text-center">Carregando perfil...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="text-orange-500" />
                        Meu Perfil
                    </h2>
                    <button 
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                        />
                    </div>

                    {/* Email (Desabilitado) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Não editável)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                value={formData.email} 
                                disabled 
                                className="w-full pl-10 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="(XX) 9XXXX-XXXX"
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                            />
                        </div>
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                            <input 
                                type="text" 
                                name="state" 
                                value={formData.state} 
                                onChange={handleChange} 
                                maxLength={2}
                                placeholder="TO"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 uppercase" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;