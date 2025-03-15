import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
function Saniya() {
    const [name, setName] = useState(" ")


    function getData() {

        axios.get("http://localhost:3000/data").then((response) => {
            setName(response.data)
        })
    }
    return <div>
        <Navbar />
        <button onClick={() => {
            getData()
        }}>Get Data</button>
        <p>Name:{name}</p>
    </div>
}

export default Saniya;