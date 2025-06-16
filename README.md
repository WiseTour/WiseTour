# 🌐 WiseTour - Aplicação Web ✈️

**Sistema de análise de dados turísticos** com dashboard interativo para agências de turismo internacional com foco no Brasil.

---

## 📋 Visão Geral

A aplicação web do WiseTour oferece uma **plataforma completa** para análise estratégica de dados turísticos, permitindo que agências de turismo tomem decisões baseadas em dados oficiais do governo brasileiro.

### 🎯 Funcionalidades Principais
- **Site institucional** com informações sobre a plataforma
- **Sistema de autenticação** (cadastro e login de usuários)
- **Dashboard interativo** com gráficos e visualizações
- **Filtros dinâmicos** para exploração personalizada dos dados
- **Análises estratégicas** por nacionalidade, estado e sazonalidade

---

## 🏗️ Arquitetura da Aplicação

### 🖥️ **Frontend**
- **Site institucional** responsivo
- **Interface de autenticação** (login/cadastro)
- **Dashboard** com gráficos interativos
- **Filtros avançados** para análise de dados

### ⚙️ **Backend**
- **API RESTful** para comunicação com frontend
- **Sistema de autenticação** e autorização
- **Endpoints** para consulta de dados turísticos
- **Integração** com banco de dados MySQL

### 📊 **Dashboard Features**
- Visualização de **chegadas por nacionalidade**
- Análise de **meios de transporte** utilizados
- **Distribuição geográfica** por estado
- **Tendências sazonais** e temporais
- **Filtros interativos** por período e região

---

## 🗂️ Estrutura do Projeto

```
├── auth/                 -> Sistema de autenticação
├── common/               -> Recursos compartilhados
├── internal/             -> Módulos internos
├── node_modules/         -> Dependências do Node.js
├── private/              -> Dashboard
├── public/               -> Site Institucional
├── src/                  -> Back-end
├── .env                  -> Variáveis de ambiente
├── .env.dev              -> Configurações de desenvolvimento
├── .gitignore            -> Arquivos ignorados pelo Git
├── app.js                -> Arquivo principal da aplicação
├── cacheService.js       -> Serviço de cache
├── LICENSE               -> Licença do projeto
├── package-lock.json     -> Lock das dependências
├── package.json          -> Configurações e dependências
└── README.md             -> Documentação do projeto
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Finalidade |
|------------|------------|
| **HTML** | Estrutura das páginas |
| **CSS** | Estilização e responsividade |
| **JavaScript** | Interatividade e consumo da API |
| **Chart.js** | Gráficos e visualizações |

### Backend
| Tecnologia | Finalidade |
|------------|------------|
| **Node.js** | Runtime JavaScript |
| **Express.js** | Framework web |
| **Sequelize** | ORM para MySQL |
| **cors** | Política de CORS |

### Banco de Dados
| Tecnologia | Finalidade |
|------------|------------|
| **MySQL** | Banco de dados relacional |
| **AWS RDS** | Hospedagem do banco em nuvem |

---

## 🚀 Configuração e Instalação

### 1. **Configuração do Ambiente**

O projeto utiliza arquivos `.env` e `.env.dev` para configuração das variáveis de ambiente necessárias para conexão com o banco MySQL via Sequelize.

### 2. **Instalação das Dependências**

```bash
# Clone o repositório
git clone https://github.com/WiseTour/wise-tour.git
cd wise-tour

# Instale as dependências
npm install

# Inicie a aplicação
node app.js
```

### 3. **Arquivos de Configuração**

- **`.env`** - Variáveis de ambiente para produção
- **`.env.dev`** - Configurações para desenvolvimento
- **`app.js`** - Arquivo principal que inicia a aplicação
---

## 📊 Funcionalidades do Dashboard

### 📈 **Análises Disponíveis**

#### 🌍 **Por Nacionalidade**
- Países que mais enviam turistas
- Evolução temporal por nacionalidade

#### 🗺️ **Por Estado/Região**
- Distribuição geográfica dos turistas
- Estados mais visitados por nacionalidade

#### ✈️ **Por Meio de Transporte**
- Aéreo vs. Terrestre vs. Marítimo
- Preferências por nacionalidade

#### 📅 **Análise Temporal**
- Sazonalidade mensal e anual
- Picos e vales de visitação

### 🔍 **Filtros**
- **Período:** Seleção de datas específicas
- **Nacionalidade:** Filtro por país de origem
- **Estado:** Foco em regiões específicas

---

## 🔐 Sistema de Autenticação

A aplicação possui sistema de **cadastro e login** de usuários para acesso ao dashboard.

---

## 🌐 API Backend

O backend foi desenvolvido com **Node.js**, **Express.js** e **Sequelize** para integração com o banco MySQL, fornecendo dados para o dashboard através de APIs RESTful.

---

## 🎨 Interface e Experiência

### 🏠 **Site Institucional**
- **Landing page** atrativa e informativa
- **Seções:** Sobre, Funcionalidades, Contato
- **Design responsivo** para todos os dispositivos
- **Call-to-action** para cadastro

### 📊 **Dashboard**
- **Interface intuitiva** e limpa
- **Gráficos interativos** com hover e zoom
- **Filtros em tempo real** sem reload da página
- **Exportação** de dados e gráficos
- **Temas** claro e escuro

### 📱 **Responsividade - Site Institucional**
- **Mobile-first** design
- **Adaptação** para tablets e desktops
- **Navegação touch-friendly**
- **Performance otimizada**

---

## 🌐 Contexto no Projeto WiseTour

Esta aplicação web é o **frontend principal** do ecossistema WiseTour, integrando-se com:

### 📦 **Outros Módulos**

| Módulo | Integração | Repositório |
|--------|------------|-------------|
| **ETL** | Consome dados processados | [etl](https://github.com/WiseTour/etl) |
| **Database** | Conecta via Sequelize ORM | [database](https://github.com/WiseTour/database) |
| **Shell Scripts** | Deploy automatizado | [shell-scripts](https://github.com/WiseTour/shell-scripts) |

### 🔄 **Fluxo de Dados**
```
Dados Oficiais → ETL → MySQL → API Backend → Frontend Dashboard
```

### 🎯 **Usuários-Alvo**
- **Agências de turismo** internacional
- **Gestores** de marketing turístico
- **Analistas** de mercado
- **Profissionais** do setor de turismo

---

## 🚀 Deploy e Hospedagem

### ☁️ **AWS Infrastructure**
- **EC2:** Hospedagem da aplicação
- **RDS:** Banco de dados MySQL
- **S3:** Assets estáticos (opcional)
- **CloudFront:** CDN (opcional)

### 🐳 **Docker (Opcional)**
```bash
# Build da imagem
docker build -t wisetour-web .

# Executar container
docker run -p 3000:3000 --env-file .env wisetour-web
```

### 🔧 **Scripts de Deploy**
O deploy é automatizado via **shell scripts** do projeto:
```bash
# Execute via módulo shell-scripts
./deploy-wisetour-web.sh
```

---

## 💡 Benefícios para Agências

### 📈 **Vantagens Competitivas**
- **Decisões baseadas em dados** oficiais
- **Antecipação de tendências** sazonais
- **Segmentação precisa** de campanhas
- **Otimização** de pacotes turísticos

### 🎯 **Casos de Uso**
- **Planejamento** de campanhas por nacionalidade
- **Identificação** de períodos de alta demanda
- **Análise** de concorrência regional
- **Criação** de ofertas personalizadas

---

## 📄 Licença

Projeto acadêmico desenvolvido para o **Projeto Integrador da SPTECH School**.
Todos os direitos reservados aos autores e à instituição.

> **WiseTour Web — Interface inteligente para análise estratégica do turismo internacional.**
