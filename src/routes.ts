import { Router } from 'https://deno.land/x/oak@v6.4.0/mod.ts'
import { Register } from './controller.ts'

console.log('----------Register', Register)

const router = new Router()

router.post('/api/register', Register)

export default router
