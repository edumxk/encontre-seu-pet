import { useState, useEffect } from 'react';
import { MapPin, Camera, Ruler, Palette, Banknote, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Pet } from '../../types';

// Interface local para garantir que o TS aceite as fotos extras
interface PetWithPhotos extends Pet {
    fotos: string[];
}

interface PetCardProps {
    pet: PetWithPhotos;
}

export const PetCard = ({ pet }: PetCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const statusColors = {
        perdido: 'bg-red-100 text-red-700 border-red-200',
        encontrado: 'bg-green-100 text-green-700 border-green-200',
        adocao: 'bg-blue-100 text-blue-700 border-blue-200'
    };

    const statusLabel = {
        perdido: 'Perdido',
        encontrado: 'Encontrado',
        adocao: 'Para Adoção'
    };

    // Lógica do Carrossel Automático
    useEffect(() => {
        if (!pet.fotos || pet.fotos.length <= 1 || isHovering) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === pet.fotos.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [pet.fotos, isHovering]);

    // Fallback para evitar erro se pet.fotos for undefined
    const fotosSeguras = pet.fotos && pet.fotos.length > 0 
        ? pet.fotos 
        : ['https://placedog.net/500'];

    return (
        <div 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group flex flex-col h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* --- ÁREA DA IMAGEM (CARROSSEL) --- */}
            <div className="relative h-56 overflow-hidden bg-gray-100 shrink-0">
                <img 
                    src={fotosSeguras[currentImageIndex]} 
                    alt={pet.nome} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = 'https://placedog.net/500'; }}
                />
                
                {/* Badge de Status */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide shadow-sm ${statusColors[pet.status as keyof typeof statusColors]}`}>
                    {statusLabel[pet.status as keyof typeof statusLabel]}
                </div>

                {/* Contador de Fotos */}
                {fotosSeguras.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-[10px] flex items-center gap-1 backdrop-blur-sm">
                        <Camera size={12} />
                        {currentImageIndex + 1}/{fotosSeguras.length}
                    </div>
                )}

                {/* Indicadores (Bolinhas) */}
                {fotosSeguras.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {fotosSeguras.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* --- CONTEÚDO DO CARD --- */}
            <div className="p-4 flex flex-col flex-grow space-y-3">
                
                {/* Cabeçalho: Nome e Raça */}
                <div>
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1 capitalize">
                        {pet.nome || 'Nome Desconhecido'}
                    </h3>
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600 inline-block mt-1 capitalize">
                        {pet.raca || 'Raça não informada'}
                    </span>
                </div>

                {/* GRID DE ATRIBUTOS (Novo!) */}
                <div className="flex flex-wrap gap-2">
                    {/* Tamanho */}
                    {pet.tamanho && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100" title="Tamanho">
                            <Ruler size={12} className="text-gray-400" />
                            <span className="capitalize">{pet.tamanho}</span>
                        </div>
                    )}
                    
                    {/* Cor */}
                    {pet.cor && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100" title="Cor">
                            <Palette size={12} className="text-gray-400" />
                            <span className="capitalize">{pet.cor}</span>
                        </div>
                    )}

                    {/* Espécie */}
                    {pet.species && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100" title="Espécie">
                            <PawPrint size={12} className="text-gray-400" />
                            <span className="capitalize">{pet.species}</span>
                        </div>
                    )}
                </div>

                {/* DESTAQUE PARA RECOMPENSA (Se houver) */}
                {pet.recompensa && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg border border-green-100 mt-1">
                        <Banknote size={18} />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-green-600 leading-none">Recompensa</p>
                            <p className="font-bold text-sm">R$ {pet.recompensa}</p>
                        </div>
                    </div>
                )}

                {/* Espaçador para empurrar o rodapé para baixo */}
                <div className="flex-grow"></div>

                {/* Rodapé: Localização e Botão */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-start text-gray-500 text-xs">
                        <MapPin size={14} className="mr-1 text-orange-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{pet.local}</span>
                    </div>

                    <Link 
                        to={`/pet/${pet.id}`} 
                        className="block w-full text-center py-2 px-4 border border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all text-sm"
                    >
                        Ver Detalhes
                    </Link>
                </div>
            </div>
        </div>
    );
};