import axios from 'axios'
import React, { useState } from 'react'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await axios.post("http://localhost:3000/api/auth/register",
      {username, email, password}
    );

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Enter username"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter password"
        />
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register
