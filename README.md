# Encontre seu Pet - Palmas-TO

![Imagem de um cachorro e um gato juntos](https://placehold.co/800x300/FF983F/FFFFFF?text=Encontre+seu+Pet&font=inter)

## 📖 Sobre o Projeto

**Encontre seu Pet** é um protótipo de plataforma web desenvolvido como um projeto acadêmico. O objetivo principal é centralizar e facilitar a busca por animais de estimação perdidos e a divulgação de animais encontrados na cidade de Palmas, Tocantins. A aplicação visa conectar tutores a seus pets desaparecidos de forma rápida e eficiente, fortalecendo a comunidade local em torno do bem-estar animal.

Atualmente, o projeto funciona como um protótipo com páginas estáticas, onde o backend e o banco de dados são simulados através de dados no formato CSV diretamente no código-fonte.

---

## ✨ Funcionalidades Implementadas

O protótipo conta com as seguintes páginas e funcionalidades:

* **Página Inicial (`index.html`):**
    * Listagem de todos os anúncios de pets perdidos e encontrados.
    * Sistema de **filtros** por status ("Perdidos", "Encontrados", "Todos").
    * **Barra de busca** textual para encontrar animais por raça, cor, local, etc.

* **Cadastro de Usuário (`registrar-usuario.html`):**
    * Formulário para criação de uma nova conta de usuário com validação de campos.

* **Login de Usuário (`login.html`):**
    * Formulário para autenticação do usuário.

* **Cadastro de Anúncio (`cadastrar-pet.html`):**
    * Formulário completo para registrar um pet perdido ou encontrado, incluindo campos para espécie, raça, cor, foto e informações de contato.

* **Gerenciamento de Anúncios (`meus-anuncios.html`):**
    * Página que simula a área do usuário logado.
    * Permite ao usuário visualizar seus próprios anúncios e **marcar um caso como "Finalizado"**, atualizando a interface visualmente para indicar que o pet foi encontrado/devolvido.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas de front-end, carregadas via CDN para simplificar o ambiente de desenvolvimento do protótipo:

* [**React**](https://react.dev/): Biblioteca principal para a construção da interface de usuário de forma componentizada.
* [**TypeScript**](https://www.typescriptlang.org/)** (Conceitual)**: O projeto foi planejado para usar TypeScript, e a sintaxe nos componentes segue boas práticas, embora a transpilação seja feita via Babel no navegador.
* [**Tailwind CSS**](https://tailwindcss.com/): Framework de estilização "utility-first" para criar um design moderno e responsivo rapidamente.
* [**Lucide Icons**](https://lucide.dev/): Biblioteca de ícones open-source para uma interface mais clara e amigável.
* [**Babel (Standalone)**](https://babeljs.io/docs/babel-standalone): Utilizado para transpilar o código JSX diretamente no navegador, permitindo o desenvolvimento com React em arquivos `.html` sem a necessidade de um ambiente de compilação complexo.

---

## 🚀 Como Executar

Como este é um protótipo baseado em arquivos estáticos, não há necessidade de instalação de dependências ou de um servidor complexo.

1.  Clone este repositório:
    ```bash
    git clone https://github.com/edumxk/encontre-seu-pet.git
    ```
2.  Navegue até o diretório do projeto.
3.  Abra qualquer um dos arquivos `.html` (comece pelo `index.html`) diretamente no seu navegador de preferência (Google Chrome, Firefox, etc.).

---

## 👥 Equipe

* Eduardo Patrick Pereira Cavalcante
* João Miguel Mendes Bezerra Costa
* Vinicius Felipe Ferreira Folha