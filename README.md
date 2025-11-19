# Encontre seu Pet - Palmas-TO

![Imagem de um cachorro e um gato juntos](https://placehold.co/800x300/FF983F/FFFFFF?text=Encontre+seu+Pet&font=inter)

## 📖 Sobre o Projeto

**Encontre seu Pet** é um protótipo de plataforma web desenvolvido como um projeto acadêmico. O objetivo principal é centralizar e facilitar a busca por animais de estimação perdidos e a divulgação de animais encontrados na cidade de Palmas, Tocantins. A aplicação visa conectar tutores a seus pets desaparecidos de forma rápida e eficiente, fortalecendo a comunidade local em torno do bem-estar animal.


Este é um projeto full-stack desenvolvido para conectar a comunidade em torno da causa animal, permitindo o cadastro de anúncios de pets **Perdidos**, **Encontrados** e disponíveis para **Adoção**.

## ✨ Tecnologias Utilizadas

Este projeto é dividido em **Frontend** (React/Vite) e **Backend** (Node.js/Express).

### Frontend (Client-side)

| Tecnologia | Descrição |
| :--- | :--- |
| **React** | Biblioteca JavaScript principal para construção da interface do usuário. |
| **TypeScript** | Linguagem que adiciona tipagem estática ao JavaScript, aumentando a robustez. |
| **Vite** | Tooling de build rápido para o ambiente de desenvolvimento. |
| **Tailwind CSS** | Framework CSS utilitário para estilização rápida e responsiva. |
| **Lucide React** | Biblioteca de ícones simples e consistentes. |
| **React Router DOM** | Roteamento de componentes na aplicação. |
| **Leaflet Maps** | Biblioteca de mapas para exibição e marcação de localização dos pets. |

### Backend (Server-side)

| Tecnologia | Descrição |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no lado do servidor. |
| **Express** | Framework web rápido e minimalista para Node.js, usado para criar a API REST. |
| **Prisma ORM** | **ORM (Object-Relational Mapper)** moderno, usado para comunicação e migração com o banco de dados. |
| **PostgreSQL** | **Sistema de Banco de Dados** robusto e relacional (você pode substituir por MySQL ou SQLite, dependendo da sua configuração). |
| **JWT (JSON Web Tokens)** | Padrão de segurança para autenticação e autorização de usuários. |
| **Multer** | Middleware para Node.js usado para lidar com o upload de arquivos (fotos dos pets). |

-----

## 🛠️ Estrutura do Projeto

O projeto segue uma arquitetura separada (Frontend e Backend) que se comunicam através de requisições HTTP (API REST).

### Backend (API)

  * **Models:** Definidos via **Prisma Schema** (`schema.prisma`).
  * **Controllers:** Recebem as requisiçõe HTTP, validam dados e chamam os serviços.
  * **Services:** Contêm a **regra de negócio** principal (e.g., `CreateUserService`, `ResolvePetService`).
  * **Routes:** Mapeamento dos endpoints (`/pets`, `/login`, `/users`).
  * **Database Logic:** Utiliza **Prisma** para todas as operações de CRUD.

### Frontend (Web App)

  * **Pages:** Componentes de nível superior que representam as diferentes rotas (`/login`, `/register`, `/`, `/meus-anuncios`).
  * **Components:** Componentes reutilizáveis (`Header`, `PetCard`, `SearchBar`, `MapComponent`).
  * **State Management:** Gerenciamento de estado local via `useState` e `useEffect`.
  * **Authentication:** Baseada no **Token JWT** armazenado no `localStorage`.

-----

## 🚀 Como Iniciar o Projeto

Siga estes passos para configurar o ambiente de desenvolvimento.

### 1\. Configuração do Banco de Dados (Backend)

1.  **Instale e configure** o seu banco de dados (ex: PostgreSQL).

2.  Crie um arquivo **`.env`** na raiz da pasta do seu Backend e adicione sua URL de conexão com o Prisma:

    ```env
    # Exemplo para PostgreSQL
    DATABASE_URL="postgresql://[USUARIO]:[SENHA]@[HOST]:[PORTA]/[NOME_DB]?schema=public"
    JWT_SECRET="sua_chave_secreta_aqui"
    ```

3.  **Execute as migrações** para criar as tabelas no seu banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

### 2\. Rodar o Backend (API)

Na pasta do Backend:

```bash
# Instala as dependências
npm install

# Inicia o servidor (geralmente com hot-reload)
npm run dev
```

O backend estará acessível em `http://localhost:3000`.

### 3\. Rodar o Frontend (Aplicação Web)

Na pasta do Frontend:

```bash
# Instala as dependências
npm install

# Inicia a aplicação React
npm run dev
```

O Frontend estará acessível em `http://localhost:5173` (ou a porta que o Vite definir). Certifique-se de que todas as requisições no Frontend estão apontando corretamente para o Backend (ajustando a URL base de `http://localhost:3000` para a URL de produção, se aplicável).

-----

## 🔒 Regras de Negócio Chave

  * **Autenticação:** Usuários são autenticados via JWT.
  * **Status de Pets:** Os pets podem ter os status: `perdido`, `encontrado`, `adocao` ou `finalizado`.
  * **Visibilidade `Finalizado`:** Pets com status `finalizado` **não** aparecem na lista pública (Home), sendo visíveis apenas para o criador do anúncio e para o usuário que interagiu na tela de **Meus Anúncios**.
  * **Resolução:** Ao marcar um pet como `finalizado`, o sistema busca o ID do usuário (se for um usuário da plataforma) pelo **email** para criar um vínculo relacional correto (`foundByUserId`).

## 👥 Equipe

* Eduardo Patrick Pereira Cavalcante
* João Miguel Mendes Bezerra Costa
* Vinicius Felipe Ferreira Folha