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
