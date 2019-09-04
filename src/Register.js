import React, { Component } from 'react'

// Blockchain Specifics
// Contracts and JSONRPC Library
import deeIDPortalContract from '../build/contracts/deeIDPortal.json'
import deeIDContract from '../build/contracts/deeID.json'
import getWeb3 from './utils/getWeb3'

// Router
import {
    BrowserRouter as Router,
} from "react-router-dom";


import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import userInitialisation from './userInitialisation';

class userRegistration extends userInitialisation {
  constructor(props) {
      super(props);

      this.state = {
        'firstname': '',
        'surname': '',
        'email': '',
        'nhsnumber': '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('Attempting to create a new deeID identity');
    event.preventDefault();

    const contract = require('truffle-contract') ;

    const deeIDPortal = contract(deeIDPortalContract) ;
    const deeID = contract(deeIDContract) ;
    
    deeID.defaults({ 
      gas: 4712388,
      gasPrice: 100000000000
    });

    deeIDPortal.defaults({
      gas: 4712388,
      gasPrice: 100000000000
    });

    deeIDPortal.setProvider(this.web3.currentProvider) ;
    deeID.setProvider(this.web3.currentProvider) ;

    var deeIDPortalInstance, deeIDInstance;

    this.web3.eth.getAccounts((error, accounts) => {
      deeIDPortal.deployed().then((instance) => {
        deeIDPortalInstance = instance ;
        return deeIDPortalInstance.createID.sendTransaction({from: accounts[0]})
      }).then((result) => {
        console.log(result)
      }, reason => {
        console.log(reason); // Error!
      });
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  registerForm() {
      return (
        <div className="row my-3 p-3 bg-white rounded box-shadow justify-content-md-center">
          <div className="col-md-12">
            <h3>Welcome,</h3>
            <p>The thing is... you can't have your personal information on the Blockchain! You need our cool mobile phone app. You can register now and using the same public-private key pair login on your phone and initiatilise your details from there? Too much..? well we can also host your data for you if you want?</p>
            Your Ethereum address: <br />
            <p className="address">{this.userDetails.accountAddress}</p>

            <form onSubmit={this.handleSubmit}>
              <button type="submit" className="btn btn-primary">Create a blank deeID</button>
            </form>
          </div>
        </div>
      )
    }
  render() {
    var form = 'Loading...'
    if (!this.userDetails.registered) {
      form = this.registerForm();
    } else {
      form = this.registeredMsg();
    }
    return (
      <div>
        {form}
      </div>
    );
  }
}
export default userRegistration ;