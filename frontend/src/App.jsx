import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import CustomAlert from './component/CustomAlert'
import Shorts from './Pages/Shorts/Shorts'
import GetCurrentUser from './customHooks/GetCurrentUser'

export const serverUrl = "http://localhost:8000"

const App = () => {
  GetCurrentUser()
  return (
    <>
    <CustomAlert/>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path='/shorts' element={<Shorts/>}/>
        </Route>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>

      </Routes>
    </>
  )
}

export default App
