import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
// import contactRoutes from './routes/contactRoutes'
// import locationRoutes from './routes/locationRoutes'
// import placeRoutes from './routes/placeRoutes'
// import alertRoutes from './routes/alertRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(
    'Every deserves to live in a world where they are safe and loved ❤️!'
  )
})
app.get('/test', (req, res) => {
  res.send('Hello, Safety (with Roy accent 😁)!')
})
app.use('/api/users', userRoutes)
// app.use('/api/contacts', contactRoutes)
// app.use('/api/locations', locationRoutes)
// app.use('/api/places', placeRoutes)
// app.use('/api/alerts', alertRoutes)

export default app
