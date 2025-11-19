import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    MapPin, CheckCircle, Search, Phone, 
    Map as MapIcon, Heart, UserCheck 
} from 'lucide-react';
import { MapComponent } from '../../components/common/Map';

// --- TIPAGEM ---
interface UserContact {
    name: string;
    phone: string;
}

interface MyPet {
    id: number;
    name: string;
    status: 'perdido' | 'encontrado' | 'adocao' | 'finalizado'; // Tipos atualizados
    originalStatus?: 'perdido' | 'encontrado' | 'adocao'; // Para saber o que ele era antes de finalizar
    
    location: string;
    createdAt: string;
    recompensa?: string;
    userId: number;
    images?: { url: string }[];
    
    // Resolução
    foundByUserId?: number;
    foundByExternal?: string;
    finalLatitude?: number;
    finalLongitude?: number;

    // Dados Cruzados
    user?: UserContact;   // Dono original
    finder?: UserContact; // Quem interagiu (achou/adotou/recuperou)
}

type FilterType = 'ativos' | 'finalizados' | 'interacoes';

const MeusAnunciosPage = () => {
    const [allPets, setAllPets] = useState<MyPet[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('ativos');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    // Modal Resolver
    const [petToResolve, setPetToResolve] = useState<MyPet | null>(null);
    const [finderType, setFinderType] = useState<'platform' | 'me' |'external'>('platform') ;
    const [finderName, setFinderName] = useState('');
    const [finalPosition, setFinalPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal Ver Local
    const [viewLocationPet, setViewLocationPet] = useState<MyPet | null>(null);

    const defaultCenter: [number, number] = [-10.184059, -48.333768];

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUserId(Number(user.id));
            } catch (e) { console.error(e); }
        }
        loadPets();
    }, []);

    const loadPets = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/my-pets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            // Mapeamento e Sanitização
            const safeData = data.map((p: any) => ({
                ...p,
                images: p.images?.map((img: any) => ({ ...img, url: encodeURI(img.url) })) || [],
                // Se já estiver finalizado, tentamos inferir o status original pelo contexto ou histórico (mockado aqui se o back não mandar)
                // O ideal é o backend salvar 'originalStatus', mas vamos assumir que se finalizado, ele mantém o tipo visualmente no card
            }));

            // Remove duplicatas
            const uniquePets = safeData.filter((v: MyPet, i: number, a: MyPet[]) => a.findIndex(t => (t.id === v.id)) === i);
            setAllPets(uniquePets);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- FILTROS INTELIGENTES ---
    const filteredPets = useMemo(() => {
        return allPets.filter(pet => {
            const isMyAd = pet.userId === currentUserId;
            const isInteraction = pet.foundByUserId === currentUserId; // Eu sou o "Finder"

            if (activeFilter === 'ativos') {
                // Meus anúncios que AINDA NÃO foram finalizados
                return isMyAd && pet.status !== 'finalizado';
            }
            
            if (activeFilter === 'finalizados') {
                // Meus anúncios QUE JÁ FORAM resolvidos
                return isMyAd && pet.status === 'finalizado';
            }
            
            if (activeFilter === 'interacoes') {
                // Anúncios DE OUTROS que eu resolvi (Achei o pet dele, Adotei o pet dele, ou Recuperei meu pet que ele achou)
                return isInteraction; 
            }
            
            return false;
        });
    }, [allPets, activeFilter, currentUserId]);

    const handleResolveSubmit = async () => {
        if (!petToResolve) return;
        if (!finalPosition) {
            alert("Marque no mapa onde ocorreu o encontro/entrega.");
            return;
        }
        
        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const payload: any = {
                finalLatitude: finalPosition.lat,
                finalLongitude: finalPosition.lng
            };
            
            // LÓGICA CORRIGIDA DE ENVIO
            if (finderType === 'platform') {
                // Se for da plataforma, o texto digitado é o EMAIL
                // Validamos se tem cara de email
                if (!finderName.includes('@')) {
                    alert("Por favor, digite um email válido do usuário.");
                    setIsSubmitting(false);
                    return;
                }
                payload.finderEmail = finderName.trim(); // Enviamos como finderEmail
            } 
            else if (finderType === 'external') {
                // Se for externo, é apenas texto (Nome)
                payload.foundByExternal = finderName;
            }
            // Se for 'me', não mandamos nada, o backend entende.

            const response = await fetch(`http://localhost:3000/pets/${petToResolve.id}/resolve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Processo finalizado com sucesso!");
                setPetToResolve(null);
                loadPets();
            } else {
                // Mostra o erro do backend (ex: "Usuário com este email não encontrado")
                alert(data.error || "Erro ao finalizar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    };

    // Helper para textos dinâmicos
    const getResolveText = (status: string) => {
        if (status === 'perdido') return { title: 'Encontrei meu Pet!', question: 'Quem encontrou ele?', label: 'Nome de quem achou' };
        if (status === 'encontrado') return { title: 'Devolver ao Dono', question: 'Quem é o dono?', label: 'Nome do dono' };
        if (status === 'adocao') return { title: 'Confirmar Adoção', question: 'Quem adotou?', label: 'Nome do adotante' };
        return { title: 'Resolver', question: 'Quem interagiu?', label: 'Nome' };
    };

    if (isLoading) return <div className="p-10 text-center">Carregando...</div>;

    return (
        <div className="space-y-6 relative pb-20">
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gerenciar Pets</h2>
                    <p className="text-gray-600">Controle seus anúncios e interações.</p>
                </div>
                <Link to="/cadastrar-pet" className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-600 shadow-sm flex items-center gap-2">
                    + Criar Novo Anúncio
                </Link>
            </div>

            {/* ABAS DE FILTRO */}
            <div className="flex overflow-x-auto pb-2 gap-2 border-b border-gray-200">
                <button onClick={() => setActiveFilter('ativos')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFilter === 'ativos' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                    Anúncios Ativos
                </button>
                <button onClick={() => setActiveFilter('finalizados')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFilter === 'finalizados' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                    Histórico (Finalizados)
                </button>
                <button onClick={() => setActiveFilter('interacoes')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeFilter === 'interacoes' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                    Minhas Interações
                </button>
            </div>

            {/* LISTA */}
            {filteredPets.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredPets.map(pet => {
                        const isMyAd = pet.userId === currentUserId;
                        const isFinalized = pet.status === 'finalizado';
                        
                        // Define cores e ícones baseados no tipo original (se finalizado) ou atual
                        // Aqui é um truque: se está finalizado, usamos o status original se tivessemos, 
                        // mas como o banco sobrescreve, vamos assumir cores neutras para finalizado
                        
                        return (
                            <div key={pet.id} className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row gap-4 transition-all ${isFinalized ? 'border-gray-200 bg-gray-50 opacity-90' : 'border-gray-100'}`}>
                                
                                {/* FOTO */}
                                <div className="w-full sm:w-32 h-40 sm:h-full bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                    <img 
                                        src={pet.images && pet.images.length > 0 ? pet.images[0].url : 'https://placedog.net/300'} 
                                        className={`w-full h-full object-cover ${isFinalized ? 'grayscale' : ''}`} 
                                        alt={pet.name} 
                                    />
                                    {isFinalized && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <CheckCircle className="text-white drop-shadow-md" size={40} />
                                        </div>
                                    )}
                                </div>

                                {/* INFO */}
                                <div className="flex-grow flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                                {pet.name}
                                                {!isMyAd && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Interação</span>}
                                            </h3>
                                            
                                            {/* BADGE DE STATUS */}
                                            {!isFinalized ? (
                                                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wide ${
                                                    pet.status === 'perdido' ? 'bg-red-100 text-red-700' : 
                                                    pet.status === 'encontrado' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {pet.status}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] px-2 py-1 rounded-full uppercase font-bold bg-gray-200 text-gray-600">
                                                    Finalizado
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p className="flex items-center gap-1"><MapPin size={14} className="text-orange-500"/> {pet.location}</p>
                                            <p className="text-xs text-gray-400">Data: {new Date(pet.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        {/* ÁREA DE DADOS DE RESOLUÇÃO (Visível apenas se finalizado) */}
                                        {isFinalized && (
                                            <div className="mt-3 bg-white p-3 rounded border border-gray-200 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <UserCheck size={16} className="text-green-600 mt-0.5" />
                                                    <div className="flex-grow">
                                                        <p className="text-xs font-bold text-gray-500 uppercase">
                                                            {/* Texto dinâmico dependendo de quem vê */}
                                                            {isMyAd ? "Resolvido com:" : "Você interagiu com:"}
                                                        </p>
                                                        
                                                        {/* Se for meu anúncio, mostra quem achou/adotou */}
                                                        {isMyAd && (
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="font-semibold text-gray-800">
                                                                    {pet.finder?.name || pet.foundByExternal || "Desconhecido"}
                                                                </span>
                                                                {pet.finder?.phone && (
                                                                    <button onClick={() => openWhatsApp(pet.finder!.phone)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                                        <Phone size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Se for interação (eu achei), mostra o dono */}
                                                        {!isMyAd && pet.user && (
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="font-semibold text-gray-800">Dono: {pet.user.name}</span>
                                                                <button onClick={() => openWhatsApp(pet.user!.phone)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                                                                    <Phone size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {pet.finalLatitude && (
                                                    <button onClick={() => setViewLocationPet(pet)} className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline font-medium border-t pt-2">
                                                        <MapIcon size={12} /> Ver local da resolução
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* AÇÕES */}
                                    {!isFinalized && isMyAd && (
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                                            <Link to={`/pet/${pet.id}`} className="text-sm font-bold text-gray-500 hover:text-orange-500 py-2 px-2 flex-grow text-center">
                                                Ver Detalhes
                                            </Link>
                                            
                                            <button 
                                                onClick={() => setPetToResolve(pet)}
                                                className={`flex-grow text-white text-sm px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors ${
                                                    pet.status === 'adocao' ? 'bg-purple-600 hover:bg-purple-700' : 
                                                    pet.status === 'encontrado' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                                    'bg-green-600 hover:bg-green-700'
                                                }`}
                                            >
                                                <CheckCircle size={16} />
                                                {pet.status === 'adocao' ? 'Confirmar Adoção' : 
                                                 pet.status === 'encontrado' ? 'Entregue ao Dono' : 
                                                 'Já Encontrei!'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Se for interação minha mas ainda ativo (ex: marquei que vi, mas dono não resolveu) */}
                                    {!isFinalized && !isMyAd && (
                                        <div className="mt-4 pt-3 border-t border-gray-50 text-center text-xs text-gray-400 italic">
                                            Aguardando resolução pelo dono.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Nenhum pet nesta lista</h3>
                    <button onClick={() => setActiveFilter('ativos')} className="text-orange-500 font-bold hover:underline mt-2">Ver Anúncios Ativos</button>
                </div>
            )}

            {/* --- MODAL RESOLVER --- */}
            {petToResolve && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {petToResolve.status === 'adocao' ? <Heart className="text-purple-500"/> : <CheckCircle className="text-green-500" />}
                                {getResolveText(petToResolve.status).title}
                            </h3>
                            <button onClick={() => setPetToResolve(null)}><CheckCircle className="text-gray-400" /></button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Pergunta Dinâmica */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                    {getResolveText(petToResolve.status).question}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button onClick={() => setFinderType('platform')} className={`p-3 rounded-lg border text-sm font-medium ${finderType === 'platform' ? 'border-orange-500 bg-orange-50 text-orange-700' : ''}`}>
                                        Usuário do Site (Email/Nome)
                                    </button>
                                    <button onClick={() => setFinderType('external')} className={`p-3 rounded-lg border text-sm font-medium ${finderType === 'external' ? 'border-orange-500 bg-orange-50 text-orange-700' : ''}`}>
                                        Pessoa Externa
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <input 
                                        type="text" 
                                        placeholder={getResolveText(petToResolve.status).label} 
                                        className="w-full p-2 border border-gray-300 rounded-lg" 
                                        onChange={(e) => setFinderName(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Mapa */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {petToResolve.status === 'adocao' ? 'Local da Adoção' : 'Onde foi encontrado/devolvido?'}
                                </label>
                                <div className="h-64 w-full rounded-xl overflow-hidden border relative">
                                    <MapComponent 
                                        initialPosition={defaultCenter}
                                        interactive={true}
                                        onPositionSelected={(lat, lng) => setFinalPosition({ lat, lng })}
                                        markers={finalPosition ? [{ lat: finalPosition.lat, lng: finalPosition.lng, title: "Local", description: "" }] : []}
                                    />
                                    {finalPosition && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-[1000]">Marcado ✓</div>}
                                </div>
                            </div>

                            <button onClick={handleResolveSubmit} disabled={isSubmitting || !finalPosition} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50">
                                {isSubmitting ? 'Salvando...' : 'Confirmar e Finalizar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal Ver Local (Igual ao anterior) */}
            {viewLocationPet && viewLocationPet.finalLatitude && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold flex gap-2"><MapIcon /> Local da Resolução</h3>
                            <button onClick={() => setViewLocationPet(null)}><CheckCircle /></button>
                        </div>
                        <div className="h-80 w-full">
                            <MapComponent 
                                initialPosition={[viewLocationPet.finalLatitude, viewLocationPet.finalLongitude!]}
                                markers={[{ lat: viewLocationPet.finalLatitude, lng: viewLocationPet.finalLongitude!, title: "Aqui", description: "" }]}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MeusAnunciosPage;