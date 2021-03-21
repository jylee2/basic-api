/*
 * This is an example of a server that will serve static content out of the
 * $CWD/examples/static path.
 */

import {
  bold,
  cyan,
  green,
  red,
  yellow,
} from 'https://deno.land/std@0.84.0/fmt/colors.ts'
import {
  Application,
  Context,
  HttpError,
  Router,
  RouterContext,
  Status
} from 'https://deno.land/x/oak@v6.2.0/mod.ts'
import { applyGraphQL, gql, GQLError } from 'https://deno.land/x/oak_graphql@0.6.2/mod.ts'
import { Bson, MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts'
// import { MongoClient } from 'https://deno.land/x/mongo@v0.7.0/mod.ts'

const app = new Application()

// =======================================================

const client = new MongoClient()
await client.connect('mongodb://localhost:27017')
// await client.connect({
//   db: 'recordOne',
//   tls: true,
//   servers: [
//     {
//       host: 'cluster0-shard-00-02.cwxbw.mongodb.net',
//       port: 27017,
//     }
//   ],
//   credential: {
//     username: 'jylee4',
//     password: 'hellomoto123',
//     db: 'recordOne',
//     mechanism: "SCRAM-SHA-1"
//   }
// })
// client.connectWithUri('mongodb://localhost:27017')

const db = client.database('test')
const dogs = db.collection('dogs')

// const dogs = [
//   {
//     name: 'shiba',
//     isGoodBoi: true,
//     id: 1
//   },
//   {
//     name: 'golden',
//     isGoodBoi: true,
//     id: 2
//   }
// ]

// =======================================================

// Error handler middleware
app.use(async (context, next) => {
  try {
    await next()
  } catch (e) {
    if (e instanceof HttpError) {
      // deno-lint-ignore no-explicit-any
      context.response.status = e.status as any
      if (e.expose) {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${e.message}</h1>
              </body>
            </html>`
      } else {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${Status[e.status]}</h1>
              </body>
            </html>`
      }
    } else if (e instanceof Error) {
      context.response.status = 500
      context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`
      console.log('Unhandled Error:', red(bold(e.message)))
      console.log(e.stack)
    }
  }
})

// Logger
app.use(async (context, next) => {
  await next()
  const rt = context.response.headers.get('X-Response-Time')
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  )
})

// Response Time
app.use(async (context, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  context.response.headers.set('X-Response-Time', `${ms}ms`)
});

// ========== MongoDB Atlas ==========
// async function connect(): Promise<Collection<IGistSchema>> {
//   const client = new MongoClient()
//   await client.connect({
//     db: 'recordOne',
//     tls: true,
//     servers: [
//       {
//         host: 'cluster0-shard-00-02.cwxbw.mongodb.net',
//         port: 8000,
//       }
//     ],
//     credential: {
//       username: "<user>",
//       password: "<password>",
//       db: 'recordOne',
//       mechanism: "SCRAM-SHA-1"
//     }
//   })
//   return client.database('gist_api').collection<IGistSchema>('gists')

// }
// export async function insertGist(gist: any): Promise<string> {
//   const collection = await connect()
//   return (await collection.insertOne(gist)).toString()
// }
// cluster0-shard-00-02.cwxbw.mongodb.net

// ========== Oak-GraphQL ==========
// @ts-ignore

const typeDefs = gql`
  type Dog {
    name: String!
    isGoodBoi: Boolean!
    id: ID!
  }

  input DogInput {
    name: String!
    isGoodBoi: Boolean!
  }

  type Query {
    foo: String!
    dog: [Dog!]!
  }

  type Mutation {
    addDog(input: DogInput): Dog!
  }
`

const resolvers = {
  Query: {
    foo: () => 'bar',
    dog: async () => {
      const doggos = await dogs.find()
      return doggos.map((doggo: any) => {
        const { _id: { '\$oid': id }} = doggo
        doggo.id = id
        return doggo
      })
    }
  },
  Mutation: {
    addDog: async (_: any, { input: {name, isGoodBoi} }: any, context: any, info: any) => {
      const { '\$oid': id } = await dogs.insertOne({ name, isGoodBoi })
      return { name, isGoodBoi, id }
    }
  }
}

// const typeDefs = gql`
//   type Query {
//     foo: String!
//   }
// `

// const resolvers = {
//   Query: {
//     foo: () => 'bar'
//   }
// }

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: typeDefs,
  resolvers: resolvers
})

app.use(GraphQLService.routes(), GraphQLService.allowedMethods())

// ========== cd to static folder and npm run build, then send static content ==========
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/basic-static/build`,
    index: 'index.html',
  })
})

app.addEventListener('listen', ({ hostname, port }) => {
  console.log(
    bold('Start listening on ') + yellow(`${hostname}:${port}`),
  )
})

await app.listen({ hostname: 'localhost', port: 8080 })