import React, { useState } from 'react'
import { Input } from 'antd';
import { Button } from '@mui/material';
import "antd/dist/antd.css";
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import './Auth.css'
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


function Auth() {

    useEffect(() => {

        
      if(localStorage.getItem('information')!==null && localStorage.getItem('information')!==undefined)
      {
          navigate('/home')
      }
      console.log(localStorage.getItem('information'))
            

    }, []) 
    

    
   const [user, setUser] = useState({
    email: "",
    password: ""
  });
   const navigate=useNavigate();
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
  });
   
  const validateForm = async (event) => {

    event.preventDefault();
    const result = schema.validate(user);
    console.log(result); 
    const { error } = result;
    if (!error) {
       await axios.post("https://ev-mn-ss.herokuapp.com/user/login", user,{withCredentials:true}).then((data)=>{

            console.log(data.data.user.email)
                localStorage.setItem('information',JSON.stringify(data.data.user))

                console.log(JSON.parse(localStorage.getItem('information')))

            navigate('/home')
        }).catch((err)=>{
            toast.error(err.response.data.message)
        }) 

    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      console.log(errors);
      setErrors(errorData);
      console.log(errors);
      if(("email" in errors))
      {
        toast.error(errors.email)
      }
      else{
        toast.error('enter a valid password')
      }
    }
  };
  
 
  
  const handleSave = (event) => {
    const { name, value } = event.target;

    let errorData = { ...errors };
    const errorMessage = validateProperty(event);
    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }  
    let userData = { ...user };
    userData[name] = value;
    setUser(userData); 
    setErrors(errorData);
  }; 
  
  const validateProperty = (event) => {
    const { name, value } = event.target;
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const result = schema.validate(obj, subSchema, { abortEarly: false });
    const { error } = result;
    return error ? error.details[0].message : null;
  };

    
  return (
    <div className='head'>
        <form action="" className='form' onSubmit={(e)=>{validateForm(e);}}>
            <div className='category'>
                <div className={`login select}`}>
                    Login
                </div>
            </div>
            <h3 className='titled'>
                Welcome Back :)
                </h3>
                <div className='input'>
                <div className="mb-3">
                <Input 
                name='email'
                placeholder="Email"
                addonBefore={<MailOutlined />} 
                value={user.email}
                onChange={handleSave}
                />
                </div>
                
                <div className="mb-3">
                <Input
                name='password'
                placeholder="Password"
                addonBefore={<LockOutlined />}
                value={user.password}
                type='password'
                onChange={handleSave}
                    />
                </div>
                </div>

                <Button variant="outlined" type='submit' className='submit'>Login</Button>
                <ToastContainer />

        </form><br />
        <Button onClick={()=>{navigate('/home')}}>Browse without login <span><ArrowForwardIosIcon/></span></Button>
    </div>
  )
}

export default Auth