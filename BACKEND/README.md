# 1. Iniciar projeto
npm init -y

# 2. Instalar dependências de produção
npm install express bcryptjs jsonwebtoken cors @prisma/client

# 3. Instalar dependências de desenvolvimento (Tipagens e TS)
npm install -D typescript ts-node-dev @types/express @types/bcryptjs @types/jsonwebtoken @types/cors @types/node prisma

# 4. Inicializar configuração do TypeScript
npx tsc --init

npx prisma init

# 3. Modelando o Banco de Dados
# Abra o arquivo prisma/schema.prisma. Aqui definimos como será nossa tabela de usuários. Substitua o conteúdo pelo código abaixo:
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}
´´´

DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/meubanco?schema=public"

npx prisma migrate dev --name init


npm run dev

