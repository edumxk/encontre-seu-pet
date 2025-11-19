import { useState, useMemo, useEffect } from 'react';
import { PetCard } from '../../components/common/PetCard';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterTabs } from '../../components/common/FilterTabs';
import type { Pet } from '../../types';
import { Frown, Loader2 } from 'lucide-react';

type ActiveFilter = 'todos' | 'perdido' | 'encontrado' | 'adocao';

interface PetWithPhotos extends Pet {
    fotos: string[];
}

const HomePage = () => {
    const [pets, setPets] = useState<PetWithPhotos[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchPets() {
            try {
                const response = await fetch('http://localhost:3000/pets');
                const data = await response.json();

                const mappedPets = data.map((p: any) => {
    let listaFotos: string[] = [];

    if (p.images && p.images.length > 0) {
        listaFotos = p.images.map((img: any) => {
            return encodeURI(img.url); 
        });
    } else {
        const fallback = p.species === 'gato' 
            ? 'https://placekitten.com/500/500' 
            : 'https://placedog.net/500';
        listaFotos = [fallback];
    }

    return {
        id: p.id,
        nome: p.name || 'Sem nome',
        raca: p.breed || 'Não informada',
        local: p.location,
        status: p.status,
        fotos: listaFotos, 
        imagem: listaFotos[0], 
        
        tamanho: p.size,
        cor: p.color,
        recompensa: p.reward,
        species: p.species,
        sexo: 'Desconhecido' 
    };
});

                setPets(mappedPets);
            } catch (error) {
                console.error("Erro ao buscar pets:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPets();
    }, []);

    const filteredPets = useMemo(() => {
        return pets.filter(pet => {
            const matchesFilter = activeFilter === 'todos' || pet.status === activeFilter;
            
            const matchesSearch = searchTerm === '' ||
                pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.local.toLowerCase().includes(searchTerm.toLowerCase());
                
            return matchesFilter && matchesSearch;
        });
    }, [pets, activeFilter, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Seção de Filtros e Busca */}
            <section className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </section>
            
            {/* Grade de Pets */}
            {filteredPets.length > 0 ? (
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </main>
            ) : (
                <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm flex flex-col items-center">
                    <Frown size={64} className="text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Nenhum pet encontrado</h3>
                    <p className="mt-1 text-gray-500">Tente ajustar seus filtros ou o termo de busca.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;