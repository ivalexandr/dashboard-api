import express from 'express'

export const userRouter = express.Router()

userRouter.use((req, res, next) => {
  console.log('обработчик users')
  next()
})
