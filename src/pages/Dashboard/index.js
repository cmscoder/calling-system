import { useContext,  useEffect, useState  } from "react"
import { AuthContext } from "../../contexts/auth"

import Header from "../../components/Header";
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from "react-router-dom";

import { collection, getDocs, orderBy, limit, startAfter, query} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { format } from 'date-fns'
import Modal from '../../components/Modal'

import './dashboard.css'

const listRef = collection(db, "tickets")


export default function Dashboar(){
  const { logout } = useContext(AuthContext);


  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState({})


  useEffect(() => {
    async function loadTickets(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setTickets([]);

      await updateState(querySnapshot)

      setLoading(false);

    }

    loadTickets();


    return () => { }
  }, [])


  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
      let list = [];

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          topic: doc.data().topic,
          client: doc.data().client,
          clientId: doc.data().clientId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complement: doc.data().complement,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // Taking the last item rendered

      setTickets(tickets => [...tickets, ...list])
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);
    
  }

  async function handleMore(){
    setLoadingMore(true);
    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Looking for tickets...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header />
      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>
        <>
          <Link to="/new" className="new">
            <FiPlus color="#FFF" size={25}/>
            New ticket
          </Link>
          <table>
            <thead>
              <tr>
                <th scope="col">Client</th>
                <th scope="col">Topic</th>
                <th scope="col">Status</th>
                <th scope="col">Registered in</th>
                <th scope="col">in</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((item, index) => {
                return (
                  <tr key={index}>
                    <td data-label="Client">{item.client}</td>
                    <td data-label="Topic">{item.topic}</td>
                    <td data-label="Status">
                      <span className="badge" style={{backgroundColor: item.status === 'Open' ? '#5cb85c' : '#999'}}>
                      {item.status}
                      </span>
                    </td>
                    <td data-label="Registered">{item.createdFormat}</td>
                    <td data-label="#">
                      <button className="action" style={{backgroundColor: "#3583f6"}} onClick={() => toggleModal(item)}>
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      <Link to={`/new/${item.id}`}  className="action" style={{backgroundColor: "#f6a935"}} >
                        <FiEdit2 color="#FFF" size={17}  />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>


          {loadingMore && <h3>Fetching more tickets...</h3>}
          {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Fetch more</button>}
        </>
      </div>
      {showPostModal && (
        <Modal 
          content={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
      
    </div>
  )
}