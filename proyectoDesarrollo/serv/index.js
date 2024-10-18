import express, { response } from 'express'
import {PORT, SECRET_JWT_KEY} from "./config.js"
import { userRepository } from './user-repository.js'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser'

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use((req,res,next)=>{
  const token = req.cookies.access_token
  req.session = {user:null}

  try {
    const data = jwt.verify(token,SECRET_JWT_KEY)
    req.session.user = data
  } catch {}
  next()
})

app.get('/', (req,res) => {
const {user} = req.session
  res.send(user)
})


app.post('/login',(req,res)=>{
  const {username,password}=req.body
  try{
    const user = userRepository.login({username,password})
    const token = jwt.sign(
      {id:user._id, username:user.username},
      SECRET_JWT_KEY,
      {expiresIn:'1h'})
      
      res
      .cookie('access_token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:1000*60*60
      })
      .send({user, token})
    }catch(error){
      res.status(401).send(error.message)
    }
  })
  app.post('/logout',(req,res)=>{
    res
    .clearCookie('access_token')
    .json({message: 'logout succesfull'})
    
  })
  app.post('/register',(req,res)=>{
    const {username,password} = req.body
    console.log("body", req.body);
    try{
      const id =userRepository.create({username,password})
      
      res.send({id})
    }catch(error){
      res.status(400).send(error.message)
    }
  })
  app.post('/protected',(req,res)=>{
    const {user} = req.session
    if(!user) return res.status(403).send('Access not authorized')
    try {
      const data = jwt.verify(token,SECRET_JWT_KEY)
    } catch (error) {
      res.send('no authorized')
      
    }
    res.send('autorized', user)
  })
  app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    
  })