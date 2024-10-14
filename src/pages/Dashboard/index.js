import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

import Header from "../../components/Header";
import Title from '../../components/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from "react-router-dom";

import './dashboard.css'

export default function Dashboar(){
  const { logout } = useContext(AuthContext);


  async function handleLogout(){
    await logout();
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
              <tr>
                <td data-label="Client">Turtle Adepts</td>
                <td data-label="Topic">Support</td>
                <td data-label="Status">
                  <span className="badge" style={{backgroundColor: "#999"}}>
                    Open
                  </span>
                </td>
                <td data-label="Registered">14/09/2024</td>
                <td data-label="#">
                  <button className="action" style={{backgroundColor: "#3583f6"}}>
                    <FiSearch color="#FFF" size={17} />
                  </button>
                  <button  className="action" style={{backgroundColor: "#f6a935"}} >
                    <FiEdit2 color="#FFF" size={17}  />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      </div>
    </div>
  )
}