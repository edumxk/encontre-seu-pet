export interface Pet {
  id: number;
  nome: string;
  especie: 'cachorro' | 'gato' | string;
  species: 'cachorro' | 'gato' | string;
  raca: string;
  cor: string;
  tamanho: 'pequeno' | 'medio' | 'grande' | string;
  fotoUrl: string;
  local: string;
  data: string;
  status: 'perdido' | 'encontrado' | 'adocao' | string;
  contato: string;
  recompensa?: string;
  latitude?: number;
  longitude?: number;
  imagens: { id: number; url: string }[];
  usuarioId: number;
}