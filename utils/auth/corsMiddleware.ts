import cors from 'cors'

// Configure CORS allowed origins here
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

const corsMiddleware = cors(corsOptions)

const applyCors = (req, res, next) => {
  corsMiddleware(req, res, () => {
    next()
  })
}

export default applyCors
