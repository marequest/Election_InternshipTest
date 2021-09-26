import React, {Component} from "react";
import WakandaContract from "../abis/WakandaContract.json";
import WKNDContract from "../abis/WKND.json";


import "./App.css";
import Web3 from "web3";

class RegistrationPage extends Component {

    constructor(props) {
        super(props);
        this.state = {web3: null, accounts: null, account: null, contract: null, ethAddress: '', wkndContract: null };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
        await this.getTokenInstance();
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

    async getTokenInstance(){

        const networkId = await this.state.web3.eth.net.getId()
        const networkData = await WKNDContract.networks[networkId]
        if(networkData) {
            const abi = WKNDContract.abi
            const address = networkData.address
            const contractWeb3 = new this.state.web3.eth.Contract(abi, address)

            this.setState({wkndContract: contractWeb3})

        } else {
            window.alert('Smart contract not deployed to detected network')
        }
    }

    handleChange(event) {
        this.setState({ethAddress: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        //On first register give 1 WKND token
        const addr = this.state.ethAddress
        const hasBeenRegistered = await this.state.contract.methods.registeredVoter(addr).call()
        if(hasBeenRegistered === false){
            //Do the mint
            await this.state.contract.methods.registerVoter(addr).send({from: addr})
            await this.state.wkndContract.methods.mint(addr, 1).send({from: addr})
        } else {
            alert('This address has already taken voting token!');
        }
    }

    render() {
        return (
            <div className="App">
                <h1>REGISTRATION PAGE</h1>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Enter your ETH adress to get WKND token </label>
                        <input placeholder="0xaA1bB2cC3dD4..." onChange={this.handleChange}/>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}

export default RegistrationPage;