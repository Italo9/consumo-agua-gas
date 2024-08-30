#!/bin/sh
echo "Aguardando o PostgreSQL iniciar..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL está disponível."

# Executar migrações
npm run migrate

# Agora inicie a aplicação
npm start
