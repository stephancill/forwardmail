import React, { useState } from 'react';
import './App.css';

export interface User {
  name: string;
  email: string;
}

export default function App() {

  let [user, setUser] = useState<User>()

  return (
    <div className="App">
      {
        user ? <div>{user.name}</div> : <div>Not logged in</div>
      }

      <button onClick={() => setUser({name: "John", email: "john@forwardmail.rocks"})}>Login</button>
    </div>
  );
}
