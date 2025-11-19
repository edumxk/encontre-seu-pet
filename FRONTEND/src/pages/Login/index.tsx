import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, CheckCircle, AlertCircle } from 'lucide-react'; 
import { API_BASE_URL } from '../../services/api'; 

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para carregar
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.senha) {
            setError('Por favor, preencha seu email e senha.');
            return;
        }

        try {
            setIsLoading(true);

            // 1. Chamada ao Backend
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.senha // Traduzindo 'senha' para 'password'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Erro ao fazer login');
            }

            // 2. Salvar o Token (O "Crachá" do usuário)
            // Isso permite que ele acesse áreas restritas depois
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                id: data.id
            }));
            
            setIsSuccess(true);
            
            // 3. Redirecionar
            setTimeout(() => {
                navigate('/'); // Vai para a Home
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Erro de conexão com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Login realizado!</h2>
                <p className="text-gray-600 mt-2">Entrando no sistema...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col items-center mb-6">
                <PawPrint className="text-orange-500" size={40} />
                <h2 className="mt-2 text-3xl font-bold text-center text-gray-800">Login</h2>
                <p className="text-gray-600">Acesse sua conta para gerenciar seus anúncios.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100" 
                    />
                </div>
                
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="senha">Senha</label>
                        <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-600">Esqueceu?</a>
                    </div>
                    <input 
                        type="password" 
                        id="senha" 
                        name="senha" 
                        value={formData.senha} 
                        onChange={handleChange} 
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100" 
                    />
                </div>
                
                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors ${
                        isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/Registrar" className="font-semibold text-orange-500 hover:text-orange-600">
                    Cadastre-se
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;