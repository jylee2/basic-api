<<<<<<< HEAD
import { MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts'

const client = new MongoClient();
await client.connect("mongodb://localhost:27017");

=======
import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://localhost:27017");

>>>>>>> b3c20bfc33bf48123a72b5e109c46d8bb09d5ca4
export const db = client.database("deno_auth");