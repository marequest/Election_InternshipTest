import React from 'react'
import {NavLink} from 'react-router-dom';
import './App.css';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200&display=swap" rel="stylesheet"/>
            <div id="navbar" className="container px-4 px-lg-5" >
                <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4" >
                        <li><NavLink exact to="/" activeStyle = {{color: "black"}}>Home</NavLink></li>
                        <li><NavLink exact to="/register" activeStyle = {{color: "black"}}>Register</NavLink></li>
                        <li><NavLink to="/vote" activeStyle={{color: 'black'}}>Vote</NavLink></li>
                    </ul>
                    <div className="acc">
                        <button id = "value">Value</button>
                        <button id = "address" style = {{textOverflow: 'ellipsis', width: '330px', overflow: 'hidden', marginRight: '20px'}}/>
                    </div>
                </div>
            </div>
        </nav>
    )
}