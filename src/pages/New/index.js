import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'


import  './new.css'

const listRef = collection(db, "customers");

export default function New(){
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();


  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true)
  const [customerSelected, setCustomerSelected] = useState(0)

  const [complement, setComplement] = useState('')
  const [topic, setTopic] = useState('Support')
  const [status, setStatus] = useState('Open')
  const [idCustomer, setIdCustomer] = useState(false)


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
          console.log("No customers found")
          setCustomers([{id: '1', name: 'FREELA'}])
          setLoadCustomer(false);
          return;
        }

        setCustomers(list);
        setLoadCustomer(false);

        if(id){
          loadId(list);
        }

      })
      .catch((error) => {
        console.log("Error on searching clients", error)
        setLoadCustomer(false);
        setCustomers([{id: '1', name: 'FREELA'}])
      })
    }

    loadCustomers();
  }, [id])


  async function loadId(list){
    const docRef = doc(db, 'tickets', id);
    await getDoc(docRef)
    .then((snapshot) => {
      setCustomerSelected(list.findIndex(item => item.id === snapshot.data().clientId))
      setTopic(snapshot.data().topic)
      setStatus(snapshot.data().status)
      setComplement(snapshot.data().complement)

      setIdCustomer(true);
    })
    .catch((error) => {
      console.log(error);
      setIdCustomer(false);
    })
  }

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

    if(idCustomer){
      const docRef = doc(db, 'tickets', id);
      await updateDoc(docRef, {
        clientId: customers[customerSelected].id,
        client: customers[customerSelected].nameOfCompany,
        topic: topic,
        complement: complement,
        status: status,
        userId: user.uid,
      })
      .then(() => {
        toast.info("Ticket updated!")
        setComplement('');
        setCustomerSelected(0);
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error("Ops, something goes wrong, try later!")
        console.log("ERROR", error)
      })

      return;
    }

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
        <Title name={id ? "Editing the ticket" : "New ticket"}>
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