import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { MapComponent } from '../../components/common/Map';
import { API_BASE_URL } from '../../services/api';

const initialFormData = {
    status: 'perdido',
    especie: 'cachorro',
    nome: '',
    raca: '',
    cor: '',
    tamanho: 'medio',
    local: '',
    contato: '',
    recompensa: '',
};

const CadastrarPetPage = () => {
    const navigate = useNavigate();

    // Estados do Formulário
    const [formData, setFormData] = useState(initialFormData);
    
    // Estados da Galeria de Fotos
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Estados do Mapa
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const defaultCenter: [number, number] = [-10.184059, -48.333768]; // Centro de Palmas-TO

    // Estados de UI
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- HANDLERS DE TEXTO ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLERS DE FOTO (Galeria) ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            
            if (selectedFiles.length + newFiles.length > 5) {
                alert("Você só pode enviar no máximo 5 fotos.");
                return;
            }

            setSelectedFiles(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
            
            e.target.value = ''; // Limpa input para permitir re-seleção
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const movePhoto = (index: number, direction: 'left' | 'right') => {
        const newIndex = direction === 'left' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= selectedFiles.length) return;

        const newFiles = [...selectedFiles];
        const newPreviews = [...previewUrls];

        [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
        [newPreviews[index], newPreviews[newIndex]] = [newPreviews[newIndex], newPreviews[index]];

        setSelectedFiles(newFiles);
        setPreviewUrls(newPreviews);
    };
    
    // --- ENVIO DO FORMULÁRIO ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para anunciar!');
            navigate('/login');
            return;
        }

        if (selectedFiles.length === 0) {
            setError("Por favor, adicione pelo menos uma foto do pet.");
            setIsLoading(false);
            return;
        }

        try {
            const data = new FormData();
            
            // 1. Dados de Texto (Mapeamento PT -> EN se necessário, ou direto)
            data.append('status', formData.status);
            data.append('species', formData.especie);
            data.append('name', formData.nome);
            data.append('breed', formData.raca);
            data.append('color', formData.cor);
            data.append('size', formData.tamanho);
            data.append('location', formData.local);
            data.append('contact', formData.contato);
            data.append('reward', formData.recompensa);

            // 2. Coordenadas do Mapa
            if (position) {
                data.append('latitude', position.lat.toString());
                data.append('longitude', position.lng.toString());
            }

            // 3. Arquivos de Imagem
            selectedFiles.forEach((file) => {
                data.append('images', file);
            });

            const response = await fetch(`${API_BASE_URL}/pets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Erro ao cadastrar pet');
            }

            setIsSuccess(true);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
         return (
            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto animate-fade-in mt-10">
                <div className="flex flex-col items-center text-center">
                    <CheckCircle className="text-green-500" size={64} />
                    <h3 className="text-2xl font-bold text-green-600 mt-4 mb-2">Anúncio Publicado!</h3>
                    <p className="text-gray-600 mb-6">Seu pet já aparece na lista de buscas e no mapa.</p>
                </div>
                <button 
                    onClick={() => navigate('/')} 
                    className="w-full mt-6 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    Voltar para Home
                </button>
            </div>
         );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto my-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Anunciar um Pet</h2>
                <p className="text-gray-600">Preencha os dados abaixo para criar seu anúncio.</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* --- TIPO DE ANÚNCIO --- */}
            <fieldset>
                <legend className="text-lg font-semibold text-gray-700 mb-2">Tipo de Anúncio</legend>
                <div className="flex gap-4 flex-wrap">
                    {['perdido', 'encontrado', 'adocao'].map((status) => (
                        <label key={status} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.status === status ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}>
                            <input type="radio" name="status" value={status} checked={formData.status === status} onChange={handleChange} className="accent-orange-500" />
                            <span className="capitalize">{status}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* --- GALERIA DE FOTOS --- */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-lg font-semibold text-gray-700">Fotos do Pet</label>
                    <span className="text-sm text-gray-500">{selectedFiles.length} / 5 fotos</span>
                </div>
                
                <div className="space-y-4">
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                                    <img src={url} alt={`Pet ${index}`} className="w-full h-full object-cover" />
                                    
                                    <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors" title="Remover foto">
                                        <X size={14} />
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex justify-between px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button type="button" onClick={() => movePhoto(index, 'left')} disabled={index === 0} className={`text-white ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-orange-300'}`}>
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button type="button" onClick={() => movePhoto(index, 'right')} disabled={index === previewUrls.length - 1} className={`text-white ${index === previewUrls.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-orange-300'}`}>
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                    
                                    {index === 0 && (
                                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md">Principal</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedFiles.length < 5 && (
                        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${previewUrls.length > 0 ? 'h-32 w-32' : 'h-48 w-full'}`}>
                            <div className="flex flex-col items-center text-gray-500">
                                <Plus size={24} />
                                <span className="text-sm font-medium mt-2">{previewUrls.length > 0 ? 'Adicionar' : 'Clique para enviar fotos'}</span>
                            </div>
                            <input type="file" onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                        </label>
                    )}
                </div>
            </div>

            {/* --- CAMPOS DE TEXTO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
                    <select name="especie" value={formData.especie} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome (se souber)</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                    <input type="text" name="raca" value={formData.raca} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Vira-lata" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                    <input type="text" name="cor" value={formData.cor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                    <select name="tamanho" value={formData.tamanho} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recompensa (R$)</label>
                    <input type="text" name="recompensa" value={formData.recompensa} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Opcional" />
                </div>
            </div>

            {/* --- LOCALIZAÇÃO E MAPA --- */}
            <div className="space-y-4 border-t pt-6 mt-2">
                <h3 className="text-lg font-semibold text-gray-700">Onde foi visto?</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização (Texto)</label>
                    <input 
                        type="text" 
                        name="local" 
                        value={formData.local} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                        placeholder="Ex: Perto do Shopping Capim Dourado" 
                    />
                </div>

                <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin size={16} className="text-orange-500"/>
                            Marque o local exato no mapa
                        </label>
                        {position ? (
                            <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded-full border border-green-200">
                                ✅ Local Marcado
                            </span>
                        ) : (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Pendente
                            </span>
                        )}
                    </div>
                    
                    <div className="h-72 w-full relative z-0">
                        <MapComponent 
                            initialPosition={defaultCenter}
                            interactive={true}
                            onPositionSelected={(lat, lng) => setPosition({ lat, lng })}
                            markers={position ? [{ 
                                lat: position.lat, 
                                lng: position.lng, 
                                title: "Local Selecionado", 
                                description: "O pet estava aqui" 
                            }] : []}
                        />
                    </div>
                    <p className="text-xs text-gray-500 p-2 bg-gray-50">
                        * Clique no mapa para adicionar um pino na localização exata.
                    </p>
                </div>
            </div>

            {/* --- CONTATO --- */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contato (WhatsApp)</label>
                <input type="text" name="contato" value={formData.contato} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="(XX) 9XXXX-XXXX" />
            </div>

            <div className="pt-4 border-t">
                <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'}`}>
                    <Send className="w-5 h-5" />
                    {isLoading ? 'Publicando...' : 'Publicar Anúncio'}
                </button>
            </div>
        </form>
    );
};

export default CadastrarPetPage;