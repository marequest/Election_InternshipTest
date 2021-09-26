import React, { Component } from "react";
import WakandaContract from "../abis/WakandaContract.json";

import "./App.css";
import Web3 from "web3";

class App extends Component {
  state = {web3: null, accounts: null, account: null, contract: null };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    this.setState({web3: web3})
    // Load account
    const accountWeb3 = await web3.eth.getAccounts()
    this.setState({account: accountWeb3[0]})

    const addressField = document.getElementById("address")
    addressField.innerHTML = " " + accountWeb3[0]
    web3.eth.getBalance(this.state.account, function(err, result) {
      if (err) {
        console.log(err)
      } else {
        const val = document.getElementById("value")
        var res = web3.utils.fromWei(result, "ether")
        val.innerHTML = parseFloat(res).toFixed(2) + " ETH"
      }
    })

    const networkId = await web3.eth.net.getId()
    const networkData = await WakandaContract.networks[networkId]
    if(networkData) {
      const abi = WakandaContract.abi
      const address = networkData.address
      const contractWeb3 = new web3.eth.Contract(abi, address)

      this.setState({contract: contractWeb3})

    } else {
      window.alert('Smart contract not deployed to detected network')
    }
  }

  render() {
    return (
      <div className="App">
        <h1>ELECTION</h1>
      </div>
    );
  }
}

export default App;
