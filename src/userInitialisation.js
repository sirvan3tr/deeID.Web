import React, { Component } from 'react'

// Blockchain Specifics
// Contracts and JSONRPC Library
import deeIDPortalContract from '../build/contracts/deeIDPortal.json'
import deeIDContract from '../build/contracts/deeID.json'
import getWeb3 from './utils/getWeb3'

class userInitialisation extends Component {
    constructor(props) {
      super(props);
      this.userDetails = {
        registered: false,
        accountAddress: null,
        name: null,
        surname: null,
        email: null,
        nhsNumber: null,
        deeIDAddress: null
      };

      this.state = {
        web3: null,
        account: null
      };

      this.web3 = null;
    }
  
    // Define all user detials
    setUser(_name, _surname, _em, _nhsN) {
      this.userDetails.name = _name
      this.userDetails.surname = _surname;
      this.userDetails.email = _em;
      this.userDetails.nhsNumber = _nhsN;
    }
    
    // not signed in message
    registeredMsg() {
      return 'You are already regsitered!';
    }

    // Get and mount Web3
    componentWillMount() {
      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.
      getWeb3
      .then(results => {
        this.userDetails.accountAddress = results.web3.eth.accounts[0];
        this.web3 = results.web3;
        this.setState({
          web3: results.web3,
          account: results.web3.eth.accounts[0]
        }) ;
  
        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
    }
  
    instantiateContract() {
      /*
       * Authenticate the user
       *
       * Need to be part of a state management library (redux or MobX)
       * 
       */
  
      const contract = require('truffle-contract') ;
  
      // Get the contracts
      const deeIDPortal = contract(deeIDPortalContract) ;
      const deeID = contract(deeIDContract) ;

      deeIDPortal.setProvider(this.state.web3.currentProvider) ;
      deeID.setProvider(this.state.web3.currentProvider) ;
  
      // Declaring this for later so we can chain functions
      var deeIDPortalInstance, deeIDInstance ;

      // Get accounts.
      this.state.web3.eth.getAccounts((error, accounts) => {
        deeIDPortal.deployed().then((instance) => {
          deeIDPortalInstance = instance
          return deeIDPortalInstance.userExists.call({from: accounts[0]})
        }).then((result) => {
          console.log("------>" + this.userDetails.accountAddress + "dd")
          if(result.c[0] === 1) // user doesn't exist, we need to create an id
          {
            console.log('User doesnt exist, attempting to create user') ;
            this.userDetails.registered = false;
          } else {
            console.log('User exists, moving on...');
            this.userDetails.registered = true;
          }
        }).then((result) => {
          console.log('Getting deeID address');
          // get the deeID ID
          return deeIDPortalInstance.id.call({from: accounts[0]})
        }).then((result) => {
          console.log(result);
          this.userDetails.deeIDAddress = result;
          console.log('Connecting to deeID contract to get info');
          deeIDInstance = deeID.at(result);
          return deeIDInstance.getInfo.call({from: accounts[0]})
        }).then((result) => {
          console.log(result);
          if (result === undefined || result === null || result[0] === "") {
            console.log('No user info found')
          } else {
            console.log('User info found') ;
            this.setUser(result[0], result[1], result[2], result[3].c[0]);
            this.forceUpdate()
          }
        })
      })
    }
  };

  export default userInitialisation;