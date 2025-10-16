import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import CustomAlert from './component/CustomAlert'
import Shorts from './Pages/Shorts/Shorts'
import GetCurrentUser from './customHooks/GetCurrentUser'
import MobileProfile from './component/MobileProfile'
import ForgetPassword from './Pages/ForgetPassword'
import CreateChannel from './Pages/Channel/CreateChannel'
import ViewChannel from './Pages/Channel/ViewChannel'

export const serverUrl = "http://localhost:8000"

const App = () => {
  GetCurrentUser()
  return (
    <>
    <CustomAlert/>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path='/shorts' element={<Shorts/>}/>
          <Route path='/mobilepro' element={<MobileProfile/>}/>
          <Route path='/viewchannel' element={<ViewChannel/>}/>
        </Route>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/forgetpass' element={<ForgetPassword/>}/>
        <Route path='/createchannel' element={<CreateChannel/>}/>

      </Routes>
    </>
  )
}

export default App
