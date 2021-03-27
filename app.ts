import {
  bold,
  cyan,
  green,
  red,
  yellow,
} from 'https://deno.land/std@0.84.0/fmt/colors.ts'
import { Application, Router, RouterContext } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
import { create, verify } from 'https://deno.land/x/djwt@v2.2/mod.ts'
import { oakCors } from 'https://deno.land/x/cors@v1.2.1/mod.ts'
import { Bson } from 'https://deno.land/x/mongo@v0.22.0/mod.ts'

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
    
      const newUser = await users.findOne({ _id: _id })
      // delete newUser.password

      context.response.body = newUser
    } catch (error) {
      console.log('----------register error', error)
    }
  })
  .post('/api/login', async ({ request, response, cookies }: RouterContext) => {
    const { email, password } = await request.body().value
  
    const user = await users.findOne({ email: email })
  
    if (!user) {
      response.body = 404
      response.body = {
        message: 'User not found.'
      }
      return 
    }
  
    if (!await bcrypt.compare(password, user.password)) {
      response.body = 401
      response.body = {
        message: 'Incorrect password.'
      }
      return 
    }
  
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { _id: user._id }, "secret")
  
    cookies.set('jwt', jwt, {httpOnly: true})
  
    response.body = {
      message: 'Logged in successfully.'
    }
  
  })
  .get('/api/user', async ({ response, cookies }: RouterContext) => {
    const jwt = cookies.get('jwt') || null

    if (!jwt) {
      response.body = 401
      response.body = {
        message: 'Unauthenticated user.'
      }
      return 
    }

    const payload = await verify(jwt, 'secret', 'HS512') // { foo: 'bar' }

    if (!payload) {
      response.body = 401
      response.body = {
        message: 'Unauthenticated user.'
      }
      return 
    }

    // const { password, ...userData } = await users.findOne({ _id: new Bson.ObjectId(payload._id) })
    const { ...userData } = await users.findOne({ _id: new Bson.ObjectId(payload._id) })
    
    response.body = userData
  
  })
  .post('/api/logout', async ({ response, cookies }: RouterContext) => {
    cookies.delete('jwt')

    response.body = {
      message: 'Logged out successfully.'
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

const app = new Application()

app.use(oakCors({
  credentials: true, // to get the cookie
  origin: /^.+localhost:(3000|4200|8080)$/, // ports for the frontend
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener('listen', ({ hostname, port }) => {
  console.log(bold('Listening on ') + cyan(`${hostname}:${port}`))
})

await app.listen({ hostname: 'localhost', port: 8000 });