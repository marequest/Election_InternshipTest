import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

import Header from './components/Header'
import RegistrationPage from './components/RegistrationPage';
import VotingPage from './components/VotingPage';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

const Routing = () => {
    return(
        <Router>
            <Header/>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/register" component={RegistrationPage} />
                <Route path="/vote" component={VotingPage} />
            </Switch>
        </Router>
    )
}

ReactDOM.render(<Routing />, document.getElementById('root'));

