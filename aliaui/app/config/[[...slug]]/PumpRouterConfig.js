import React, { useState } from 'react';

export default function PumpRouterConfig(props) {
    const [nameValue, setName] = useState("");
    const [sbcPortValue, setsbcPort] = useState("");
    const [relayPortValue, setrelayPort] = useState("");

    const updateRoutersData = props.fetchRoutersData

    const addRouterName = () => {
      fetch("http://localhost:8000/add-router/"+nameValue+"/"+sbcPortValue+"/"+relayPortValue)
        .then(response => {
          return response.json()
        })
        .then(data => {
          updateRoutersData()
        })
    }



    return (
      <div>
          <p>New route -- 
          SN: <input type="text" id="" name="sbc" required  minlength="0" maxlength="10" value={nameValue} size="10" onChange = {
              e => setName(e.target.value)
            } /> 
            PUMP

            PORT SBC:<input type="text" id="" name="sbc" required  minlength="0" maxlength="10" value={sbcPortValue} size="10" onChange = {
              e => setsbcPort(e.target.value)
            }/> 
            PORT RELAY <input type="text" id="" name="sbc" required  minlength="0" maxlength="10" value={relayPortValue} size="10" onChange = {
              e => setrelayPort(e.target.value)
            }/> 
            <button type="button" onClick={e => addRouterName()}>ADD</button></p>
          
      </div>
    )
  
  }