# 🌐 WiseTour - Análise de Dados Turísticos ✈️
---

## 📖 Visão Geral

**WiseTour** é um sistema voltado para **agências de turismo estrangeiro com foco no Brasil**, desenvolvido para oferecer suporte à análise de dados estratégicos do setor, como:

- **Nacionalidade dos turistas** por estado;
- **Meios de transporte mais utilizados** para entrada no país;
- **Distribuição geográfica e sazonalidade** da demanda turística.

---

## 🗂️ Estrutura do Projeto

O projeto **WiseTour** é dividido em quatro módulos principais:

### 1. WiseTour (Aplicação Web - Frontend + Backend)

- Site institucional
- Área de cadastro e login de usuários
- Dashboard com gráficos interativos
- Filtros dinâmicos para exploração de dados

🔗 Repositório: [WiseTour - Aplicação Web](https://github.com/WiseTour/wise-tour)

---

### 2. ETL (Extração, Transformação e Carga de Dados)

- Processos de extração dos datasets oficiais
- Limpeza, transformação e carregamento dos dados no banco
- Registro de logs por etapa (extração, transformação, finalização)

🔗 Repositório: [WiseTour - ETL](https://github.com/WiseTour/etl)

---

### 3. Database (Banco de Dados e Modelo MER)

- Modelagem do banco de dados relacional
- Scripts de criação de tabelas, constraints e relacionamentos
- Scripts de inserção inicial de dados

🔗 Repositório: [WiseTour - Database](https://github.com/WiseTour/database)

---

### 4. Shell Scripts (Infraestrutura AWS)

- Automatização da criação do ambiente em nuvem (AWS)
- Configuração de servidor, banco de dados, backend e frontend
- Scripts de deploy para facilitar a instalação completa

🔗 Repositório: [WiseTour - Shell Scripts](https://github.com/WiseTour/shell-scripts)

---

## 📊 Fontes Oficiais de Dados

O projeto WiseTour utiliza dois conjuntos de dados públicos fundamentais para o turismo brasileiro:

### 📌 1. Estimativas de Chegadas de Turistas Internacionais ao Brasil

Este conjunto de dados contém informações detalhadas sobre o número de turistas internacionais que chegam ao Brasil, por país de origem, período e ponto de entrada.

🔗 [Acessar o dataset oficial](https://www.gov.br/turismo/pt-br/assuntos/estudos-e-pesquisas/demanda-internacional/estimativas-de-chegadas-de-turistas-internacionais)

---

### 📌 2. Estudo da Demanda Turística Internacional

Documento técnico que analisa tendências de fluxo turístico, perfil dos visitantes, motivos de viagem e fatores que influenciam a vinda de turistas ao Brasil.

🔗 [Acessar o estudo completo](https://www.gov.br/turismo/pt-br/assuntos/estudos-e-pesquisas/demanda-internacional/estudo-da-demanda-turistica-internacional)

---

## 🚀 Tecnologias Utilizadas

- **MySQL** (Banco de Dados)
- **Node.js + Express** (Backend)
- **Sequelize** (ORM)
- **HTML + CSS + JavaScript** (Frontend)
- **AWS EC2 e RDS** (Infraestrutura)
- **Apache POI + Java** (Processos ETL)
- **Shell Scripts** (Automação de infraestrutura)

---

## 🛠️ Como Executar o Projeto

1. Configure o ambiente AWS com os **[Shell Scripts](https://github.com/WiseTour/shell-scripts)**
2. Ajuste o script de inserção do banco de dados, caso seja necessário **[Database](https://github.com/WiseTour/database)**
3. Rode os processos de ETL para carregar os dados via **[ETL](https://github.com/WiseTour/etl)**
4. Acesse a aplicação Web que já estará clonada em seu ambiente da AWS**[WiseTour](https://github.com/WiseTour/wise-tour)**

> **⚠️ Importante:** o shell script prepara todo o ambiente, não será necessário clonar um repositório por vez.

---

## 💡 Motivação

Durante visita técnica à **Agaxtur Viagens**, com o executivo **Ricardo Braga**, foram identificadas dores recorrentes do setor:

- **Alta concorrência entre agências**;
- **Dificuldade na previsão de sazonalidade** de turistas;
- **Dificuldade com a constante atualização** no mercado;

WiseTour surge como uma resposta a esses desafios, utilizando dados reais e públicos para **direcionar ações de forma assertiva**, transformando **informações em inteligência de mercado**.

---

## 🛠️ Tecnologias Utilizadas

| Camada                            | Tecnologias                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **Frontend**                      | HTML, CSS, JavaScript                                                                         |
| **Backend**                       | Java + Apache POI (processo ETL) + Node e Sequelize (Dashboard)                               |
| **Banco de Dados**                | MySQL (estrutura relacional e consultas analíticas)                                           |
| **Design e Prototipação**         | Figma, Miro                                                                                   |
| **Infraestrutura em Nuvem**       | AWS EC2 (hospedagem da aplicação), AWS S3 (armazenamento das bases de dados), Docker na AWS   |
| **Versionamento e Gerenciamento** | GitHub, Planner                                                                               |

> O processo de ETL (Extração, Transformação e Carga) foi realizado com o uso da biblioteca Apache POI, permitindo a leitura e conversão de arquivos de dados governamentais em estruturas úteis para análise e exibição.  
> Toda a estrutura foi implementada em nuvem, utilizando **serviços da AWS**, com destaque para:
> - **EC2**: hospedagem da aplicação;
> - **S3**: armazenamento dos arquivos e bases utilizadas no processo de ETL com Java;
> - **Docker**: utilizado para containerizar a aplicação, garantindo portabilidade, escalabilidade e facilidade de gerenciamento no ambiente da AWS.

---

## 🔍 Funcionalidades

- 📊 Dashboard com visualização de **tendências por nacionalidade e estado**;
- 🛫 Análise de **meios de transporte mais utilizados por turistas**;
- 🗓️ Previsão de sazonalidade para ações promocionais;
- 📦 Criação de pacotes turísticos com **base nos dados analisados**.

---

## 🧪 Metodologia

O desenvolvimento foi conduzido com base em metodologias ágeis, organizadas em **Sprints quinzenais**, com entregas iterativas que envolveram:

1. Levantamento de requisitos com base em **entrevista com stakeholders reais**;
2. Pesquisa e coleta de **bases de dados públicas** (ex.: IBGE, Ministério do Turismo);
3. Prototipação e validação de interfaces com ferramentas como **Figma**;
4. Desenvolvimento orientado a dados com foco em **análises estratégicas**;
5. Testes de usabilidade e consistência com possíveis usuários do setor.

---

## 📈 Benefícios da Solução

- 🎯 **Precisão na segmentação de campanhas** de marketing internacional;
- 🧠 **Decisões orientadas por dados reais**, reduzindo riscos;
- 🧭 **Antecipação de tendências e sazonalidades** de mercado;
- ⚙️ Otimização da criação e oferta de **pacotes turísticos personalizados**;
- 📊 Melhoria contínua por meio de indicadores analíticos.

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos, como parte do **Projeto Integrador** da SPTECH School.  
Todos os direitos reservados aos autores e à instituição.

> **WiseTour — Transformando dados em decisões inteligentes no turismo internacional.**

