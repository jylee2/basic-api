cd /c/deno/react/basic-deno
deno run --allow-net --allow-read basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts
deno run --reload --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts

deno install -qAf --unstable https://deno.land/x/denon@2.4.7/denon.ts
cd basic-api
denon --init
denon start

git status
git add .
git commit -m "feat: add login, auth and logout"
git push origin main
