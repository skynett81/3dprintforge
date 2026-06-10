FROM node:22-slim

# curl is used for the Bambu Cloud authenticator-2FA sign-in: that endpoint is
# behind Cloudflare bot-management which challenges Node's TLS fingerprint but
# lets curl through.
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg openssl curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p data data/uploads data/library data/model-cache data/history-models data/toolpath-cache certs

EXPOSE 3000 3443 9001-9010

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok&&r.status!==301)throw new Error();process.exit(0)}).catch(()=>process.exit(1))"

CMD ["node", "server/index.js"]
