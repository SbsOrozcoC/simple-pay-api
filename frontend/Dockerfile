FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copiar el resto después de instalar dependencias
COPY . .

# Instalar vite globalmente por si acaso
RUN npm install -g vite

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]