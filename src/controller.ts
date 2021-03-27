<<<<<<< HEAD
// import { RouterContext } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
// import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
// import { create } from 'https://deno.land/x/djwt@v2.2/mod.ts'

// import { db } from './database/connection.ts'
// import UserSchema from './schemas/user.ts'

// const users = db.collection<UserSchema>("users");

// // Doesn't work

// export const Register = async ({request, response}: RouterContext) => {
//   const { name, email, password } = await request.body().value

//   const _id = await users.insertOne({
//     name,
//     email,
//     password: await bcrypt.hash(password)
//   })

//   response.body = await users.findOne({ _id: _id })
// }

// export const Login = async ({request, response, cookies}: RouterContext) => {
//   const { email, password } = await request.body().value

//   const user = await users.findOne({ email: email })

//   if (!user) {
//     response.body = 404
//     response.body = {
//       message: 'User not found.'
//     }
//     return 
//   }

//   if (!await bcrypt.compare(password, user.password)) {
//     response.body = 401
//     response.body = {
//       message: 'Incorrect password.'
//     }
//     return 
//   }

//   const jwt = await create({ alg: "HS512", typ: "JWT" }, { _id: user._id }, "secret")

//   cookies.set('jwt', jwt, {httpOnly: true})

//   response.body = {
//     message: 'success'
//   }

// }
=======
import { RouterContext } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'

import { db } from './database/connection.ts'
import UserSchema from './schemas/user.ts'

const users = db.collection<UserSchema>("users");

export const Register = async ({request, response}: RouterContext) => {
  const { name, email, password } = await request.body().value

  const _id = await users.insertOne({
    name,
    email,
    password: await bcrypt.hash(password)
  })

  response.body = await users.findOne({ _id: _id })
}
>>>>>>> b3c20bfc33bf48123a72b5e109c46d8bb09d5ca4
