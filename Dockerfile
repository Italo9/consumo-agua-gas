# Use uma imagem base do Node.js
FROM node:18

# Crie um diretório de trabalho
WORKDIR /app

# Copie package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile o TypeScript (se necessário)
RUN npm run build

# Instale o netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Copie o script de inicialização para o diretório de trabalho
COPY migrate-and-start.sh /usr/src/app/

# Torne o script de inicialização executável
RUN chmod +x /usr/src/app/migrate-and-start.sh

# Exponha a porta 80
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["/usr/src/app/migrate-and-start.sh"]
