import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MapPin, Phone, Calendar, Map as MapIcon, Clock, 
    Ruler, Palette, PawPrint, Banknote, User, ArrowLeft, 
    AlertTriangle, HeartHandshake // Novos ícones
} from 'lucide-react';
import { MapComponent } from '../../components/common/Map';
import { API_BASE_URL } from '../../services/api';

interface Sighting {
    id: number;
    latitude: number;
    longitude: number;
    dateTime: string;
    description: string;
    user: { 
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
}

interface PetDetail {
    id: number;
    name: string;
    species: string;
    breed: string;
    color: string;
    size: string;
    status: 'perdido' | 'encontrado' | 'finalizado' | 'adocao'; // Tipagem mais estrita
    description: string;
    recompensa?: string;
    reward?: string;
    images: { url: string }[];
    user: { id: number; name: string; phone: string; email: string }; 
    userId: number;
    latitude?: number;
    longitude?: number;
    location: string;
    createdAt: string;
    sightings: Sighting[];
}

const PetDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [pet, setPet] = useState<PetDetail | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    
    // Controla se o formulário de interação está aberto
    const [isInteracting, setIsInteracting] = useState(false);
    
    const [interactionForm, setInteractionForm] = useState({
        lat: 0,
        lng: 0,
        date: '',
        time: '',
        desc: ''
    });

    const defaultPosition: [number, number] = [-10.184059, -48.333768];

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                setCurrentUserId(Number(userObj.id));
            } catch (e) { console.error(e); }
        }

        fetch(`${API_BASE_URL}/pets/${id}`)
            .then(res => res.json())
            .then(data => {
                if(data.images) {
                    data.images = data.images.map((img: any) => ({
                        ...img,
                        url: encodeURI(img.url)
                    }));
                }
                setPet(data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if(!token) {
            alert("Faça login para continuar!");
            navigate('/login');
            return;
        }

        if(interactionForm.lat === 0) {
            alert("Por favor, marque um local no mapa.");
            return;
        }
        
        const dateTimeISO = new Date(`${interactionForm.date}T${interactionForm.time}`).toISOString();
        const now = new Date().toISOString();
        
        // Pequena validação: só não pode futuro se for avistamento. 
        // Se for reivindicação (perdi no passado), a data tem que ser anterior ao post.
        if (dateTimeISO > now) {
             alert("A data não pode ser no futuro.");
             return;
        }

        try {
            // Enviamos para a mesma rota de 'sightings', mas o contexto muda pelo texto
            const response = await fetch(`${API_BASE_URL}/pets/${id}/sightings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    latitude: interactionForm.lat,
                    longitude: interactionForm.lng,
                    dateTime: dateTimeISO,
                    description: interactionForm.desc
                })
            });

            if(response.ok) {
                alert("Informação enviada com sucesso! O anunciante verá seus dados.");
                window.location.reload();
            } else {
                alert("Erro ao enviar.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    };

    const handleWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    };

    if (!pet) return <div className="p-10 text-center">Carregando...</div>;

    const position: [number, number] = pet.latitude && pet.longitude 
        ? [pet.latitude, pet.longitude] 
        : defaultPosition;

    const isOwner = currentUserId === pet.user.id;
    const rewardValue = pet.reward || pet.recompensa;

    // Configuração visual baseada no status
    const isLost = pet.status === 'perdido';
    
    const actionColor = isLost ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700';
    const ActionIcon = isLost ? MapIcon : HeartHandshake;
    const actionText = isLost ? 'Eu vi este pet! Informar' : 'Este pet é meu! Reivindicar';
    
    // Marcadores do mapa
    const markers = [
        { 
            lat: position[0], 
            lng: position[1], 
            title: isLost ? "Local do Desaparecimento" : "Local onde foi Encontrado", 
            description: pet.location 
        },
        ...pet.sightings.map(s => ({
            lat: s.latitude,
            lng: s.longitude,
            title: isOwner ? `Contato: ${s.user.name}` : "Interação da Comunidade",
            description: `${new Date(s.dateTime).toLocaleString()}`
        }))
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-1" /> Voltar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* --- COLUNA ESQUERDA (FOTOS E DADOS) --- */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* GALERIA */}
                    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group">
                        <div className="h-[400px] md:h-[500px] bg-gray-200 flex items-center justify-center">
                            <img 
                                src={pet.images[activeImage]?.url || 'https://placedog.net/500'} 
                                className="w-full h-full object-contain" 
                                alt={pet.name} 
                            />
                        </div>
                        {pet.images.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full flex gap-2">
                                    {pet.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-3 h-3 rounded-full transition-all ${idx === activeImage ? 'bg-orange-500 scale-125' : 'bg-white/70 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DETALHES PRINCIPAIS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">
                                    {pet.name || (isLost ? 'Nome Desconhecido' : 'Pet Encontrado')}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Calendar size={16} /> 
                                    {isLost ? 'Perdido em' : 'Encontrado em'} {new Date(pet.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm border 
                                ${isLost ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                {pet.status}
                            </span>
                        </div>

                        {rewardValue && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-green-600"><Banknote size={32} /></div>
                                <div>
                                    <p className="text-green-800 font-bold text-sm uppercase tracking-wide">Recompensa</p>
                                    <p className="text-green-700 text-2xl font-bold">R$ {rewardValue}</p>
                                </div>
                            </div>
                        )}

                        {/* Características */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-gray-400 text-xs uppercase font-bold mb-1 flex gap-1"><PawPrint size={12} /> Espécie</div>
                                <div className="font-semibold text-gray-700 capitalize">{pet.species}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-gray-400 text-xs uppercase font-bold mb-1 flex gap-1"><PawPrint size={12} /> Raça</div>
                                <div className="font-semibold text-gray-700 capitalize">{pet.breed || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-gray-400 text-xs uppercase font-bold mb-1 flex gap-1"><Palette size={12} /> Cor</div>
                                <div className="font-semibold text-gray-700 capitalize">{pet.color || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-gray-400 text-xs uppercase font-bold mb-1 flex gap-1"><Ruler size={12} /> Tamanho</div>
                                <div className="font-semibold text-gray-700 capitalize">{pet.size || 'Médio'}</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800 mb-2">Descrição</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {pet.description || "Sem detalhes adicionais."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- COLUNA DIREITA (INTERAÇÃO) --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Card do Anunciante */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="text-orange-500" /> Anunciado por
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                                {pet.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{pet.user.name}</p>
                                <p className="text-sm text-gray-500">
                                    {isLost ? 'Dono(a) procurando' : 'Encontrou este pet'}
                                </p>
                            </div>
                        </div>
                        
                        <button onClick={() => handleWhatsApp(pet.user.phone)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mb-3">
                            <Phone size={20} /> Falar no WhatsApp
                        </button>
                    </div>

                    {/* Mapa e Ação Principal */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <MapPin className="text-orange-500" /> 
                            {isLost ? 'Visto por último em' : 'Encontrado em'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{pet.location}</p>
                        
                        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
                            <MapComponent 
                                initialPosition={position} 
                                markers={isInteracting && interactionForm.lat !== 0 
                                    ? [...markers, { lat: interactionForm.lat, lng: interactionForm.lng, title: "Meu Marcador", description: "Local selecionado" }] 
                                    : markers
                                }
                                interactive={isInteracting}
                                onPositionSelected={(lat, lng) => setInteractionForm(prev => ({ ...prev, lat, lng }))}
                            />
                            {isInteracting && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-bold animate-bounce pointer-events-none">
                                    Clique no mapa!
                                </div>
                            )}
                        </div>

                        {!isOwner && pet.status !== 'finalizado' && (
                            <button 
                                onClick={() => setIsInteracting(!isInteracting)}
                                className={`w-full mt-4 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-white shadow-md ${
                                    isInteracting ? 'bg-gray-500 hover:bg-gray-600' : actionColor
                                }`}
                            >
                                {isInteracting ? (
                                    <> <AlertTriangle size={20} /> Cancelar </>
                                ) : (
                                    <> <ActionIcon size={20} /> {actionText} </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Formulário de Interação (Avistamento ou Reivindicação) */}
                    {isInteracting && (
                        <div className={`p-6 rounded-2xl border animate-fade-in shadow-lg ${isLost ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                            <h3 className={`font-bold mb-4 ${isLost ? 'text-blue-800' : 'text-green-800'}`}>
                                {isLost ? 'Informar Avistamento' : 'Reivindicar Posse'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold opacity-70 mb-1">DATA</label>
                                        <input type="date" required className="w-full p-2 border rounded-lg" onChange={e => setInteractionForm({...interactionForm, date: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold opacity-70 mb-1">HORA</label>
                                        <input type="time" required className="w-full p-2 border rounded-lg" onChange={e => setInteractionForm({...interactionForm, time: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold opacity-70 mb-1">
                                        {isLost ? 'DETALHES DO AVISTAMENTO' : 'MENSAGEM PARA QUEM ENCONTROU'}
                                    </label>
                                    <textarea 
                                        required 
                                        rows={3} 
                                        className="w-full p-2 border rounded-lg resize-none" 
                                        placeholder={isLost ? "Descreva como ele estava..." : "Descreva características únicas para provar que é seu..."} 
                                        onChange={e => setInteractionForm({...interactionForm, desc: e.target.value})}
                                    />
                                </div>
                                <div className="text-sm font-medium opacity-80">
                                    {interactionForm.lat !== 0 ? '✅ Local marcado no mapa' : '⚠️ Clique no mapa acima para marcar o local'}
                                </div>
                                <button type="submit" className={`w-full text-white font-bold py-3 rounded-xl shadow-md ${isLost ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                    Enviar Informação
                                </button>
                            </form>
                        </div>
                    )}

                    {/* LISTA DE INTERAÇÕES (Sightings/Claims) */}
                    {pet.sightings.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Clock className="text-gray-400" /> Histórico de Interações
                            </h3>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {pet.sightings.map(s => (
                                    <div key={s.id} className="relative pl-6 border-l-2 border-orange-200 pb-2 last:pb-0">
                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                                        
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* LÓGICA DE PRIVACIDADE: Só o dono vê os dados completos */}
                                                {isOwner ? (
                                                    <>
                                                        <div className="text-sm font-bold text-gray-800">{s.user.name}</div>
                                                        <div className="text-xs text-blue-600 flex flex-col">
                                                            <span>{s.user.email}</span>
                                                            {s.user.phone && <span>{s.user.phone}</span>}
                                                        </div>
                                                    </>
                                                ) : (
                                                    // Quem não é dono vê protegido
                                                    <div className="text-sm font-bold text-gray-800">
                                                        {s.user.name ? s.user.name.split(' ')[0] : 'Usuário'} <span className="text-gray-400 font-normal">(Comunidade)</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(s.dateTime).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {isOwner && s.user.phone && (
                                            <button onClick={() => handleWhatsApp(s.user.phone!)} className="mt-2 mb-1 text-xs flex items-center gap-1 text-green-600 hover:underline font-bold">
                                                <Phone size={12} /> Contatar {s.user.name.split(' ')[0]}
                                            </button>
                                        )}

                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                            "{s.description}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;