import React, { Component } from "react";

import deeIDPortalContract from '../../build/contracts/deeIDPortal.json'
import deeIDContract from '../../build/contracts/deeID.json'
import getWeb3 from '../utils/getWeb3'

//import userInitialisation from '../userInitialisation';

class CreateUser extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log('my web3 is at CreateUserrrrrrrrrrr');
        console.log(this.props.web3);
    }

helloW() {
    //alert('A name was submitted: ' + this.state.firstname);
    //event.preventDefault();

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

    deeIDPortal.setProvider(this.props.web3.currentProvider) ;
    deeID.setProvider(this.props.web3.currentProvider) ;

    var deeIDPortalInstance, deeIDInstance;

    this.web3.eth.getAccounts((error, accounts) => {
        deeIDPortal.deployed().then((instance) => {
        deeIDPortalInstance = instance ;
        return deeIDPortalInstance.createID.sendTransaction({from: accounts[0]})
            //1, 'Sirvan', 'Almasi', 'email', '9876544321', {from: accounts[0]})
        }).then((result) => {
        console.log(result)
        })
    })
    }

  render() {
    this.helloW();
    return (
      <div>
        <h2>Lets create some users</h2>
        <h2>{this.props.name}</h2>
        <p>
          Hello world
        </p>
      </div>
    );
  }
}
 
export default CreateUser;