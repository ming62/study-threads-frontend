import React, { Component } from 'react';
import Example from "./../images/example.jpg";
import "./styles/Home.css";


export default class Home extends Component {
  render() {
    return (
      <div className='text-center'>
      <h2>Home</h2>
      <hr />

      <img src = {Example}  alt="example" />

      <hr />

      <div className='example'></div>
      </div>
    );
  }
}