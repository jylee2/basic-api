cd /c/deno/react/basic-deno/basic-static
npm run build

cd /c/deno/react/basic-deno
deno run --allow-net --allow-read basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/staticServer.ts
