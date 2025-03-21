FROM node:23

WORKDIR /app

COPY package.json ./

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "run", "preview"]
