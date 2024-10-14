import { useState } from 'react'

import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

import { toast } from 'react-toastify';

export default function Customers(){
  const [name, setName] = useState('')
  const [nif, setNif] = useState('')
  const [address, setAddress] = useState('')

  async function handleRegister(e){
    e.preventDefault();

    if(name !== '' && nif !== '' && address !== '' ){
      await addDoc(collection(db, "customers"), {
        nameOfCompany: name,
        nif: nif,
        address: address
      })
      .then(() => {
        setName('')
        setNif('')
        setAddress('')
        toast.success("Company registered!")
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something goes wrong")
      })
    }else{
      toast.error("Fill all fields")
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Clients">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Company name</label>
            <input 
              type="text"
              placeholder="Name of company"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>NIF</label>
            <input 
              type="text"
              placeholder="Type your NIF"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
            />

            <label>Address</label>
            <input 
              type="text"
              placeholder="Address of company"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button type='submit'>Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}