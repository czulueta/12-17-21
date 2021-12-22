import React from "react" 

export default function Navbar(props){
  const { logout } = props
  return(
    <div>
      <Link>Profile</Link>
      <Link>Pubic</Link>
      <button logout={logout}>Logout</button>
    </div>
  )
}