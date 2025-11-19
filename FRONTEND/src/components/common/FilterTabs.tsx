import { List, PawPrint, Heart } from 'lucide-react';

interface FilterTabsProps {
    activeFilter: string;
    setActiveFilter: (filter: 'todos' | 'perdido' | 'encontrado' | 'adocao') => void;
}

type Filter = 'todos' | 'perdido' | 'encontrado' | 'adocao';

export const FilterTabs = ({ activeFilter, setActiveFilter }: FilterTabsProps) => {
    const filters: { id: Filter, label: string, icon: React.ElementType }[] = [
        { id: 'todos', label: 'Todos', icon: List },
        { id: 'perdido', label: 'Perdidos', icon: PawPrint },
        { id: 'encontrado', label: 'Encontrados', icon: PawPrint },
        { id: 'adocao', label: 'Adoção', icon: Heart },
    ];

    const getButtonStyle = (filterId: string) => {
        return activeFilter === filterId
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100';
    };

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex-1 sm:flex-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${getButtonStyle(filter.id)}`}
                >
                    <filter.icon size={18} />
                    <span>{filter.label}</span>
                </button>
            ))}
        </div>
    );
};