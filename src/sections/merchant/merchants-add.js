import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { TextField, Button , InputLabel} from '@mui/material';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
 
const AddMerchantForm = () => {

  const [zones, setZones] = useState([]);

  useEffect(() => {
    const getZonesData = async () => {
//    let base64 = require('base-64')
    // let username = 'vinothgopi'
    // let password = 'password'
    let headers = new Headers()
    // headers.append('Authorization', 'Basic dGVzdDpwYXNzd29yZA==')
      const response = await fetch('http://localhost:8080/api/v1/zone', {
        method: "GET",
        headers: headers});
      const data = await response.json();
      console.log(data)
      setZoneLoaded(true);
      setZones(data);
    };
    getZonesData();
  }, []);

  const [merchantName, setMerchantName] = useState('');
  const [description, setDescription] = useState('');
  const [addressFirstLine, setAddressFirstLine] = useState('');
  const [addressSecondLine, setAddressSecondLine] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState(0);

  const [isZoneLoaded, setZoneLoaded] = useState('');

  const postMerchant = async (request) => {
    //    let base64 = require('base-64')
        // let username = 'vinothgopi'
        // let password = 'password'
        let headers = new Headers()
        const req = JSON.stringify(request)
        headers.append("content-type", "application/json");
        // headers.append('Authorization', 'Basic dGVzdDpwYXNzd29yZA==')
          const response = await fetch('http://localhost:8080/api/v1/merchants', {
            method: "POST",
            headers: headers,
            body: req});
          const data = await response.json();
          console.log(data)
          
        };

  const onSubmitFunction = () => {
    var request = {
      name: merchantName,
      description: description,
      addressFirstLine, addressFirstLine,
      addressSecondLine, addressSecondLine,
      city: city,
      zoneId: zone,
      pinCode: pinCode,
      state: state,
      phone: phone,
      commissionFrom: "TEST",
      commissionRate: 0.0
    };
    
    console.log(request);
    postMerchant(request);
  }

  const handleChange = (e) => {
    setZone(e.target.value);
  }

  return (
    <div>
      <form>
      {
        isZoneLoaded && 
        <InputLabel id="demo-simple-select-label">Zone</InputLabel> 
      }
      { isZoneLoaded && <Select
        variant="standard"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={zone}
        label="Zone"
        onChange={handleChange}
      
        style={{width:"30%"}}>
          {
            zones.map((z) => {
              return <MenuItem value={z.id}>{z.name}</MenuItem>
            })
          }
        
      </Select>
      }
       <TextField id="outlined-basic" label="Merchant Name" variant="standard" value={merchantName} onChange={(event) => {
        setMerchantName(event.target.value);
       }}/>
       <TextField id="outlined-basic" label="Description" variant="standard" value={description} onChange={event => setDescription(event.target.value)}/>
       <TextField id="outlined-basic" label="Address First Line" variant="standard" 
        value={addressFirstLine}
        onChange={event => setAddressFirstLine(event.target.value)}
       />
       <TextField id="outlined-basic" label="Address Second Line" variant="standard" 
       value={addressSecondLine}
       onChange={event => setAddressSecondLine(event.target.value)}
       />
       <TextField id="outlined-basic" label="City" variant="standard"
       value={city}
       onChange={event => setCity(event.target.value)}
       />
       <TextField id="outlined-basic" label="Pin Code" variant="standard" 
       value={pinCode}
       onChange={event => setPinCode(event.target.value)}
       />
       <TextField id="outlined-basic" label="State" variant="standard" 
        value={state}
        onChange={event => setState(event.target.value)}
       />
       <TextField id="outlined-basic" label="Phone Number" variant="standard" 
        value={phone}
        onChange={event => setPhone(event.target.value)}
       />
       <Button onClick={onSubmitFunction} variant="contained">Add Merchant</Button>
      </form>
    </div>
  );
};

export default AddMerchantForm;