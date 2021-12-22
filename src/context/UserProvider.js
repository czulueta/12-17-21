import React, { useState } from "react" 
import axios from "axios"

export const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  config.headers.Authorization = `Bearer: ${token}`
  return config
})

export default function UserProvider(props){
  const initState = { 
    user: JSON.parse(localStorage.getItem("user")) || {}, 
    token: localStorage.getItem("token") || "", 
    todos:[], 
    errMsg: "" 
  }
  const [ userState, setUserState ] = useState(initState)

  function singup(credentials){
    axios.post("/auth/singup", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token")
        localStorage.setItem("user", JSON.stringify(user))
        setUserState(prevState => ({
          ...prevState,
          user, 
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }
  function login(credentials){
    axios.post("/auth/login", credentials)
      .then(res => {
        const { user, token } = res.data
        localStorage.setItem("token")
        localStorage.setItem("user", JSON.stringify(user))
        getUserTodos()
        setUserState(prevState => ({
          ...prevState,
          user, 
          token
        }))
      })
      .catch(err => handleAuthErr(err.response.data.errMsg))
  }
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUserState({
      user:{},
      token:"",
      todos:[]
    })
  }
  function resetAuthErr(){
    setUserState(prevState => ({
      ...prevState,
      errMsg: ""
    }))
  }
  function handleAuthErr(){
    setUserState(prevState => ({
      ...prevState,
      errMsg
    }))
  }
  function addTodo(newTodo){
    userAxios.post("/api/todo", newTodo)
      .then(res => {
        setUserState(prevState => ({
          ...prevState,
          todos: [...prevState.todos, res.data]
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }
  function getUserTodos(){
    userAxios.get("/api/todo/user")
      .then(res => {
        setUserState(prevState => ({
          ...prevState,
          todos: res.data
        }))
      })
      .catch(err => console.log(err.response.data.errMsg))
  }

  return(
    <UserContext.Provider
      value={{
        ...userState,
        singup,
        login,
        logout,
        addTodo,
        resetAuthErr
      }}>
      {props.children}
    </UserContext.Provider>
  )
}