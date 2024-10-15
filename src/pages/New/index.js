import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore'

import { toast } from 'react-toastify'


import  './new.css'

const listRef = collection(db, "customers");

export default function New(){
  const { user } = useContext(AuthContext);


  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true)
  const [customerSelected, setCustomerSelected] = useState(0)

  const [complement, setComplement] = useState('')
  const [topic, setTopic] = useState('Support')
  const [status, setStatus] = useState('Open')


  useEffect(() => {
    async function loadCustomers(){
      const querySnapshot = await getDocs(listRef)
      .then((snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            nameOfCompany: doc.data().nameOfCompany
          })
        })

        if(snapshot.docs.size === 0){

        }

        setCustomers(list);
        setLoadCustomer(false);
      })
      .catch((error) => {
        console.log("Error on searching clients", error)
        setLoadCustomer(false);
        setCustomers([{id: '1', name: 'FREELA'}])
      })
    }

    loadCustomers();
  }, [])



  function  handleOptionChange(e){
    setStatus(e.target.value);
  }

  function handleChangeSelect(e){
    setTopic(e.target.value)
  }

  function handleChangeCustomer(e){
    setCustomerSelected(e.target.value)
  }

  async function handleRegister(e){
    e.preventDefault();

    await addDoc(collection(db, "tickets"), {
      created: new Date(),
      client: customers[customerSelected].nameOfCompany,
      clientId: customers[customerSelected].id,
      topic: topic,
      complement: complement,
      status: status,
      userId: user.uid,
    })
    .then(() => {
      toast.success("Ticket registered!")
      setComplement('')
      setCustomerSelected(0) 
    })
    .catch((error) => {
      toast.error("Ops, something goes wrong, try later!")
      console.log("ERROR", error)
    })
  }


  return (
    <div>
      <Header />

      <div className='content'>
        <Title name="New ticket">
          <FiPlusCircle size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>
            <label>Clients</label>
            {
              loadCustomer ? (
                <input type='text' disabled={true} value={"Loading..."}/>
              ) : (
                <select value={customerSelected} onChange={handleChangeCustomer}>
                  {customers.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                        {item.nameOfCompany}
                      </option>
                    )
                  })}
                </select>
              )
            }
            <label>Topic</label>
            <select value={topic} onChange={handleChangeSelect}>
              <option value="Support">Support</option>
              <option value="Technical visit">Technical visit</option>
              <option value="Finantial">Finantial</option>
            </select>
            <label>Status</label>
            <div className='status'>
              <input 
                type="radio"
                name="radio"
                value="Open"
                onChange={handleOptionChange}
                checked={status === 'Open'}
              />
              <span>Open</span>
             
              <input 
                type="radio"
                name="radio"
                value="Progress"
                onChange={handleOptionChange}
                checked={status === 'Progress'}
              />
              <span>In progress</span>

              <input 
                type="radio"
                name="radio"
                value="Done"
                onChange={handleOptionChange}
                checked={status === 'Done'}
              />
              <span>Done</span>

            </div>
            <label>Complement</label>
            <textarea 
              type="text"
              placeholder='Describe your issue'
              value={complement}
              onChange={(e) => setComplement(e.target.value) }
            />
            <button type='submit'>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}