import React, {Component} from "react";
import Web3 from 'web3';
import WakandaContract from "../abis/WakandaContract.json";

import "./App.css";


class VotingPage extends Component {

    constructor(props) {
        super(props);
        this.state = { web3: null,
            accounts: null,
            account: null,
            contract: null,
            tokensToVoteWith: null,
            participantSelected: null,
            data: [],
            candidates: [],
            top3: []};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async getCandidates(){
        fetch('http://localhost:3001/candidates')
            .then((response) => response.json())
            .then((responseJson) => {
                return this.setState({data: responseJson["candidates"]});
            })
            .catch((error) => {
                console.error(error);
            });
    }

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

    componentDidMount = async () => {
        try{
            await this.getCandidates();

        }catch (err){
            alert(
                `Failed to fetch json data!`,
            );
            console.error(err);
        }
    };

    handleChange(event) {
        this.setState({tokensToVoteWith: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();

        // changed to one voter = one vote max
        if(this.state.tokensToVoteWith > 0){
            if(this.state.participantSelected != null){
                const alreadyHasVoted = await this.state.contract.methods.voters(this.state.account).call()
                if(!alreadyHasVoted.hasVoted){
                    alert('You are voting for ' + this.state.data[this.state.participantSelected - 1].name + ", with " + this.state.tokensToVoteWith + " tokens!");
                    await this.state.contract.methods.vote(this.state.participantSelected).send({from: this.state.account})
                } else {
                    alert('You have already voted!');
                }
            }else {
                alert('Please select a candidate!');
            }
        } else {
            alert('You don\'t have enough tokens to vote with!');
        }
    }
    async handleClick(event) {
        event.preventDefault()
        this.state.top3 = await this.state.contract.methods.winningCandidates().call()

        this.forceUpdate();
    }

    handleSelectionChange = (e) => {
        e.preventDefault()
        this.setState({participantSelected: (Number(e.target.value) + 1)});
    }

    render() {
        let optionItems = this.state.data.map((item, index) =>
            <option key={index} value={index}>{item.name + ", " + item.age + ", " + item.cult}</option>
        );
        return (
            <div className="App">
                <h1>VOTE PAGE</h1>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Enter amount of WKND tokens to be spent for voting </label>
                        <input onChange={this.handleChange}/>
                        <input type="submit" value="Vote" />
                    </form>
                </div>
                <br/>
                <form onSubmit={this.handleClick}>
                    <b>Top Candidates</b>
                    <ol>
                        {this.state.top3[0] != null && <li>{this.state.top3[0]}</li>}
                        {this.state.top3[1] != null && <li>{this.state.top3[1]}</li>}
                        {this.state.top3[2] != null && <li>{this.state.top3[2]}</li>}
                    </ol>
                    <input type="submit" value="Show Leads" />
                </form>
                <br/>
                <b>Candidates</b>
                <div>
                    <select onChange={this.handleSelectionChange}>
                        {optionItems}
                    </select>
                </div>
            </div>
        );
    }
}

export default VotingPage;