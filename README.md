# 🌐 WiseTour ✈️
---

## 📖 Visão Geral

**WiseTour** é um sistema voltado para **agências de turismo estrangeiro com foco no Brasil**, desenvolvido para oferecer suporte à análise de dados estratégicos do setor, como:

- **Nacionalidade dos turistas** por estado;
- **Meios de transporte mais utilizados** para entrada no país;
- **Distribuição geográfica e sazonalidade** da demanda turística.

A proposta é fornecer uma plataforma capaz de **prever tendências**, otimizar a **distribuição de campanhas de marketing** e permitir a **criação de pacotes personalizados** de forma ágil e estratégica, contribuindo para uma **vantagem competitiva** frente à crescente concorrência do setor.

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

