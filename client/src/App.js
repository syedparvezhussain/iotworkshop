import React, { useEffect, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";


function App() {
const [data, setData] = useState("");
const [arrayOfMessages, setArrayOfMessages]= useState([])

  useEffect(() => {
    
    const socket = io("http://localhost:5000");
    socket.on("connect", () => console.log(socket.id));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("Event", (data) => {

    setData(data);
    const x= arrayOfMessages
      x.push(data)  
    setArrayOfMessages(x)
    }
      );
    socket.on("disconnect", () => setData("server disconnected"));
  }, []);


  return (
    <div>
<div>Hi this is my first code</div>
   
      
    </div>
 
  );
}

export default App;
