// import {
//   bold,
//   cyan,
//   green,
//   red,
//   yellow,
// } from 'https://deno.land/std@0.84.0/fmt/colors.ts'
// import { Application, Router, RouterContext } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
// import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

// // import router from './src/routes.ts'
// import { db } from './src/database/connection.ts'
// import UserSchema from './src/schemas/user.ts'

// const router = new Router()

// const users = db.collection<UserSchema>("users")

// router.post('/api/register', async ({request, response}: RouterContext) => {
//   const { name, email, password } = await request.body().value

//   const _id = await users.insertOne({
//     name,
//     email,
//     password: await bcrypt.hash(password)
//   })

//   response.body = await users.findOne({ _id: _id })
// })


// const app = new Application() 


// // router.post('/api/register', (context: any) => {
// //   context.response.body = 'Register'
// // })

// app.use(router.routes())
// app.use(router.allowedMethods()) // post, get, etc.

// // app.use((ctx) => {
// //   ctx.response.body = 'Hello World!'
// // })

// // app.addEventListener('listen', ({ hostname, port }) => {
// //   console.log(bold('Listening on ') + yellow(`${hostname}:${port}`))
// // })

// await app.listen({ port: 8000 })



// import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// const books = new Map<string, any>();
// books.set("1", {
//   id: "1",
//   title: "The Hound of the Baskervilles",
//   author: "Conan Doyle, Arthur",
// });

// const router = new Router();
// router
//   .get("/", (context) => {
//     context.response.body = "Hello world!";
//   })
//   .get("/book", (context) => {
//     context.response.body = Array.from(books.values());
//   })
//   .get("/book/:id", (context) => {
//     if (context.params && context.params.id && books.has(context.params.id)) {
//       context.response.body = books.get(context.params.id);
//     }
//   })
//   .post('/api/register', (context: any) => {
//     context.response.body = 'Register'
//   });

// const app = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

// await app.listen({ port: 8000 });

import { Application, Router, RouterContext } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

import { db } from './src/database/connection.ts'
import UserSchema from './src/schemas/user.ts'

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Arthur",
});

const users = db.collection<UserSchema>("users")

const router = new Router()
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/book", (context) => {
    context.response.body = Array.from(books.values());
  })
  .get("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id);
    }
  })
  .post('/api/test', (context) => {
    context.response.body = 'Test asdf'
  })
  .post('/api/register', async (context) => {
    try {
      const { name, email, password } = await context.request.body().value
  
      const _id = await users.insertOne({
        name,
        email,
        password: await bcrypt.hash(password)
      })
    
      context.response.body = await users.findOne({ _id: _id })
    } catch (error) {
      console.log('----------error', error)
    }
  })
  // .post('/api/register', async ({request, response}: RouterContext) => {
  //   const { name, email, password } = await request.body().value
  
  //   const _id = await users.insertOne({
  //     name,
  //     email,
  //     password: await bcrypt.hash(password)
  //   })
  
  //   response.body = await users.findOne({ _id: _id })
  // });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });