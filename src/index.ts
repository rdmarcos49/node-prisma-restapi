import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import usersRoutes from '@/core/users/users.routes'
import authRoutes from '@/core/auth/auth.routes'
import productsRoutes from '@/core/products/products.routes'

dotenv.config()

const app = express()
const port = process.env.APP_PORT ?? 3000

app.use(morgan('dev'))
app.use(express.json()) // http://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ extended: false })) // http://expressjs.com/en/5x/api.html#express.urlencoded

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/products', productsRoutes)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
