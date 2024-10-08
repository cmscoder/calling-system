import { useContext } from 'react'
import avatImg from '../../assets/avatar.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { FiHome, FiUser, FiSettings } from 'react-icons/fi'
import './header.css'


export default function Header(){
  const { user } = useContext(AuthContext)
  return (
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatImg : user.avatarUrl} alt="User Photo"  />
      </div>
      <Link to="/dashboard">
        <FiHome color='#FFF' size={24} />
        Callings
      </Link>
      <Link to="/customers">
        <FiUser color='#FFF' size={24} />
        Clients
      </Link>
      <Link to="/profile">
        <FiSettings color='#FFF' size={24} />
        Profile
      </Link>
    </div>

    
  )
}