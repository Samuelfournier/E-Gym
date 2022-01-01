import axios from 'axios';
import Main from './Main'
import Header from './Main'
import { useState, useEffect } from 'react'
import {userContext} from '../js/components/_services/context/userContext'
import Cookies from 'js-cookie'

function App() {
  return (
    <>
      <Main />
    </>
  )
}

export default App;
