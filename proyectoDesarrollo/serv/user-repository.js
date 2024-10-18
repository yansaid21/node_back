import DBLocal from 'db-local'
import crypto from 'crypto'
import bcrypt from "bcrypt"
import { SALT_ROUNDS } from './config.js'
import { transcode } from 'buffer'

const { Schema } = new DBLocal({path: './db'})

const User = Schema('User', {
  _id:{type:String , required:true},
  username: {type:String , required:true},
  password: {type:String , required:true}
})
export class userRepository {
  static create ({username,password}){
    //validaciones del username
    Validation.username(username)
    Validation.password(password)
      // VALIDAR QUE EL USERNAME NO EXISTE
    const user = User.findOne({username})
    if (user) throw new Error('username alredy exists')
    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password,SALT_ROUNDS)
  User.create({
    _id:id,
    username,
    password: hashedPassword
  }).save()
  return id
  
  }
  static login ({username,password}){
    Validation.username(username)
    Validation.password(password)
    const user = User.findOne({username})
    if (!user) throw new Error ('username does not exists') 

    const isValid = bcrypt.compareSync(password,user.password)
    if(!isValid) throw new Error ('password is invalid')
      const {password: _, ...publicUser} = user
    return publicUser
  }

}

class Validation{
  static username (username) {

    if(typeof username != 'string') throw new Error ('username must be a string')
      if(username.length <3) throw new Error ('username must be at least 3 characters long')
      }
    static password(password){
  if(typeof password != 'string') throw new Error ('password must be a string')
    if(password.length <6) throw new Error ('password must be at least 6 characters long')

}
}