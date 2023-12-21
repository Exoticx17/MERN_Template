import '../stylesheets/navbar.css'
import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Lightning from '../photos/lightning.png'
import {useSpring, animated} from 'react-spring'

const Navbar = () => {

    const [cookie,setCookie] = useCookies()
    const jwt = cookie.jwt
    let userId = localStorage.getItem('userid')
    const [data,setData] = useState([])
    const [pdata,setPData] = useState([])
    useEffect( () => {
        if(jwt){
            fetch(`http://localhost:5000/user/one/${userId}`,{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                redirect: 'follow',
                credentials: 'include'
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                setPData(data)
            }) 
          
        }
    })

    
    const onSubmit = async () =>{
        try {
            
            fetch('http://localhost:5000/user/logout',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                redirect: 'follow',
                credentials: 'include'
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                setData(data)
            })
            .then(() => {
                window.setTimeout(() => {
                    window.location.assign('/login')
                },200)
            })
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    return ( 
        <div className='landing-nav'>
            <Link to='/landing' ><img className='icon' src={Lightning}/></Link>
            <Link to='/landing' className='savitar'>Savitar</Link>
            <Link to='/files' className={!jwt ?'xfiles' : 'filess'}>Files</Link>
            <Link to='/votes' className={!jwt ? 'xvoting' : 'voting'}>Voting</Link>
            <Link to='/basic' className={!jwt ? 'xbasic' : 'vbasic'}>Basic</Link>
            <Link to='/user' className={!jwt ? 'xuser' : 'vuser'}>User</Link>
            <Link to='/login' className={jwt ? 'hide' : 'xlogin'}>Login</Link>
            <Link to='/signup' className={jwt ? 'hide' : 'xsignup'}>Signup</Link>
            <h6 className={jwt ? 'xlogout' : 'hide'} onClick={onSubmit}>Logout</h6>
    </div>
     );
}
 
export default Navbar;