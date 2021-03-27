<<<<<<< HEAD
cd /c/deno/react/basic-deno
deno run --allow-net --allow-read basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts
deno run --reload --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts

deno install -qAf --unstable https://deno.land/x/denon@2.4.7/denon.ts
cd basic-api
denon --init
=======
cd /c/deno/react/basic-deno
deno run --allow-net --allow-read basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/staticServer.ts
deno run --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts
deno run --reload --allow-net --allow-write --allow-read --allow-plugin --unstable basic-api/app.ts

deno install -qAf --unstable https://deno.land/x/denon@2.4.7/denon.ts
cd basic-api
denon --init
>>>>>>> b3c20bfc33bf48123a72b5e109c46d8bb09d5ca4
denon start