import React, { useState } from 'react'
import button from './button.css';
import Form from 'react-bootstrap/Form';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useWallet from '../security/useWallet';

const Register = () => {
    const [fname,setFName] = useState("");
    const [fprice,setFPrice] = useState("");
    const [ftitle,setFTitle] = useState("");
    const [fdecription,setFDescription] = useState("");

    const [file,setFile] = useState("");

    const {account} = useWallet();

    const history = useNavigate();

    const setnamedata = (e)=>{
        
        setFName(e.target.value)
    }
    const settitledata = (e)=>{
        
        setFTitle(e.target.value)
    }
    const setpricedata = (e)=>{
        
        setFPrice(e.target.value)
    }
    const setdesdata = (e)=>{
        
        setFDescription(e.target.value)
    }
    const setimgfile = (e)=>{
        setFile(e.target.files[0])
    }

    const addProductData = async(e)=>{
        e.preventDefault();

        var formData = new FormData();
        formData.append("photo",file);
        formData.append("fname",fname);
        formData.append("fseller", account);
        formData.append("fprice",fprice);
        formData.append("ftitle",ftitle);
        formData.append("fdescription",fdecription);


        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }

        const res = await axios.post("/api/register",formData,config);
        if(res.data.status === 201){
            history("/")
        }else{
            console.log("error")
        }
    }


   

    return (
        <>
            <div className='container mt-3'>
                <h1 style={{fontWeight: "bold", marginBottom: 20}}>Upload Your Book Here</h1>
                <Form>
                    {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>UserName</Form.Label>
                        <Form.Control type="text" name='fname' onChange={setnamedata}/>
                    </Form.Group> */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name='ftitle' onChange={settitledata}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name='fprice' onChange={setpricedata}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name='fdecription' onChange={setdesdata}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Select Your Image</Form.Label>
                        <Form.Control type="file" name='photo' onChange={setimgfile} />
                    </Form.Group>
                    <button className='button' variant="primary" type="submit" onClick={addProductData} >
                        Submit
                    </button>
                </Form>
        </div>
        </>
    )
}

export default Register;