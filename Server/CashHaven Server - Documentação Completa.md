# CashHaven Server - Documentação Completa

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Configuração e Instalação](#configuração-e-instalação)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Sistema de Autenticação](#sistema-de-autenticação)
6. [Módulos e Funcionalidades](#módulos-e-funcionalidades)
7. [API Endpoints](#api-endpoints)
8. [Integração WhatsApp](#integração-whatsapp)
9. [WebSocket](#websocket)
10. [Banco de Dados](#banco-de-dados)
11. [Segurança](#segurança)
12. [Deploy e Produção](#deploy-e-produção)
13. [Troubleshooting](#troubleshooting)
14. [Referências](#referências)

---

## Visão Geral

O CashHaven Server é uma aplicação backend robusta desenvolvida em Node.js com TypeScript, projetada para gerenciar operações comerciais completas. O sistema oferece uma solução integrada para gestão de vendas, controle de estoque, gerenciamento de clientes, processamento de pedidos e integração com WhatsApp para comunicação automatizada.

A aplicação foi construída seguindo princípios de arquitetura limpa e padrões de desenvolvimento modernos, utilizando tecnologias consolidadas como Express.js para o framework web, MySQL para persistência de dados, JWT para autenticação, e WebSocket para comunicação em tempo real. O sistema também incorpora integração com o Venom Bot para automação de WhatsApp, proporcionando uma experiência omnichannel para os usuários finais.

O CashHaven Server atende especificamente ao setor de food service e varejo, com funcionalidades especializadas para estabelecimentos que necessitam de controle rigoroso de estoque, processamento ágil de vendas, e comunicação eficiente com clientes. A arquitetura modular permite fácil extensão e manutenção, enquanto a implementação em TypeScript garante maior segurança de tipos e melhor experiência de desenvolvimento.

### Características Principais

O sistema apresenta um conjunto abrangente de funcionalidades que cobrem todos os aspectos operacionais de um negócio comercial. O módulo de autenticação implementa um sistema seguro baseado em JWT (JSON Web Tokens) com diferentes níveis de acesso, permitindo controle granular sobre as operações que cada usuário pode realizar. O sistema suporta usuários administrativos e operacionais, cada um com permissões específicas adequadas às suas responsabilidades.

O controle de estoque oferece funcionalidades completas para gerenciamento de produtos, incluindo cadastro, atualização de preços, controle de saldo, e rastreamento de fornecedores. O sistema mantém histórico detalhado de movimentações, permitindo análises precisas de performance e tendências de vendas. A integração com o sistema de vendas garante que o estoque seja automaticamente atualizado a cada transação, mantendo dados sempre consistentes.

O módulo de gestão de clientes proporciona um CRM simplificado mas eficiente, permitindo cadastro completo de informações dos clientes, histórico de compras, e segmentação para campanhas de marketing. A integração com WhatsApp permite comunicação direta e personalizada, melhorando significativamente o relacionamento com o cliente e aumentando as oportunidades de venda.

### Tecnologias Utilizadas

A escolha tecnológica do CashHaven Server reflete uma abordagem moderna e pragmática para desenvolvimento de aplicações empresariais. O Node.js foi selecionado como runtime principal devido à sua excelente performance para aplicações I/O intensivas e ao vasto ecossistema de bibliotecas disponíveis. O TypeScript adiciona uma camada de segurança de tipos que é fundamental para aplicações de grande escala, reduzindo significativamente bugs relacionados a tipos de dados e melhorando a experiência de desenvolvimento.

O Express.js serve como framework web principal, oferecendo uma base sólida e flexível para construção de APIs REST. Sua arquitetura baseada em middleware permite fácil integração de funcionalidades como autenticação, logging, tratamento de erros, e validação de dados. A combinação com TypeScript resulta em código mais legível e manutenível, especialmente importante em projetos comerciais onde a estabilidade é crucial.

Para persistência de dados, o MySQL foi escolhido por sua confiabilidade comprovada em ambientes de produção e excelente suporte para transações ACID, essencial para operações financeiras e controle de estoque. O driver mysql2 oferece performance superior e suporte completo para recursos modernos do MySQL, incluindo prepared statements e connection pooling.

A integração com WhatsApp através do Venom Bot representa uma inovação significativa no setor, permitindo automação de comunicações que tradicionalmente requeriam intervenção manual. Esta funcionalidade abre possibilidades para notificações automáticas de pedidos, campanhas de marketing direcionadas, e suporte ao cliente em tempo real.

## Arquitetura do Sistema

A arquitetura do CashHaven Server segue um padrão de camadas bem definido, promovendo separação de responsabilidades e facilitando manutenção e evolução do sistema. A estrutura é organizada em camadas distintas: apresentação (routes), lógica de negócio (services), acesso a dados (database), e utilitários (utils), cada uma com responsabilidades específicas e interfaces bem definidas.

### Camada de Apresentação (Routes)

A camada de apresentação é responsável por receber requisições HTTP, validar parâmetros de entrada, e orquestrar chamadas para a camada de serviços. Cada módulo funcional possui seu próprio arquivo de rotas, promovendo organização e facilitando manutenção. As rotas implementam middleware de autenticação quando necessário, garantindo que apenas usuários autorizados possam acessar recursos protegidos.

O sistema de roteamento utiliza o Express Router para criar módulos independentes que são posteriormente integrados na aplicação principal. Esta abordagem permite desenvolvimento paralelo de diferentes funcionalidades e facilita testes unitários. Cada rota implementa tratamento adequado de erros, retornando códigos HTTP apropriados e mensagens descritivas para facilitar debugging e integração com sistemas cliente.

A validação de entrada é realizada na camada de rotas, garantindo que dados inválidos sejam rejeitados antes de chegarem à lógica de negócio. Isto inclui validação de tipos de dados, formatos, e regras de negócio básicas. Respostas são padronizadas seguindo um formato consistente que inclui indicadores de sucesso, dados retornados, e mensagens de erro quando aplicável.

### Camada de Serviços (Services)

A camada de serviços encapsula toda a lógica de negócio da aplicação, implementando regras específicas do domínio e orquestrando operações complexas que podem envolver múltiplas entidades. Cada serviço é responsável por um domínio específico (usuários, clientes, estoque, etc.) e expõe métodos que representam operações de negócio de alto nível.

Os serviços implementam validações de negócio mais complexas que vão além da simples validação de formato, incluindo verificações de consistência, regras de autorização específicas do domínio, e cálculos necessários para operações comerciais. Por exemplo, o serviço de vendas verifica disponibilidade de estoque antes de processar uma venda e atualiza automaticamente os saldos após confirmação da transação.

A camada de serviços também é responsável por coordenar operações que envolvem múltiplas entidades, como criação de pedidos que requer validação de cliente, verificação de estoque, cálculo de totais, e atualização de múltiplas tabelas de forma transacional. Esta coordenação é implementada de forma que garanta consistência de dados mesmo em cenários de falha.

### Camada de Acesso a Dados (Database)

A camada de acesso a dados abstrai as operações de banco de dados, fornecendo uma interface limpa para a camada de serviços. O sistema utiliza connection pooling para otimizar performance e gerenciar eficientemente conexões com o banco de dados. Todas as consultas utilizam prepared statements para prevenir ataques de SQL injection e melhorar performance através de cache de planos de execução.

O design da camada de dados prioriza transações quando necessário, especialmente para operações que modificam múltiplas tabelas. Isto é crucial para manter consistência em operações como processamento de vendas, onde estoque deve ser atualizado simultaneamente com registro da transação. O sistema implementa rollback automático em caso de falhas, garantindo que o banco permaneça em estado consistente.

A configuração de conexão utiliza variáveis de ambiente para credenciais e parâmetros de conexão, permitindo fácil configuração para diferentes ambientes (desenvolvimento, teste, produção) sem necessidade de alterações no código. O pool de conexões é configurado com limites apropriados para evitar sobrecarga do banco de dados em cenários de alta concorrência.

### Integração e Comunicação

O sistema implementa múltiplos canais de comunicação para atender diferentes necessidades operacionais. A API REST serve como interface principal para aplicações cliente, oferecendo endpoints bem documentados e seguindo convenções RESTful. WebSocket é utilizado para comunicação em tempo real, especialmente útil para notificações de status de pedidos e atualizações de estoque.

A integração com WhatsApp através do Venom Bot adiciona uma dimensão omnichannel ao sistema, permitindo que operações sejam iniciadas e monitoradas através de mensagens WhatsApp. Esta funcionalidade é particularmente valiosa para estabelecimentos que atendem clientes através de múltiplos canais e necessitam de comunicação unificada.

O sistema de monitoramento implementa verificações periódicas para garantir que serviços externos (como WhatsApp) estejam funcionando corretamente. Configurações são verificadas dinamicamente, permitindo ativação e desativação de funcionalidades sem necessidade de reinicialização do servidor.

## Configuração e Instalação

A configuração do CashHaven Server requer atenção cuidadosa a dependências, variáveis de ambiente, e configurações de banco de dados. O processo de instalação foi projetado para ser straightforward, mas requer conhecimento básico de Node.js e administração de banco de dados MySQL.

### Pré-requisitos do Sistema

O ambiente de execução requer Node.js versão 16 ou superior, preferencialmente a versão LTS mais recente para garantir estabilidade e suporte a longo prazo. O sistema foi desenvolvido e testado com Node.js 18.x, que oferece melhorias significativas de performance e novos recursos de linguagem que são utilizados no código.

MySQL 8.0 ou superior é necessário para o banco de dados, aproveitando recursos modernos como JSON data types, window functions, e melhorias de performance. O sistema requer privilégios para criação de tabelas, índices, e execução de stored procedures se necessário. Configurações específicas de charset (utf8mb4) são recomendadas para suporte completo a caracteres Unicode.

O ambiente de desenvolvimento deve incluir TypeScript instalado globalmente ou como dependência do projeto. Ferramentas de desenvolvimento como nodemon são incluídas nas dependências de desenvolvimento para facilitar o processo de desenvolvimento com hot reload. Um editor de código com suporte a TypeScript (como Visual Studio Code) é altamente recomendado para melhor experiência de desenvolvimento.

### Instalação de Dependências

O processo de instalação inicia com clonagem do repositório e instalação das dependências através do npm. O arquivo package.json define todas as dependências necessárias, incluindo bibliotecas de produção e ferramentas de desenvolvimento. É importante executar `npm install` em um ambiente com acesso à internet para download de todas as dependências.

```bash
git clone https://github.com/Dallas021/cashhaven.git
cd cashhaven/Server
npm install
```

As dependências principais incluem Express.js para o framework web, mysql2 para conectividade com banco de dados, bcrypt para hashing de senhas, jsonwebtoken para autenticação JWT, e cors para controle de acesso cross-origin. Dependências de desenvolvimento incluem TypeScript, ts-node para execução direta de código TypeScript, e nodemon para desenvolvimento com hot reload.

A instalação do Venom Bot pode requerer dependências adicionais do sistema, especialmente em ambientes Linux, onde bibliotecas para manipulação de imagens e automação de browser podem ser necessárias. Documentação específica do Venom Bot deve ser consultada para requisitos detalhados do sistema operacional.

### Configuração de Variáveis de Ambiente

O sistema utiliza variáveis de ambiente para configuração sensível e específica do ambiente. Um arquivo `.env` deve ser criado na raiz do projeto com as seguintes configurações essenciais:

```env
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
DB_HOST=192.168.10.16
DB_USER=acaiconxego
DB_PASSWORD=Acaiconxego@2025
DB_NAME=acaiconxegoPD
DB_PORT=51895
ALLOWED_ORIGINS=http://localhost:3000,https://app.cashhaven.com
PORT=5238
```

A chave JWT_SECRET deve ser uma string aleatória e segura, preferencialmente gerada através de ferramentas criptográficas. Esta chave é utilizada para assinar e verificar tokens JWT, sendo crucial para a segurança do sistema. Mudanças nesta chave invalidam todos os tokens existentes, requerendo novo login de todos os usuários.

As configurações de banco de dados devem refletir o ambiente específico onde o sistema será executado. Para desenvolvimento local, configurações padrão do MySQL podem ser utilizadas. Para produção, configurações devem incluir credenciais seguras e configurações de rede apropriadas. O parâmetro ALLOWED_ORIGINS controla quais domínios podem acessar a API, sendo crucial para segurança em produção.

### Configuração do Banco de Dados

O banco de dados MySQL deve ser configurado com charset utf8mb4 para suporte completo a caracteres Unicode. As tabelas necessárias devem ser criadas seguindo o schema definido no sistema. O usuário de banco de dados deve ter privilégios adequados para operações CRUD, criação de índices, e execução de transações.

Configurações de performance do MySQL devem ser ajustadas conforme o volume esperado de transações. Parâmetros como innodb_buffer_pool_size, max_connections, e query_cache_size devem ser configurados apropriadamente para o hardware disponível. Para ambientes de produção, configurações de backup automático e replicação devem ser consideradas.

O sistema implementa connection pooling para otimizar uso de conexões de banco de dados. Os parâmetros de pool (connectionLimit, queueLimit) podem ser ajustados conforme necessário para balancear performance e uso de recursos. Monitoramento de conexões ativas é recomendado para identificar possíveis vazamentos de conexão.

## Estrutura do Projeto

A organização do código fonte do CashHaven Server segue convenções estabelecidas para projetos Node.js/TypeScript, promovendo clareza, manutenibilidade, e escalabilidade. A estrutura de diretórios foi cuidadosamente planejada para separar responsabilidades e facilitar navegação no código.

### Diretório Raiz

O diretório raiz contém arquivos de configuração essenciais para o projeto. O `package.json` define metadados do projeto, dependências, e scripts de build e execução. O `tsconfig.json` configura o compilador TypeScript com opções específicas para o projeto, incluindo target ES2020, module resolution, e configurações de strict type checking.

O arquivo `.env` (não versionado) contém variáveis de ambiente sensíveis como credenciais de banco de dados e chaves de criptografia. Um arquivo `.env.example` deve ser mantido no repositório como template para configuração em novos ambientes. O diretório `dist/` contém código JavaScript compilado a partir do TypeScript, gerado automaticamente durante o processo de build.

Scripts npm definidos no package.json facilitam operações comuns de desenvolvimento e deploy. O script `build` compila TypeScript para JavaScript, enquanto `prod` executa a versão compilada. Para desenvolvimento, ferramentas como nodemon podem ser configuradas para recompilação automática quando arquivos são modificados.

### Diretório src/

O diretório `src/` contém todo o código fonte TypeScript da aplicação, organizado em subdiretórios por responsabilidade funcional. Esta organização facilita localização de código específico e promove separação clara de responsabilidades entre diferentes camadas da aplicação.

#### config/

O diretório `config/` contém arquivos de configuração da aplicação, incluindo middleware de autenticação, configurações de segurança, e outros parâmetros globais. O arquivo `authMiddleware.ts` implementa verificação de tokens JWT para rotas protegidas, garantindo que apenas usuários autenticados possam acessar recursos sensíveis.

Configurações de CORS, rate limiting, e outras políticas de segurança são centralizadas neste diretório, facilitando manutenção e auditoria de configurações de segurança. Parâmetros específicos do ambiente podem ser externalizados para variáveis de ambiente, permitindo configuração flexível sem alterações de código.

#### database/

O diretório `database/` contém configurações de conexão com banco de dados e utilitários relacionados. O arquivo `connection.ts` estabelece pool de conexões MySQL com configurações otimizadas para performance e confiabilidade. Connection pooling é essencial para aplicações que fazem múltiplas consultas simultâneas ao banco de dados.

Configurações de timeout, retry logic, e tratamento de erros de conexão são implementadas para garantir robustez em ambientes de produção. O sistema monitora saúde das conexões e implementa reconexão automática em caso de falhas temporárias de rede ou banco de dados.

#### routes/

O diretório `routes/` organiza endpoints da API por domínio funcional. Cada arquivo de rota é responsável por um conjunto específico de operações relacionadas, como `user.routes.ts` para operações de usuário, `stock.routes.ts` para controle de estoque, etc. Esta organização facilita manutenção e permite desenvolvimento paralelo de diferentes funcionalidades.

O arquivo `allRoutes.ts` serve como ponto central de integração, combinando todas as rotas individuais em um router principal que é utilizado pela aplicação Express. Middleware de autenticação é aplicado globalmente, com exceções específicas para rotas públicas como login e registro.

Cada arquivo de rota implementa validação de parâmetros de entrada, tratamento de erros, e formatação consistente de respostas. Códigos de status HTTP apropriados são utilizados para indicar sucesso, erro de cliente, ou erro de servidor, facilitando integração com aplicações cliente.

#### service/

O diretório `service/` contém a lógica de negócio da aplicação, implementada como classes ou módulos que encapsulam operações específicas do domínio. Cada serviço é responsável por validações de negócio, coordenação de operações complexas, e interface com a camada de dados.

Serviços implementam transações quando necessário para garantir consistência de dados. Por exemplo, o serviço de vendas coordena atualização de estoque, registro de transação, e notificações em uma única operação transacional. Rollback automático é implementado em caso de falhas para manter integridade dos dados.

A separação entre rotas e serviços permite reutilização de lógica de negócio em diferentes contextos, como APIs REST, WebSocket handlers, ou jobs em background. Esta arquitetura também facilita testes unitários, permitindo teste isolado da lógica de negócio sem dependências de framework web.

#### utils/

O diretório `utils/` contém utilitários e funções auxiliares utilizadas em diferentes partes da aplicação. Isto inclui helpers para formatação de dados, validações comuns, e integrações com serviços externos como WhatsApp.

Utilitários são implementados como funções puras quando possível, facilitando testes e reutilização. Configurações específicas de integrações externas são centralizadas neste diretório, permitindo fácil manutenção e atualização quando APIs externas mudam.

#### websocket/

O diretório `websocket/` implementa funcionalidade de comunicação em tempo real utilizando WebSocket. Isto permite notificações push para clientes conectados, atualizações de status em tempo real, e comunicação bidirecional entre servidor e cliente.

A implementação WebSocket é integrada com o servidor Express principal, compartilhando configurações de autenticação e acesso a serviços de negócio. Handlers específicos são implementados para diferentes tipos de mensagens, permitindo funcionalidade rica de comunicação em tempo real.

## Sistema de Autenticação

O sistema de autenticação do CashHaven Server implementa um modelo robusto baseado em JSON Web Tokens (JWT), proporcionando segurança adequada para aplicações comerciais enquanto mantém simplicidade de implementação e integração. O design prioriza tanto segurança quanto usabilidade, oferecendo experiência fluida para usuários legítimos enquanto protege contra acessos não autorizados.

### Arquitetura de Autenticação

A autenticação é implementada através de um fluxo padrão onde usuários fornecem credenciais (nome de usuário e senha) que são verificadas contra dados armazenados no banco de dados. Senhas são armazenadas utilizando hashing bcrypt com salt automático, garantindo que mesmo em caso de comprometimento do banco de dados, senhas originais permaneçam protegidas.

Após verificação bem-sucedida das credenciais, o sistema gera um token JWT contendo informações essenciais do usuário como ID, nome de usuário, e metadados de sessão. O token é assinado utilizando uma chave secreta configurada através de variáveis de ambiente, garantindo que tokens não possam ser falsificados sem acesso à chave privada.

O token JWT tem validade de 12 horas, balanceando segurança com conveniência do usuário. Tokens expirados requerem novo login, mas a duração é suficiente para uma jornada de trabalho típica sem interrupções desnecessárias. O sistema não implementa refresh tokens na versão atual, optando por simplicidade, mas esta funcionalidade pode ser adicionada conforme necessário.

### Processo de Login

O endpoint de login (`/api/auth/login`) recebe credenciais através de requisição POST com payload JSON contendo nome de usuário e senha. O sistema primeiro valida formato e presença dos campos obrigatórios antes de prosseguir com verificação no banco de dados.

A consulta ao banco de dados utiliza prepared statements para prevenir ataques de SQL injection. O sistema busca usuário pelo nome de usuário fornecido e, se encontrado, compara a senha fornecida com o hash armazenado utilizando bcrypt.compare(). Esta função é resistente a ataques de timing, mantendo tempo de execução consistente independentemente da senha fornecida.

Em caso de sucesso, o sistema gera token JWT incluindo payload com informações do usuário e timestamp de expiração. A resposta inclui o token, data de expiração, e informações básicas do usuário como nome e cargo. Estas informações permitem que aplicações cliente configurem interface apropriada para o nível de acesso do usuário.

Falhas de autenticação retornam mensagens genéricas para prevenir enumeração de usuários válidos. Tanto usuários inexistentes quanto senhas incorretas resultam em mensagens similares, dificultando ataques de força bruta direcionados.

### Processo de Registro

O endpoint de registro (`/api/auth/register`) permite criação de novos usuários no sistema. Este endpoint tipicamente requer autenticação de usuário administrativo, embora a implementação atual não enforce esta restrição explicitamente. Em ambientes de produção, controle de acesso adicional deve ser implementado.

O processo de registro valida unicidade do nome de usuário antes de criar novo registro. Senhas são automaticamente hasheadas utilizando bcrypt com salt factor de 10, proporcionando boa segurança contra ataques de rainbow table enquanto mantém performance aceitável para operações de login.

Novos usuários são criados com nível de acesso padrão (não administrativo) a menos que explicitamente especificado. O campo `adm` controla privilégios administrativos, permitindo diferenciação entre usuários operacionais e administrativos. Cargos são armazenados como texto livre, permitindo flexibilidade organizacional.

### Middleware de Autenticação

O middleware de autenticação (`authenticateToken`) é aplicado globalmente a todas as rotas exceto aquelas sob `/auth`. Este middleware intercepta requisições, extrai token JWT do header Authorization, e verifica sua validade antes de permitir acesso ao endpoint solicitado.

O token deve ser fornecido no formato "Bearer <token>" no header Authorization. O middleware extrai o token, verifica sua assinatura utilizando a chave secreta, e valida timestamp de expiração. Tokens válidos resultam em adição de informações do usuário ao objeto request, disponibilizando-as para handlers subsequentes.

Falhas de autenticação resultam em respostas HTTP 401 (Unauthorized) para tokens ausentes ou 403 (Forbidden) para tokens inválidos ou expirados. Mensagens de erro são padronizadas para facilitar tratamento por aplicações cliente.

### Níveis de Acesso

O sistema implementa dois níveis básicos de acesso: usuários regulares e administradores. O campo `adm` no banco de dados determina privilégios administrativos, com valor 1 indicando administrador e 0 indicando usuário regular.

Usuários administrativos têm acesso completo a todas as funcionalidades do sistema, incluindo gerenciamento de usuários, configurações globais, e operações sensíveis. Usuários regulares têm acesso limitado a funcionalidades operacionais como vendas, consulta de estoque, e gerenciamento de clientes.

A verificação de privilégios é implementada na camada de serviços, onde operações sensíveis verificam nível de acesso do usuário antes de prosseguir. Esta abordagem garante que controle de acesso seja enforçado independentemente do ponto de entrada (API REST, WebSocket, etc.).

### Segurança de Senhas

O sistema utiliza bcrypt para hashing de senhas, uma biblioteca especificamente projetada para este propósito e resistente a ataques de força bruta. O salt factor de 10 proporciona boa segurança enquanto mantém performance aceitável para operações de login frequentes.

Senhas são hasheadas no momento do registro e nunca armazenadas em texto plano. O sistema não implementa recuperação de senha na versão atual, requerendo intervenção administrativa para reset de senhas esquecidas. Esta funcionalidade pode ser adicionada implementando tokens temporários e notificação por email.

Políticas de senha (comprimento mínimo, complexidade) não são enforçadas pelo sistema atual, mas podem ser facilmente adicionadas na camada de validação. Para ambientes de produção, implementação de políticas de senha robustas é recomendada.

## Módulos e Funcionalidades

O CashHaven Server é estruturado em módulos funcionais distintos, cada um responsável por um aspecto específico das operações comerciais. Esta arquitetura modular facilita manutenção, permite desenvolvimento paralelo de funcionalidades, e oferece flexibilidade para customizações específicas do cliente.

### Módulo de Usuários

O módulo de usuários gerencia todo o ciclo de vida de contas de usuário no sistema, desde criação até exclusão, incluindo atualizações de perfil e gerenciamento de permissões. Este módulo é fundamental para operação segura do sistema, garantindo que apenas usuários autorizados tenham acesso a funcionalidades específicas.

A funcionalidade de listagem de usuários (`/api/user/all`) retorna informações completas de todos os usuários cadastrados, incluindo nome, cargo, e nível de acesso. Esta informação é essencial para administradores que precisam gerenciar equipes e atribuir responsabilidades específicas. O endpoint implementa paginação implícita através de limitações de banco de dados para evitar sobrecarga em sistemas com muitos usuários.

A exclusão de usuários (`/api/user/del/{uid}`) é uma operação irreversível que remove completamente um usuário do sistema. Esta funcionalidade deve ser utilizada com cuidado, especialmente em sistemas onde usuários estão associados a transações históricas. O sistema não implementa soft delete na versão atual, mas esta funcionalidade pode ser adicionada para manter integridade referencial.

A atualização de usuários (`/api/user/update`) permite modificação de informações como nome, cargo, nível administrativo, senha, e nome de usuário. Mudanças de senha resultam em novo hash bcrypt, invalidando efetivamente sessões existentes do usuário. Alterações de nível administrativo têm efeito imediato, podendo conceder ou revogar acesso a funcionalidades sensíveis.

### Módulo de Clientes

O módulo de clientes implementa um sistema CRM simplificado mas eficiente, permitindo gerenciamento completo de informações de clientes e histórico de relacionamento. Este módulo é crucial para estabelecimentos que valorizam relacionamento com cliente e necessitam de comunicação personalizada.

A listagem de clientes (`/api/client/all`) fornece visão completa da base de clientes, incluindo informações de contato e identificação. Esta funcionalidade é essencial para operações de marketing, análise de base de clientes, e operações de vendas que requerem seleção de cliente específico.

A busca de clientes pode ser realizada por CPF (`/api/client/serach`) ou por ID (`/api/client/serachuid`), oferecendo flexibilidade para diferentes fluxos operacionais. Busca por CPF é particularmente útil durante processo de venda, onde operadores podem rapidamente localizar clientes existentes. Busca por ID é utilizada principalmente por sistemas integrados que mantêm referências internas.

O cadastro de novos clientes (`/api/client/create`) requer informações básicas como CPF, nome, e telefone. O sistema valida unicidade de CPF para prevenir duplicatas, mas permite flexibilidade em formatação para acomodar diferentes padrões de entrada. Informações de telefone são essenciais para integração com WhatsApp e outras funcionalidades de comunicação.

A atualização de clientes (`/api/client/update`) permite modificação de todas as informações cadastrais. Esta funcionalidade é importante para manter dados atualizados, especialmente informações de contato que são críticas para comunicação efetiva. O sistema mantém histórico de alterações implicitamente através de timestamps de última modificação.

A exclusão de clientes (`/api/client/delete/{id}`) remove completamente um cliente do sistema. Esta operação deve ser utilizada com cuidado em sistemas onde clientes estão associados a histórico de vendas ou pedidos. Implementação de soft delete pode ser considerada para manter integridade referencial enquanto permite "remoção" lógica.

### Módulo de Estoque

O módulo de estoque é o coração operacional do sistema, gerenciando produtos, preços, quantidades, e fornecedores. Este módulo implementa controles rigorosos para garantir precisão de dados e prevenir inconsistências que poderiam resultar em perdas financeiras ou operacionais.

A listagem de produtos (`/api/stock/all`) fornece visão completa do inventário, incluindo preços de compra e venda, saldos atuais, e informações de fornecedores. Esta informação é essencial para operações diárias, planejamento de compras, e análise de rentabilidade. O sistema calcula automaticamente margens de lucro e identifica produtos com baixo estoque.

O cadastro de novos produtos (`/api/stock/insert`) requer informações completas incluindo nome, preços de compra e venda, saldo inicial, e fornecedor. O sistema valida que preços sejam positivos e que saldo inicial seja não-negativo. Informações de fornecedor são importantes para rastreabilidade e planejamento de reposição.

A atualização de saldo (`/api/stock/update/sd`) é uma operação crítica que modifica quantidades em estoque. Esta funcionalidade é utilizada para entrada de mercadorias, ajustes de inventário, e correções. O sistema mantém histórico de movimentações para auditoria e análise de tendências. Validações garantem que saldos não se tornem negativos inadvertidamente.

A modificação de produtos (`/api/stock/update/product`) permite atualização de nome e preço de venda, funcionalidades essenciais para ajustes de mercado e correções de cadastro. Alterações de preço têm efeito imediato em novas vendas, mas não afetam transações já processadas. O sistema pode implementar histórico de preços para análise de tendências.

A busca de produtos pode ser realizada por ID (`/api/stock/serach/id`) ou por nome (`/api/stock/serach/name`), oferecendo flexibilidade para diferentes cenários operacionais. Busca por nome implementa matching parcial, permitindo localização rápida de produtos mesmo com informações incompletas. Esta funcionalidade é essencial para operações de venda onde velocidade é crucial.

### Módulo de Vendas

O módulo de vendas processa transações individuais, atualizando estoque e registrando informações financeiras. Este módulo implementa controles rigorosos para garantir consistência entre vendas registradas e movimentações de estoque.

O processamento de vendas (`/api/sale/forsale`) é uma operação transacional que verifica disponibilidade de estoque, registra a venda, e atualiza saldos automaticamente. O sistema implementa verificações para prevenir vendas de produtos sem estoque suficiente, garantindo que operações sejam sempre válidas.

A funcionalidade registra timestamps de início e fim da venda, permitindo análise de performance operacional e identificação de gargalos no processo de vendas. Estas informações são valiosas para otimização de processos e treinamento de equipe.

### Módulo de Pedidos

O módulo de pedidos gerencia transações mais complexas que podem incluir múltiplos itens, informações de cliente, e integração com sistemas de nota fiscal eletrônica. Este módulo é essencial para operações que requerem rastreamento detalhado de transações e compliance fiscal.

A geração de números de pedido (`/api/order/new`) fornece sequência única para identificação de pedidos. Esta funcionalidade garante que cada pedido tenha identificador único, facilitando rastreamento e referência em comunicações com clientes.

A criação de pedidos (`/api/order/create`) é uma operação complexa que coordena múltiplas validações e atualizações. O sistema verifica disponibilidade de todos os itens, calcula totais, e registra informações completas do pedido. Operações são realizadas transacionalmente para garantir consistência.

A integração com NFC-e (`/api/order/panel`) permite atualização de status de pedidos com informações fiscais. Esta funcionalidade é crucial para compliance fiscal e rastreamento completo do ciclo de vida de pedidos. O sistema armazena informações como número da nota, chave de acesso, e status de autorização.

### Módulo de Parâmetros

O módulo de parâmetros gerencia configurações globais do sistema, incluindo configurações de integração WhatsApp, parâmetros operacionais, e preferências de sistema. Este módulo permite customização do comportamento do sistema sem necessidade de alterações de código.

Configurações são armazenadas no banco de dados e podem ser modificadas através de interface administrativa. O sistema monitora mudanças em configurações críticas e aplica alterações dinamicamente quando possível. Algumas configurações podem requerer reinicialização de serviços específicos.

### Módulo de Relatórios

O módulo de relatórios gera análises e resumos de dados operacionais, fornecendo insights valiosos para tomada de decisões gerenciais. Relatórios incluem análises de vendas, performance de produtos, e métricas operacionais.

O sistema implementa geração de relatórios sob demanda, permitindo análises customizadas para períodos específicos. Relatórios podem ser exportados em diferentes formatos para facilitar compartilhamento e análise externa.

### Módulo de Integração WhatsApp

O módulo de integração WhatsApp utiliza Venom Bot para automação de comunicações, permitindo notificações automáticas, confirmações de pedidos, e suporte ao cliente. Esta funcionalidade diferencia o sistema no mercado, oferecendo canal de comunicação moderno e eficiente.

A integração monitora configurações no banco de dados para ativação/desativação dinâmica do serviço WhatsApp. Isto permite controle granular sobre quando e como a funcionalidade é utilizada, importante para gerenciamento de custos e compliance com políticas de comunicação.

## API Endpoints

A API do CashHaven Server segue princípios RESTful, oferecendo interface consistente e intuitiva para integração com aplicações cliente. Todos os endpoints retornam dados em formato JSON e implementam códigos de status HTTP apropriados para indicar resultado das operações.

### Endpoints de Autenticação

#### POST /api/auth/login

O endpoint de login é o ponto de entrada principal para autenticação no sistema. Aceita credenciais de usuário e retorna token JWT para acesso a recursos protegidos.

**Parâmetros de Entrada:**
```json
{
  "usuario": "string",
  "senha": "string"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2024-01-16T10:30:00Z",
  "nome": "ADMINISTRADOR",
  "id": 1,
  "cargo": "Administrador"
}
```

**Resposta de Erro (500):**
```json
{
  "success": false,
  "errors": ["Usuário não encontrado"]
}
```

O endpoint implementa validação rigorosa de credenciais, utilizando bcrypt para verificação segura de senhas. Tokens gerados têm validade de 12 horas e incluem informações essenciais do usuário para personalização de interface cliente.

#### POST /api/auth/register

O endpoint de registro permite criação de novos usuários no sistema. Requer informações completas do usuário e gera automaticamente hash seguro da senha.

**Parâmetros de Entrada:**
```json
{
  "nome": "string",
  "nome_usuario": "string", 
  "senha": "string",
  "cargo": "string",
  "adm": 0
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso"
}
```

O sistema valida unicidade do nome de usuário e aplica hashing bcrypt automaticamente à senha fornecida. Usuários são criados com privilégios não-administrativos por padrão, requerendo elevação posterior se necessário.

### Endpoints de Usuários

#### GET /api/user/all

Retorna lista completa de usuários cadastrados no sistema, incluindo informações de perfil e nível de acesso.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Administrador",
      "usuario": "admin",
      "cargo": "Administrador",
      "adm": 1
    }
  ]
}
```

Este endpoint é essencial para interfaces administrativas que necessitam exibir informações de equipe e gerenciar permissões de usuário.

#### DELETE /api/user/del/{uid}

Remove usuário específico do sistema utilizando ID como identificador. Esta é uma operação irreversível que deve ser utilizada com cuidado.

**Parâmetros de URL:**
- `uid`: ID numérico do usuário a ser removido

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Usuário removido com sucesso"
}
```

#### PUT /api/user/update

Atualiza informações de usuário existente, incluindo dados de perfil, credenciais, e nível de acesso.

**Parâmetros de Entrada:**
```json
{
  "id": 1,
  "nome": "string",
  "cargo": "string", 
  "adm": 0,
  "senha": "string",
  "user": "string"
}
```

Alterações de senha resultam em novo hash bcrypt, enquanto mudanças de nível administrativo têm efeito imediato nas permissões do usuário.

### Endpoints de Clientes

#### GET /api/client/all

Retorna lista completa de clientes cadastrados, incluindo informações de contato e identificação.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Maria Santos",
      "cpf": "123.456.789-00",
      "telefone": "(11) 99999-9999"
    }
  ]
}
```

#### GET /api/client/serach

Busca cliente específico utilizando CPF como parâmetro de pesquisa.

**Parâmetros de Query:**
- `cpf`: CPF do cliente a ser localizado

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Maria Santos", 
    "cpf": "123.456.789-00",
    "telefone": "(11) 99999-9999"
  }
}
```

#### POST /api/client/create

Cadastra novo cliente no sistema com informações básicas de identificação e contato.

**Parâmetros de Entrada:**
```json
{
  "cpf": "123.456.789-00",
  "name": "Maria Santos",
  "tel": "(11) 99999-9999"
}
```

O sistema valida unicidade de CPF para prevenir cadastros duplicados e mantém informações de contato atualizadas para comunicação efetiva.

### Endpoints de Estoque

#### GET /api/stock/all

Retorna inventário completo com informações de produtos, preços, e saldos atuais.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "produto": "Açaí 500ml",
      "compra": 5.50,
      "venda": 12.00,
      "saldo": 100,
      "fornecedor": "Fornecedor ABC"
    }
  ]
}
```

#### POST /api/stock/insert

Adiciona novo produto ao estoque com informações completas de preços e fornecedor.

**Parâmetros de Entrada:**
```json
{
  "produto": "Açaí 500ml",
  "compra": 5.50,
  "venda": 12.00,
  "saldo": 100,
  "fornecedor": "Fornecedor ABC"
}
```

#### GET /api/stock/serach/name

Busca produtos por nome utilizando matching parcial para facilitar localização rápida.

**Parâmetros de Query:**
- `nome`: Nome ou parte do nome do produto

Esta funcionalidade é essencial para operações de venda onde velocidade de localização de produtos é crucial para eficiência operacional.

### Endpoints de Vendas e Pedidos

#### POST /api/sale/forsale

Processa venda individual, atualizando estoque e registrando transação.

**Parâmetros de Entrada:**
```json
{
  "id": 1,
  "venda": 12.00,
  "inicio": "2024-01-15T10:00:00Z",
  "fim": "2024-01-15T10:05:00Z"
}
```

#### POST /api/order/create

Cria pedido complexo com múltiplos itens e informações detalhadas de cliente.

**Parâmetros de Entrada:**
```json
{
  "cliente_id": 1,
  "items": [
    {
      "produto_id": 1,
      "quantidade": 2,
      "preco_unitario": 12.00
    }
  ],
  "total": 24.00,
  "observacoes": "Sem açúcar"
}
```

O sistema coordena múltiplas validações e atualizações transacionalmente para garantir consistência de dados.

## Integração WhatsApp

A integração com WhatsApp representa uma das funcionalidades mais inovadoras do CashHaven Server, utilizando a biblioteca Venom Bot para automação de comunicações e criação de experiências omnichannel. Esta funcionalidade permite que estabelecimentos comerciais mantenham comunicação direta e personalizada com clientes através da plataforma de mensagens mais popular do Brasil.

### Arquitetura da Integração

A integração WhatsApp é implementada como um serviço independente que roda em paralelo com a API principal, mas compartilha acesso ao banco de dados e configurações do sistema. O Venom Bot atua como interface entre o sistema e a API não-oficial do WhatsApp Web, permitindo envio e recebimento de mensagens de forma programática.

O sistema implementa monitoramento contínuo de configurações no banco de dados para determinar quando o serviço WhatsApp deve estar ativo. A função `monitorWhatsappServer()` executa a cada 10 segundos, verificando o valor do parâmetro `bit` na tabela de configurações. Quando este valor é 1, o sistema inicia o Venom Bot; quando é 0, o serviço é interrompido graciosamente.

Esta abordagem permite controle dinâmico da funcionalidade WhatsApp sem necessidade de reinicialização do servidor principal. Administradores podem ativar ou desativar a integração através de interface administrativa, proporcionando flexibilidade operacional importante para gerenciamento de custos e compliance com políticas de comunicação.

### Configuração e Inicialização

A inicialização do Venom Bot requer configuração cuidadosa para garantir estabilidade e confiabilidade da conexão. O sistema utiliza configurações otimizadas para ambientes de produção, incluindo timeouts apropriados, retry logic, e tratamento de erros específicos da plataforma WhatsApp.

O processo de inicialização inclui autenticação através de QR code, que deve ser escaneado utilizando o aplicativo WhatsApp do dispositivo autorizado. Uma vez autenticado, o sistema mantém sessão ativa e implementa reconexão automática em caso de desconexões temporárias.

Configurações de sessão são persistidas localmente para evitar necessidade de reautenticação frequente. O sistema implementa limpeza automática de sessões antigas e gerenciamento de múltiplas instâncias para prevenir conflitos de conexão.

### Funcionalidades de Comunicação

A integração permite envio de diferentes tipos de mensagens, incluindo texto simples, mensagens formatadas, imagens, e documentos. O sistema implementa queue de mensagens para garantir entrega ordenada e evitar limitações de rate limiting impostas pelo WhatsApp.

Funcionalidades de recebimento de mensagens permitem implementação de chatbots simples e processamento automático de comandos específicos. O sistema pode responder automaticamente a mensagens recebidas, confirmar pedidos, fornecer informações de status, e escalar conversas para atendimento humano quando necessário.

A integração mantém histórico de conversas e implementa logging detalhado para auditoria e análise de performance. Métricas como taxa de entrega, tempo de resposta, e volume de mensagens são coletadas para otimização contínua do serviço.

### Casos de Uso Operacionais

A integração WhatsApp suporta diversos casos de uso que agregam valor significativo às operações comerciais. Notificações automáticas de pedidos permitem que clientes recebam confirmações imediatas quando pedidos são processados, incluindo informações detalhadas como itens, valores, e tempo estimado de entrega.

Campanhas de marketing direcionadas podem ser implementadas utilizando informações de clientes armazenadas no sistema. O sistema pode segmentar clientes por histórico de compras, preferências, ou localização geográfica, enviando ofertas personalizadas que aumentam taxa de conversão.

Suporte ao cliente pode ser parcialmente automatizado através de respostas automáticas para perguntas frequentes, consulta de status de pedidos, e escalação para atendimento humano quando necessário. Esta funcionalidade reduz carga de trabalho da equipe de atendimento enquanto melhora experiência do cliente.

### Monitoramento e Manutenção

O sistema implementa monitoramento abrangente da integração WhatsApp, incluindo verificação de conectividade, status de sessão, e performance de entrega de mensagens. Alertas automáticos são gerados quando problemas são detectados, permitindo intervenção rápida para minimizar impacto operacional.

Logs detalhados registram todas as interações, incluindo mensagens enviadas e recebidas, erros de conexão, e eventos de sistema. Estas informações são essenciais para troubleshooting e otimização contínua da integração.

Manutenção preventiva inclui limpeza periódica de sessões antigas, atualização de configurações conforme mudanças na API do WhatsApp, e backup de dados críticos de conversas. O sistema implementa graceful shutdown para preservar estado de sessão durante manutenções programadas.

### Considerações de Segurança e Compliance

A integração WhatsApp implementa medidas de segurança apropriadas para proteger dados de clientes e garantir compliance com regulamentações de privacidade. Mensagens são transmitidas através de canais criptografados fornecidos pelo próprio WhatsApp, garantindo confidencialidade em trânsito.

Dados de conversas são armazenados com criptografia adequada e acesso controlado através do sistema de autenticação principal. Políticas de retenção de dados são implementadas para garantir que informações sensíveis não sejam mantidas além do período necessário.

O sistema implementa rate limiting e controles de spam para prevenir uso abusivo da funcionalidade de envio de mensagens. Estas medidas protegem tanto o sistema quanto a reputação do estabelecimento comercial junto ao WhatsApp.

## WebSocket

A implementação WebSocket no CashHaven Server proporciona capacidades de comunicação em tempo real essenciais para operações comerciais modernas. Esta funcionalidade permite atualizações instantâneas de status, notificações push, e sincronização de dados entre múltiplos clientes conectados simultaneamente.

### Arquitetura WebSocket

O servidor WebSocket é integrado diretamente com o servidor HTTP Express, compartilhando a mesma porta e configurações de rede. Esta abordagem simplifica deployment e configuração de firewall, enquanto permite reutilização de middleware de autenticação e acesso a serviços de negócio existentes.

A implementação utiliza a biblioteca `ws` para Node.js, que oferece performance excelente e compatibilidade ampla com diferentes navegadores e plataformas. O servidor mantém lista de conexões ativas e implementa heartbeat para detectar conexões perdidas automaticamente.

Cada conexão WebSocket é associada a um usuário autenticado através de token JWT fornecido durante handshake inicial. Esta abordagem garante que apenas usuários autorizados recebam notificações e possam interagir com funcionalidades em tempo real.

### Funcionalidades em Tempo Real

O sistema WebSocket suporta diversos tipos de eventos em tempo real que melhoram significativamente a experiência operacional. Atualizações de estoque são propagadas instantaneamente para todos os clientes conectados, garantindo que informações de disponibilidade estejam sempre atualizadas em interfaces de venda.

Notificações de novos pedidos permitem que equipes de produção e atendimento sejam alertadas imediatamente quando pedidos são criados, reduzindo tempo de resposta e melhorando satisfação do cliente. Status de pedidos é atualizado em tempo real, permitindo acompanhamento preciso do progresso de produção e entrega.

Alertas de sistema, como baixo estoque, falhas de integração, ou eventos de segurança, são transmitidos instantaneamente para usuários administrativos, permitindo resposta rápida a situações que requerem atenção imediata.

### Gerenciamento de Conexões

O sistema implementa gerenciamento robusto de conexões WebSocket, incluindo autenticação inicial, heartbeat para detecção de conexões perdidas, e cleanup automático de recursos. Conexões são organizadas por usuário e tipo de cliente, permitindo targeting preciso de mensagens.

Reconexão automática é implementada no lado cliente para garantir que interrupções temporárias de rede não resultem em perda de funcionalidade. O sistema mantém buffer de mensagens para garantir que atualizações importantes não sejam perdidas durante reconexões.

Rate limiting é aplicado para prevenir abuse e garantir que recursos de servidor sejam utilizados eficientemente. Conexões que excedem limites de mensagens são automaticamente desconectadas com logging apropriado para análise posterior.

### Integração com Módulos de Negócio

A funcionalidade WebSocket é integrada com todos os módulos principais do sistema, permitindo notificações em tempo real para eventos relevantes. O módulo de vendas emite eventos quando transações são processadas, permitindo atualização imediata de dashboards e relatórios.

O módulo de estoque utiliza WebSocket para propagar mudanças de saldo instantaneamente, garantindo que múltiplos operadores tenham visão consistente de disponibilidade de produtos. Esta funcionalidade é crucial para prevenir overselling em ambientes com múltiplos pontos de venda.

Integrações externas, como WhatsApp e sistemas de nota fiscal, utilizam WebSocket para comunicar status de operações assíncronas, permitindo que usuários acompanhem progresso de operações complexas sem necessidade de polling constante.

## Banco de Dados

O sistema de banco de dados do CashHaven Server utiliza MySQL como sistema de gerenciamento de banco de dados relacional, aproveitando recursos avançados para garantir performance, confiabilidade, e integridade de dados essenciais para operações comerciais críticas.

### Arquitetura de Dados

O design do banco de dados segue princípios de normalização apropriados para balancear integridade de dados com performance operacional. Tabelas principais incluem usuários, clientes, produtos, vendas, e pedidos, cada uma com relacionamentos bem definidos e constraints de integridade referencial.

A tabela de usuários armazena credenciais e informações de perfil, incluindo hashes bcrypt de senhas e níveis de acesso. Índices são criados em campos frequentemente consultados como nome de usuário e email para otimizar performance de autenticação.

A tabela de clientes mantém informações de contato e identificação, com índices em CPF e telefone para facilitar buscas rápidas durante operações de venda. Relacionamentos com tabelas de vendas e pedidos permitem rastreamento completo de histórico de relacionamento.

### Configuração de Conexão

O sistema utiliza connection pooling através da biblioteca mysql2 para otimizar uso de recursos e garantir performance adequada sob carga. O pool é configurado com limites apropriados para balancear performance com uso de memória e recursos de rede.

Configurações de timeout são ajustadas para ambientes de produção, incluindo connection timeout, query timeout, e idle timeout. Estas configurações garantem que conexões não sejam mantidas desnecessariamente e que operações não fiquem pendentes indefinidamente.

O sistema implementa retry logic para operações críticas, incluindo reconexão automática em caso de falhas temporárias de rede ou banco de dados. Logging detalhado registra eventos de conexão para facilitar troubleshooting e monitoramento de performance.

### Transações e Integridade

Operações críticas como processamento de vendas e criação de pedidos são implementadas utilizando transações para garantir consistência de dados. O sistema utiliza isolation levels apropriados para balancear consistência com performance, evitando deadlocks desnecessários.

Constraints de integridade referencial são implementadas no nível de banco de dados para garantir que relacionamentos entre entidades sejam mantidos corretamente. Foreign keys são utilizadas para prevenir criação de registros órfãos e garantir que exclusões sejam propagadas apropriadamente.

O sistema implementa validações tanto no nível de aplicação quanto no nível de banco de dados, proporcionando múltiplas camadas de proteção contra corrupção de dados. Triggers podem ser utilizados para implementar regras de negócio complexas que devem ser enforçadas independentemente do ponto de acesso aos dados.

### Performance e Otimização

Índices são criados estrategicamente em campos frequentemente utilizados em consultas e joins, balanceando performance de leitura com overhead de escrita. Índices compostos são utilizados para consultas que filtram por múltiplos campos simultaneamente.

Query optimization é implementada através de análise de planos de execução e ajuste de consultas para utilizar índices eficientemente. Consultas complexas são otimizadas para minimizar operações de join e utilizar recursos de cache do MySQL quando apropriado.

O sistema implementa monitoramento de performance de consultas, identificando automaticamente consultas lentas que podem requerer otimização. Logs de slow query são analisados regularmente para identificar oportunidades de melhoria.

### Backup e Recuperação

Estratégias de backup incluem backups completos regulares e backups incrementais para minimizar perda de dados em caso de falhas. Backups são testados regularmente para garantir que procedimentos de recuperação funcionem corretamente quando necessário.

O sistema implementa point-in-time recovery utilizando binary logs do MySQL, permitindo recuperação precisa para momentos específicos em caso de corrupção de dados ou erros operacionais. Procedimentos de recuperação são documentados e testados regularmente.

Replicação pode ser implementada para ambientes de alta disponibilidade, proporcionando failover automático e distribuição de carga de leitura. Configurações de replicação são monitoradas para garantir sincronização adequada entre servidores.

## Segurança

A segurança do CashHaven Server é implementada através de múltiplas camadas de proteção, abrangendo autenticação, autorização, proteção de dados, e monitoramento de atividades suspeitas. Esta abordagem em profundidade garante que dados comerciais sensíveis sejam adequadamente protegidos contra ameaças internas e externas.

### Autenticação e Autorização

O sistema de autenticação utiliza tokens JWT com assinatura criptográfica para garantir que credenciais não possam ser falsificadas. Tokens incluem timestamp de expiração para limitar janela de exposição em caso de comprometimento. A chave de assinatura é armazenada como variável de ambiente e deve ser mantida secreta.

Senhas são armazenadas utilizando hashing bcrypt com salt automático, garantindo que mesmo em caso de comprometimento do banco de dados, senhas originais permaneçam protegidas. O salt factor é configurado para balancear segurança com performance, proporcionando proteção adequada contra ataques de força bruta.

Autorização é implementada através de verificação de nível de acesso em operações sensíveis. O sistema diferencia entre usuários regulares e administrativos, aplicando controles de acesso apropriados para cada tipo de operação. Middleware de autenticação é aplicado globalmente para garantir que apenas usuários autenticados possam acessar recursos protegidos.

### Proteção de Dados

Dados sensíveis são protegidos através de múltiplas camadas de segurança, incluindo criptografia em trânsito e em repouso. Comunicações HTTP utilizam HTTPS em produção para garantir confidencialidade e integridade de dados transmitidos entre cliente e servidor.

O sistema implementa validação rigorosa de entrada para prevenir ataques de injection, incluindo SQL injection, XSS, e command injection. Prepared statements são utilizados para todas as consultas de banco de dados, eliminando possibilidade de SQL injection através de parâmetros de entrada.

Configurações CORS são implementadas para controlar quais domínios podem acessar a API, prevenindo ataques cross-origin maliciosos. Headers de segurança apropriados são configurados para proteger contra ataques comuns como clickjacking e content sniffing.

### Monitoramento e Auditoria

O sistema implementa logging abrangente de atividades de segurança, incluindo tentativas de login, operações administrativas, e acessos a dados sensíveis. Logs são estruturados para facilitar análise automatizada e detecção de padrões suspeitos.

Monitoramento de tentativas de login falhadas permite detecção de ataques de força bruta e implementação de contramedidas como bloqueio temporário de contas ou endereços IP. Alertas automáticos são gerados quando padrões suspeitos são detectados.

Auditoria de operações críticas mantém rastro de quem realizou quais operações e quando, proporcionando accountability e facilitando investigação de incidentes de segurança. Logs de auditoria são protegidos contra modificação e mantidos por período apropriado para compliance regulatório.

### Configurações de Segurança

Variáveis de ambiente são utilizadas para armazenar informações sensíveis como credenciais de banco de dados e chaves criptográficas, evitando exposição através de código fonte. Arquivos de configuração contendo informações sensíveis são excluídos do controle de versão.

O sistema implementa princípio de menor privilégio, garantindo que componentes tenham apenas as permissões mínimas necessárias para funcionamento. Contas de banco de dados utilizam credenciais específicas com privilégios limitados às operações necessárias.

Rate limiting é implementado para prevenir abuse de recursos e ataques de denial of service. Limites são configurados apropriadamente para balancear proteção com usabilidade, permitindo operações legítimas enquanto bloqueiam atividades maliciosas.

### Compliance e Regulamentações

O sistema é projetado para facilitar compliance com regulamentações de proteção de dados como LGPD, implementando controles apropriados para coleta, processamento, e armazenamento de dados pessoais. Políticas de retenção de dados são implementadas para garantir que informações não sejam mantidas além do período necessário.

Procedimentos de resposta a incidentes são documentados para garantir que violações de segurança sejam tratadas apropriadamente, incluindo notificação de autoridades regulatórias quando necessário. Planos de continuidade de negócio incluem procedimentos para recuperação após incidentes de segurança.

Treinamento de segurança é recomendado para todos os usuários do sistema, especialmente aqueles com privilégios administrativos. Políticas de segurança devem ser comunicadas claramente e atualizadas regularmente conforme evolução de ameaças e regulamentações.

## Deploy e Produção

O deployment do CashHaven Server em ambiente de produção requer planejamento cuidadoso de infraestrutura, configurações de segurança, e procedimentos de monitoramento para garantir operação confiável e performance adequada sob carga operacional real.

### Preparação do Ambiente

O ambiente de produção deve ser configurado com recursos adequados para suportar carga esperada, incluindo CPU, memória, e armazenamento suficientes para operação eficiente. Recomenda-se utilizar servidores dedicados ou instâncias de cloud computing com especificações apropriadas para aplicações Node.js.

Sistema operacional deve ser configurado com atualizações de segurança mais recentes e configurações hardened apropriadas para ambiente de produção. Firewall deve ser configurado para permitir apenas tráfego necessário, bloqueando portas desnecessárias e implementando regras de acesso restritivas.

Node.js deve ser instalado na versão LTS mais recente para garantir estabilidade e suporte a longo prazo. Process managers como PM2 são recomendados para gerenciamento de processos, incluindo restart automático em caso de falhas e balanceamento de carga entre múltiplas instâncias.

### Configuração de Banco de Dados

MySQL deve ser configurado com parâmetros otimizados para ambiente de produção, incluindo configurações de buffer pool, cache de consultas, e limites de conexão apropriados para carga esperada. Configurações de segurança devem incluir credenciais robustas e acesso restrito por endereço IP.

Backup automático deve ser configurado com frequência apropriada para minimizar perda de dados em caso de falhas. Backups devem ser testados regularmente para garantir que procedimentos de recuperação funcionem corretamente. Armazenamento de backup deve ser geograficamente separado do servidor principal.

Monitoramento de performance de banco de dados deve incluir métricas como utilização de CPU, uso de memória, tempo de resposta de consultas, e utilização de conexões. Alertas devem ser configurados para notificar administradores quando métricas excedem thresholds predefinidos.

### Configuração de Aplicação

Variáveis de ambiente devem ser configuradas apropriadamente para ambiente de produção, incluindo credenciais de banco de dados, chaves criptográficas, e URLs de serviços externos. Configurações de desenvolvimento devem ser removidas ou desabilitadas para evitar exposição de informações sensíveis.

Logging deve ser configurado para capturar informações adequadas para troubleshooting sem expor dados sensíveis. Logs devem ser rotacionados automaticamente para evitar consumo excessivo de espaço em disco. Centralização de logs através de ferramentas como ELK stack pode facilitar análise e monitoramento.

HTTPS deve ser configurado utilizando certificados SSL/TLS válidos para garantir criptografia de comunicações. Certificados devem ser renovados automaticamente quando possível para evitar interrupções de serviço. Configurações de cipher suites devem seguir melhores práticas de segurança.

### Monitoramento e Alertas

Sistema de monitoramento abrangente deve incluir métricas de aplicação, sistema operacional, e banco de dados. Métricas importantes incluem tempo de resposta, taxa de erro, utilização de recursos, e disponibilidade de serviços. Dashboards devem ser configurados para visualização em tempo real de métricas críticas.

Alertas devem ser configurados para notificar equipe de operações quando problemas são detectados, incluindo falhas de serviço, performance degradada, ou eventos de segurança. Escalation procedures devem garantir que alertas críticos sejam tratados rapidamente mesmo fora do horário comercial.

Health checks devem ser implementados para verificar status de componentes críticos, incluindo conectividade de banco de dados, funcionalidade de APIs, e integrações externas. Load balancers e sistemas de monitoramento podem utilizar health checks para determinar quando instâncias devem ser removidas de rotação.

### Procedimentos de Deploy

Processo de deploy deve ser automatizado quando possível para reduzir erro humano e garantir consistência entre deployments. CI/CD pipelines podem incluir testes automatizados, build de aplicação, e deployment para ambiente de staging antes de produção.

Blue-green deployment ou rolling updates podem ser utilizados para minimizar downtime durante atualizações. Procedimentos de rollback devem ser testados e documentados para permitir reversão rápida em caso de problemas com novas versões.

Testes de smoke devem ser executados após cada deployment para verificar que funcionalidades críticas estão operando corretamente. Monitoramento deve ser intensificado durante e após deployments para detectar rapidamente qualquer degradação de performance ou funcionalidade.

### Backup e Recuperação

Estratégia de backup deve incluir backups regulares de banco de dados, arquivos de configuração, e código de aplicação. Backups devem ser testados regularmente através de procedimentos de recuperação em ambiente de teste para garantir que dados possam ser restaurados quando necessário.

Disaster recovery plan deve incluir procedimentos para recuperação completa do sistema em caso de falhas catastróficas. Isto pode incluir replicação para data center secundário, backup de configurações de infraestrutura, e documentação detalhada de procedimentos de recuperação.

RTO (Recovery Time Objective) e RPO (Recovery Point Objective) devem ser definidos baseados em requisitos de negócio e utilizados para orientar estratégias de backup e recuperação. Testes regulares de disaster recovery devem ser realizados para validar que objetivos podem ser atingidos.

### Problemas de Performance

Degradação de performance pode manifestar-se como tempo de resposta lento, timeouts de requisições, ou alta utilização de recursos do servidor. Análise de performance deve começar com identificação de gargalos através de monitoramento de métricas de sistema e aplicação.

Consultas de banco de dados lentas são causa comum de problemas de performance. MySQL slow query log pode ser utilizado para identificar consultas que excedem thresholds de tempo de execução. Análise de planos de execução pode revelar oportunidades de otimização através de índices ou reescrita de consultas.

Vazamentos de memória em aplicações Node.js podem causar degradação gradual de performance e eventual crash da aplicação. Ferramentas de profiling como clinic.js ou node --inspect podem ser utilizadas para identificar vazamentos de memória e otimizar uso de recursos.

### Problemas de Autenticação

Falhas de autenticação podem resultar de tokens JWT expirados, configurações incorretas de chave secreta, ou problemas de sincronização de tempo entre cliente e servidor. Verificação de configurações JWT e validação de timestamps podem ajudar a identificar problemas de autenticação.

Problemas de hash de senha podem ocorrer devido a mudanças na biblioteca bcrypt ou configurações incorretas de salt factor. Comparação de hashes gerados com hashes armazenados pode revelar inconsistências que impedem autenticação bem-sucedida.

Middleware de autenticação pode falhar devido a configurações incorretas de CORS, headers malformados, ou problemas de parsing de tokens. Logging detalhado de middleware pode ajudar a identificar onde exatamente o processo de autenticação está falhando.

### Problemas de Integração

Falhas de integração com serviços externos como WhatsApp, sistemas de pagamento, ou APIs de terceiros podem resultar de mudanças em APIs externas, problemas de autenticação, ou configurações incorretas de rede.

Integração WhatsApp pode falhar devido a sessões expiradas, mudanças na API do WhatsApp Web, ou problemas de conectividade. Reinicialização do Venom Bot e reautenticação através de QR code frequentemente resolve problemas de sessão.

APIs de terceiros podem retornar erros específicos que indicam natureza do problema, como rate limiting, autenticação falhada, ou dados malformados. Análise de códigos de resposta HTTP e mensagens de erro pode orientar estratégias de resolução.

### Ferramentas de Diagnóstico

Logs de aplicação são a ferramenta primária para diagnóstico de problemas, fornecendo informações detalhadas sobre operações do sistema, erros, e eventos de segurança. Configuração apropriada de níveis de log garante que informações suficientes sejam capturadas sem impactar performance.

Ferramentas de monitoramento de sistema como htop, iostat, e netstat fornecem visibilidade em tempo real de utilização de recursos, atividade de rede, e processos em execução. Estas ferramentas são essenciais para identificar gargalos de recursos e problemas de conectividade.

Ferramentas específicas do Node.js como node --inspect, clinic.js, e 0x podem ser utilizadas para profiling detalhado de aplicações, identificação de vazamentos de memória, e otimização de performance. Estas ferramentas requerem conhecimento especializado mas fornecem insights valiosos para problemas complexos.

### Procedimentos de Resolução

Procedimentos sistemáticos de troubleshooting devem começar com coleta de informações sobre sintomas, incluindo quando problema começou, quais operações são afetadas, e quais mensagens de erro são observadas. Esta informação orienta estratégias de diagnóstico e resolução.

Isolamento de problemas através de testes controlados pode ajudar a identificar componentes específicos que estão causando problemas. Isto pode incluir teste de conectividade individual de componentes, execução de operações específicas em ambiente controlado, ou comparação com ambiente de desenvolvimento.

Resolução de problemas deve ser documentada para facilitar troubleshooting futuro de problemas similares. Knowledge base de problemas comuns e suas resoluções pode significativamente reduzir tempo de resolução para problemas recorrentes.

## Referências

[1] Express.js Official Documentation - https://expressjs.com/
[2] TypeScript Handbook - https://www.typescriptlang.org/docs/
[3] MySQL 8.0 Reference Manual - https://dev.mysql.com/doc/refman/8.0/en/
[4] JSON Web Tokens Introduction - https://jwt.io/introduction
[5] bcrypt Library Documentation - https://www.npmjs.com/package/bcrypt
[6] Venom Bot Documentation - https://github.com/orkestral/venom
[7] WebSocket API Documentation - https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
[8] Node.js Best Practices - https://github.com/goldbergyoni/nodebestpractices
[9] OWASP Security Guidelines - https://owasp.org/www-project-top-ten/
[10] MySQL Performance Tuning - https://dev.mysql.com/doc/refman/8.0/en/optimization.html

