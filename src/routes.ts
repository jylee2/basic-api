<<<<<<< HEAD
// import { Router } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
// import { Login, Register } from './controller.ts'

// console.log('----------Register', Register)

// const router = new Router()

// router.post('/api/register', Register)
// router.post('/api/login', Login)

// export default router
=======
import { Router } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
import { Register } from './controller.ts'

console.log('----------Register', Register)

const router = new Router()

router.post('/api/register', Register)

export default router
>>>>>>> b3c20bfc33bf48123a72b5e109c46d8bb09d5ca4
