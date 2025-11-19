import { Search } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Buscar por nome, raça ou local..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
            </div>
        </div>
    );
};