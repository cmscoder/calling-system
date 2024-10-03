import { useState, useContext } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'


export default function SignUp(){
  const [name, setName] =  useState('');
  const [email, setEmail] =  useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e){
    e.preventDefault();

    if(name !== '' && email !== '' && password !== ''){
      await signUp(email, password, name)
    }
  }


  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Calling System logo' />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Register a new account</h1>
          <input 
            type='text' 
            placeholder='Your name' 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input 
            type='text' 
            placeholder='email@email.com' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type='password' 
            placeholder='********' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{loadingAuth ? 'Loading...' : 'Register'}</button>
        </form>
        <Link to="/">Do you already have an account? Do the login</Link>
      </div>
    </div>
  )
}