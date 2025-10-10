Meus Mangás – Catálogo de Mangás

Aplicativo em React Native (Expo) integrado ao Supabase para catalogar sua coleção de mangás. O app possui tema branco e roxo, uma tela de carregamento com a logo “Meus Mangás”, e três telas principais: Home, Detalhes e Adicionar/Editar.

| Nome do Campo | Tipo de Dado | Atributos          | Descrição                               |
| ------------- | ------------ | ------------------ | --------------------------------------- |
| id            | `BIGINT`     | PK, Auto Increment | Identificador único do mangá            |
| title         | `TEXT`       | NOT NULL           | Nome do mangá                           |
| author        | `TEXT`       |                    | Autor ou estúdio responsável            |
| volume        | `INTEGER`    |                    | Número do volume                        |
| edition       | `TEXT`       |                    | Edição do mangá (ex: Big, Especial)     |
| genre         | `TEXT`       |                    | Gênero (ex: Ação, Romance, Fantasia)    |
| language      | `TEXT`       |                    | Idioma (ex: Japonês, Português, Inglês) |
| release_date  | `TEXT`       |                    | Data de lançamento do volume (MM/YYYY)  |
| isbn          | `TEXT`       |                    | Código ISBN                             |
| cover_url     | `TEXT`       |                    | URL da capa do mangá                    |
| added_at      | `TIMESTAMP`  | Default: `now()`   | Data de adição no catálogo              |



Configuração do Projeto

Crie um novo projeto no Supabase
.

Vá em Table Editor → New Table e crie a tabela mangas com as colunas acima.

Copie o Project URL e a anon public key do Supabase (em Project Settings → API).

Cole as credenciais no código do app:

const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON';

Estrutura do App

Telas:

HomeScreen

Lista todos os mangás cadastrados.

Cada card exibe: capa, título, autor, edição, volume, gênero, idioma e data de lançamento.

Campo de busca filtra por título, autor ou ISBN.

Pull-to-refresh atualiza a lista diretamente do Supabase.

Botão “➕” abre o formulário de adição.

DetailsScreen

Mostra informações completas do mangá selecionado.

Exibe capa, título, autor, edição, volume, gênero, idioma, ISBN e data de lançamento.

Botão de Editar abre o formulário pré-preenchido com os dados existentes.

CreateScreen (Adicionar/Editar)

Campos:

Título

Autor

Edição

Volume

Gênero

Idioma

Data de lançamento (MM/YYYY)

ISBN

URL da capa

Ao salvar:

Se estiver adicionando, o mangá é inserido no Supabase.

Se estiver editando, o mangá existente é atualizado no Supabase.

O formulário mantém os dados existentes para facilitar a edição.

SplashScreen

Fundo branco com acentos roxos.

Exibe a logo “Meus Mangás” centralizada enquanto o app carrega.

| Elemento                  | Cor                                     |
| ------------------------- | --------------------------------------- |
| Fundo principal           | `#FFFFFF` (branco)                      |
| Acentos / botões / ícones | `#6C2BD9` (roxo intenso)                |
| Texto principal           | `#1E1E1E` (cinza escuro)                |
| Fundo dos cards           | `#F7F5FF` (branco com leve toque lilás) |


Como Executar

Acesse Snack.expo.dev
 ou use expo start.

Crie um novo projeto e cole o código do app (App.js).

Substitua as credenciais do Supabase.

Clique em Run → Android/iOS/Web para testar.



Feito com 💜 para organizar seus mangás de forma bonita, prática e funcional!