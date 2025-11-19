import type { Pet } from '../../types';
import { MapPin, Edit, CheckCircle, XCircle } from 'lucide-react';

interface ManagedPetCardProps {
    pet: Pet & { isResolved?: boolean }; // Recebe o estado 'isResolved'
    onMarkAsResolved: (id: number) => void;
}

export const ManagedPetCard = ({ pet, onMarkAsResolved }: ManagedPetCardProps) => {
    const statusInfo = {
        perdido: { label: 'Perdido', style: 'text-red-600' },
        encontrado: { label: 'Encontrado', style: 'text-blue-600' },
        adocao: { label: 'Adoção', style: 'text-green-600' }
    };
    const info = statusInfo[pet.status as keyof typeof statusInfo] || statusInfo.perdido;

    return (
        <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${pet.isResolved ? 'opacity-60' : ''}`}>
            <div className="flex">
                <img className="w-1/3 h-full object-cover" src={pet.fotoUrl} alt={pet.nome} />
                <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{pet.nome}</h3>
                            <span className={`text-sm font-semibold ${info.style}`}>{info.label}</span>
                        </div>
                        <button className="text-gray-500 hover:text-orange-500" title="Editar">
                            <Edit size={18} />
                        </button>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{pet.local}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        {pet.isResolved ? (
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle size={20} />
                                <span className="font-semibold">Resolvido!</span>
                            </div>
                        ) : (
                            <button 
                                onClick={() => onMarkAsResolved(pet.id)}
                                className="w-full bg-green-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Marcar como Resolvido
                            </button>
                        )}
                        <button className="w-full mt-2 bg-red-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                            <XCircle size={18} />
                            Excluir Anúncio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};