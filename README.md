# Projeto de Processamento de Imagens com API do Google Gemini

Este projeto é uma aplicação que utiliza a API do Google Gemini para processar e analisar imagens. Ele permite a confirmação de leituras e o processamento de imagens para gerar descrições baseadas em inteligência artificial.

## Sumário

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

O projeto inclui funcionalidades para:
- Processar imagens enviadas como base64 e gerar descrições usando a API do Google Gemini.
- Confirmar leituras através de endpoints específicos.
- Listar leituras por cliente e tipo de medição.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- Docker 
- Uma chave de API do Google Gemini

## Instalação

1. Clone o repositório:

    ```bash
    git clone git@github.com:Italo9/consumo-agua-gas.git
    cd seu-repositorio
    git checkout master

    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto e adicione sua variável de ambiente:

    ```plaintext
    GEMINI_API_KEY=sua_chave_api
    ```

2. Execute as migrações para configurar o banco de dados:

    ```bash
    docker-compose up
    ```

## Uso

Para iniciar o servidor, execute:

```bash
docker-compose up
