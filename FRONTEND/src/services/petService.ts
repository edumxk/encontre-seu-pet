import type { Pet } from '../types';

// Dados dos pets em formato CSV
const csvData = `id,nome,especie,raca,cor,tamanho,fotoUrl,local,data,status
1,"Rex","cachorro","Vira-lata","Caramelo","medio","https://placehold.co/400x400/FDBF60/333333?text=Rex","Quadra 104 Sul","10/09/2025","perdido"
2,"Mimi","gato","Siamês","Branco e Marrom","pequeno","https://placehold.co/400x400/D6C7B9/333333?text=Mimi","Próximo ao Capim Dourado Shopping","10/09/2025","encontrado"
3,"Thor","cachorro","Golden Retriever","Dourado","grande","https://placehold.co/400x400/E5C992/333333?text=Thor","Parque Cesamar","05/09/2025","perdido"
4,"Luna","gato","Vira-lata","Cinza","pequeno","https://placehold.co/400x400/B2B2B2/FFFFFF?text=Luna","Praça dos Girassóis","09/09/2025","encontrado"
5,"Billy","cachorro","Poodle","Branco","pequeno","https://placehold.co/400x400/FFFFFF/333333?text=Billy","Jardim Aureny III","07/09/2025","perdido"
6,"Frajola","gato","Vira-lata","Preto e Branco","medio","https://placehold.co/400x400/404040/FFFFFF?text=Frajola","Orla de Palmas","10/09/2025","encontrado"
7,"Bolinha","cachorro","Poodle","Branco","pequeno","https://placehold.co/400x400/FFFFFF/333333?text=Bolinha","Avenida JK","11/09/2025","perdido"
`;

// Dados para a página "Meus Anúncios"
const myCsvData = `id,nome,especie,raca,cor,tamanho,fotoUrl,local,data,status
1,"Rex","cachorro","Vira-lata","Caramelo","medio","https://placehold.co/400x400/FDBF60/333333?text=Rex","Quadra 104 Sul","10/09/2025","perdido"
3,"Thor","cachorro","Golden Retriever","Dourado","grande","https://placehold.co/400x400/E5C992/333333?text=Thor","Parque Cesamar","05/09/2025","perdido"
`;

const parseCSV = (csvText: string): Pet[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const pets: Pet[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)!.map(val => val.replace(/"/g, ''));
        
        const petObject: any = {};
        headers.forEach((header, index) => {
            petObject[header] = values[index];
        });
        petObject.id = parseInt(petObject.id, 10);
        pets.push(petObject as Pet);
    }
    return pets;
};

// Exporta funções para buscar os dados
export const getAllPets = (): Pet[] => {
    return parseCSV(csvData);
};

export const getMyPets = (): Pet[] => {
    return parseCSV(myCsvData);
};