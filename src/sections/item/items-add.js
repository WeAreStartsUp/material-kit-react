import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { TextField, Button , InputLabel} from '@mui/material';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
 
const AddItemForm = () => {

  const [merchants, setMerchants] = useState([]);
  const [isMerchantLoaded, setMerchantLoaded] = useState(false);

  useEffect(() => {
    const getMerchantsData = async () => {
    let headers = new Headers()

      const response = await fetch('http://localhost:8080/api/v1/merchants', {
        method: "GET",
        headers: headers});
      const data = await response.json();
      console.log(data)
      setMerchantLoaded(true);
      setMerchants(data);
    };
    getMerchantsData();
  }, []);

  const [itemRequest, setItemRequest] = useState({
    name: '',
    description: '',
    price: 0.0,
    merchantId: 0,
    category: '',
    tags: '',
    isVeg: 0,
    customTax:0.0,
    customCommission:0.0
  });

  const postItem = async (request) => {
    //    let base64 = require('base-64')
        // let username = 'vinothgopi'
        // let password = 'password'
        let headers = new Headers()
        const req = JSON.stringify(request)
        headers.append("content-type", "application/json");
        // headers.append('Authorization', 'Basic dGVzdDpwYXNzd29yZA==')
          const response = await fetch('http://localhost:8080/api/v1/items', {
            method: "POST",
            headers: headers,
            body: req});
          const data = await response.json();
          console.log(data)
          
        };

  const onSubmitFunction = () => {
    
    console.log(itemRequest);
    postItem(itemRequest);
  }

  const handleChange = (e) => {
    setItemRequest({
      ...itemRequest,
      [e.target.name] : e.target.value
    })
  }

  return (
    <div>
      <form>
      {
        isMerchantLoaded && 
        <InputLabel id="demo-simple-select-label">merchant</InputLabel> 
      }
      { isMerchantLoaded && <Select
        variant="standard"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name="merchantId"
        value={itemRequest.merchantId}
        label="Merchant"
        onChange={handleChange}
      
        style={{width:"30%"}}>
          {
            merchants.map((m) => {
              return <MenuItem value={m.id}>{m.name} - {m.zones.name}</MenuItem>
            })
          }
        
      </Select>
      }
       <TextField id="outlined-basic" label="Item Name" name='name' variant="standard" value={itemRequest.name} onChange={handleChange}/>
       <TextField id="outlined-basic" label="Description" name='description' variant="standard" value={itemRequest.description} onChange={handleChange}/>
       <TextField id="outlined-basic" label="Price" name='price' variant="standard" 
        value={itemRequest.price}
        onChange={handleChange}
       />
       <TextField id="outlined-basic" label="Category" name='category' variant="standard" 
       value={itemRequest.category}
       onChange={handleChange}
       />
       <TextField id="outlined-basic" label="Tags" variant="standard" name='tags'
       value={itemRequest.tags}
       onChange={handleChange}
       />
       {/* <TextField id="outlined-basic" label="Veg/Non Veg" variant="standard" 
       value={pinCode}
       onChange={event => setPinCode(event.target.value)}
       /> */}
       <Select
        variant="standard"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name="isVeg"
        value={itemRequest.isVeg}
        label="Veg/Non Veg"
        onChange={handleChange}
      
        style={{width:"30%"}}>
          <MenuItem value={1}>Veg</MenuItem>
          <MenuItem value={0}>Non Veg</MenuItem>
      </Select>
       <TextField id="outlined-basic" label="Custom Tax" name='customTax' variant="standard" 
        value={itemRequest.customTax}
        onChange={handleChange}
       />
       <TextField id="outlined-basic" label="Custom Commission" variant="standard" 
        name='customCommission'
        value={itemRequest.customCommission}
        onChange={handleChange}
       />
       <Button onClick={onSubmitFunction} variant="contained">Add Item</Button>
      </form>
    </div>
  );
};

export default AddItemForm;