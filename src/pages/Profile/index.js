import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import { AuthContext } from '../../contexts/auth'

import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { toast } from 'react-toastify'

import './profile.css'


export default function Profile(){

  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null);
  const [name, setName] = useState(user && user.userName)
  const [email, setEmail] = useState(user && user.userEmail)


  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
          setImageAvatar(image)
          setAvatarUrl(URL.createObjectURL(image))
      }else{
        alert("Send a png or jpeg image")
        setImageAvatar(null);
        return;
      }
    }
  }

  async function handleUpload(){
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then((snapshot) => {

      getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
        let urlPhoto = downloadUrl;

        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
          avatarUrl: urlPhoto,
          userName: name,
        })
        .then(() => {
          let data ={
            ...user,
            userName: name,
            avatarUrl: urlPhoto,
          }
  
          setUser(data);
          storageUser(data);
          toast.success("Updated with success!")
        })
      })
    })
  }

  async function handleSubmit(e){
    e.preventDefault();

    if(imageAvatar === null && name !== ''){
      const docRef = doc(db, "users", user.uid)

      await updateDoc(docRef, {
        userName: name,
      })
      .then(() => {
        let data ={
          ...user,
          userName: name,
        }

        setUser(data);
        storageUser(data);
        toast.success("Updated with success!")
      })
    }else if(name !== '' && imageAvatar !== null){
      handleUpload()
    }
  }

  return (
    <div>
      <Header/>
      <div className='content'>
        <Title name="My account">
          <FiSettings size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleSubmit}>
            <label className='label-avatar'>
              <span>
                <FiUpload color='#FFF' size={25} />
              </span>

              <input type='file' accept='image/*' onChange={handleFile} /> <br/>
              {avatarUrl === null ? (
                <img src={avatar} alt='Profile' width={250} height={250}/>
              ) : (
                <img src={avatarUrl} alt='Profile' width={250} height={250}/>
              )}
            </label>

            <label>Name</label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />

            <label>Email</label>
            <input type='text' value={email} disabled={true} />

            <button type='submit'>Save</button>
          </form>
        </div>

        <div className='container'>
          <button className='logout-btn' onClick={() => logout()}>Logout</button>
        </div>
      </div>
   
    </div>
  )
}