import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
    res.json({ message: 'User registered successfully', userId: user.id })
  } catch (error) {
    res.status(500).json({ error: 'Unable to register user' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      )
      res.json({ token })
    } else {
      res.status(400).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to log in' })
  }
}

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, name: true, email: true, profile: true },
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch profile' })
  }
}

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, profile } = req.body
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.userId },
      data: { name, profile },
    })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Unable to update profile' })
  }
}
