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
        console.log(results.web3.eth.accounts[0]);
        this.setState({
          web3: results.web3,
          account: results.web3.eth.accounts[0]
        }) ;
  
        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.')
      });
    }
    

    verifyPubKey(newPubKey) {
      const deeIDaddress = this.userDetails.deeIDAddress;
      const contract = require('truffle-contract') ;
  
      // Get the contracts
      const deeIDPortal = contract(deeIDPortalContract) ;
      const deeID = contract(deeIDContract) ;

      const deeIDCon = this.state.web3.eth.contract(deeID.abi, deeIDaddress, {
        defaultAccount: this.state.account, // default from address
        defaultGasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });

      // using the promise
      deeIDCon.methods.lenKeys().call({from: this.state.account})
      .then((keysLen) => {
          for(let i=0; i < keysLen+1; i++) {
            deeIDCon.methods.getKey(i).call({from: this.state.account}).then((key) => {
              if(newPubKey === key) {
                console.log('Key found');
                return true;
              }
            });
          }
      });

      return false;
    }

    addPubKey(newPubKey) {
      const deeIDaddress = this.userDetails.deeIDAddress;
      const contract = require('truffle-contract') ;
  
      const deeID = contract(deeIDContract) ;

      const deeIDCon = this.state.web3.eth.contract(deeID.abi, deeIDaddress, {
        defaultAccount: this.state.account, // default from address
        defaultGasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });
  

  
      var deeIDConInstance;
  
      this.state.web3.eth.getAccounts((error, accounts) => {
        deeIDCon.deployed.then((instance) => {
          deeIDConInstance = instance ;
          return deeIDConInstance.addKey(newPubKey,"the key","hello").sendTransaction({from: accounts[0]})
        }).then((result) => {
          console.log(result);
        });
      });

    }

    instantiateContract() {
      /*
       * Get the user's deeID contract address
       * 
       */
  
      const contract = require('truffle-contract') ;
  
      // Get the contracts
      const deeIDPortal = contract(deeIDPortalContract) ;
      const deeID = contract(deeIDContract) ;

      deeIDPortal.setProvider(this.state.web3.currentProvider) ;
      deeID.setProvider(this.state.web3.currentProvider) ;
  
      /*
      if (typeof deeID.currentProvider.sendAsync !== "function") {
        deeID.currentProvider.sendAsync = function() {
            return deeID.currentProvider.send.apply(
              deeID.currentProvider, arguments
            );
        };
      }

      if (typeof deeIDPortal.currentProvider.sendAsync !== "function") {
        deeIDPortal.currentProvider.sendAsync = function() {
            return deeIDPortal.currentProvider.send.apply(
              deeIDPortal.currentProvider, arguments
            );
        };
      }
      */

      // Declaring this for later so we can chain functions
      var deeIDPortalInstance, deeIDInstance;

      // Get accounts.
      this.state.web3.eth.getAccounts((error, accounts) => {
        deeIDPortal.deployed().then((instance) => {
          console.log(accounts);
          deeIDPortalInstance = instance;
          return deeIDPortalInstance.returnID.call({from: accounts[0]});
        }).then((result) => {
          console.log("Return statement: " + result[0]);
          console.log("deeID Address: " + result[1]);
          if(result[0] === false) // user doesn't exist, we need to create an id
          {
            console.log('User doesnt exist, attempting to create user') ;
            this.userDetails.registered = false;
            return false;
          } else {
            console.log('User exists, moving on...');
            this.userDetails.registered = true;
            this.userDetails.deeIDAddress = result[1];
            this.forceUpdate();
            console.log('Connecting to deeID contract to get info');
            deeIDInstance = deeID.at(result[1]);
            //this.addPubKey('my public key');
            //this.verifyPubKey('0x6751c5563A62675Ffba7D3220f883c719b7B9F49');
          }

          
        /*
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
        */
      });
      });
    }
  }

  export default userInitialisation;