import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

        // Validações básicas
        if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            setIsLoading(true);

            // 1. Tenta Criar o Usuário
            const registerResponse = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.nome,
                    email: formData.email,
                    password: formData.senha,
                    confirmPassword: formData.confirmarSenha 
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(registerData.error || registerData.message || 'Erro ao criar conta');
            }
            
            // 2. Cadastro Sucesso! Agora faz o Auto-Login
            const loginResponse = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.senha
                })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                
                // 3. Salva a sessão (Token)
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('user', JSON.stringify({
                    name: loginData.name,
                    email: loginData.email,
                    id: loginData.id
                }));

                setIsSuccess(true);
                
                // 4. Redireciona para a Home (já logado)
                setTimeout(() => {
                    navigate('/'); 
                }, 1500);
            } else {
                // Se por algum milagre cadastrar mas falhar o login, manda pro login manual
                navigate('/login');
            }

        } catch (err: any) {
            setError(err.message || 'Erro ao conectar com o servidor.');
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center animate-fade-in">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Conta criada com sucesso!</h2>
                <p className="text-gray-600 mt-2">Entrando no sistema...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col items-center mb-6">
                <PawPrint className="text-orange-500" size={40} />
                <h2 className="mt-2 text-3xl font-bold text-center text-gray-800">Criar Conta</h2>
                <p className="text-gray-600">Rápido e fácil.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">Nome Completo</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" disabled={isLoading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" disabled={isLoading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senha">Senha</label>
                    <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" disabled={isLoading} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input type="password" id="confirmarSenha" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" disabled={isLoading} />
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
                    className={`w-full text-white font-bold py-2 px-4 rounded-lg transition-colors ${isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
                    Faça login
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;