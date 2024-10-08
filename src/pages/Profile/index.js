import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiSettings } from 'react-icons/fi'


export default function Profile(){
  return (
    <div>
      <Header/>
      <div className='content'>
        <Title name="My account">
          <FiSettings size={25} />
        </Title>
      </div>
      <h1>Profile Page</h1>
    </div>
  )
}