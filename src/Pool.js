import React, { Component } from 'react';
import Navbar from './Navbar.js';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Icon from "react-crypto-icons";
import web3 from './web3';
import ReactDOM from 'react-dom';
import App from './App';
import Exchange from './Exchange.js';
import _exchange from './ExchangeSol.js';
import Vote from './Vote.js';



class Pool extends Component {

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          ethBalance: '0',
          value1: '',
          value2: '',
          token: 'Επιλέξτε νόμισμα',
          selectedToken: 0,
          selectedRate1: '',
          selectedRate2: '',
          poolEthDai: [], //πίνακας με διευθύνσεις οι οποίες έχουν κάνει κατάθεση στο pool
          pointerPoolEthDai: [], //πίνακας 
          stakes1: '0',
          stakes2: '0',
          stakes3: '0'
        };
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.withdrawStake = this.withdrawStake.bind(this);
      }


      onChange1(e){
        const re = /^[0-9]*([,.][0-9]*)?$/;
        if (e.target.value === '' || re.test(e.target.value)) {
           this.setState({value1: e.target.value})
        }
        
        if(this.state.token === "ETH" && this.state.token2 === "DAI") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[1]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "DAI" && this.state.token2 === "ETH") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "ETH" && this.state.token2 === "TSRD") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "TSRD" && this.state.token2 === "ETH") {
          this.setState({value2: e.target.value/this.state.rate[2]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "DAI" && this.state.token2 === "TSRD") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "TSRD" && this.state.token2 === "DAI") {
          this.setState({value2: e.target.value/this.state.rate[2]*this.state.rate[1]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token ===  this.state.token2 && this.state.token!=='Επιλέξτε νόμισμα') {
          this.setState({value2: e.target.value}, 
            () => {console.log(this.state.value2)}
            )
        }
      }

     

     onChange2(e){
      const re = /^[0-9]*([,.][0-9]*)?$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         this.setState({value2: e.target.value})
      }

      if(this.state.token === "ETH" && this.state.token2 === "DAI") {
        this.setState({value1: e.target.value*this.state.rate[0]/this.state.rate[1]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "DAI" && this.state.token2 === "ETH") {
        this.setState({value1: e.target.value*this.state.rate[1]/this.state.rate[0]}, 
          () => {console.log(this.state.value2)}
          )
      }
    }  

    change(token) {
      this.setState({token:token})
    };

    change2(token) {
      this.setState({token2:token})
    };

    
    onclick = async () => {
      

      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});


      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }
      else if(this.state.token === 'Επιλέξτε νόμισμα') {
        alert("Παρακαλώ επιλέξτε νόμισμα.")
      }
      else if(this.state.value1 === ''){
        alert("Παρακαλώ ορίστε ποσότητα.")
      }
      else if(isNaN(parseFloat(this.state.value1))) {
        alert("Οι τιμές δεν συμπληρώθηκαν σωστά.")
      }
     

      else {
        if(this.state.token === 'Token1') {this.setState({selectedToken:1})}
        if(this.state.token === 'Token2') {this.setState({selectedToken:2})}
        if(this.state.token === 'Token3') {this.setState({selectedToken:3})}
        {
          _exchange.methods.createStake(this.state.selectedToken,web3.utils.toWei(String(this.state.value1, 'ether'))).send(
            {
              from: accounts[0]
            }
          );
        }
      }
    }

    withdrawStake = async () => {

      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});

      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }

      else {

        const _stakes1 = await _exchange.methods.stakeOf(1, accounts[0]).call(); //καταθέσεις στο Token1
        const _stakes2 = await _exchange.methods.stakeOf(2, accounts[0]).call(); //καταθέσεις στο Token1
        const _stakes3 = await _exchange.methods.stakeOf(3, accounts[0]).call(); //καταθέσεις στο Token1

        this.setState({stakes1: _stakes1.toString()/1000000000000000000}); 
        this.setState({stakes2: _stakes2.toString()/1000000000000000000}); 
        this.setState({stakes3: _stakes3.toString()/1000000000000000000}); 
        
        if(this.state.stakes1 === 0 && this.state.stakes2 === 0 && this.state.stakes3 === 0) 
          {alert("Δεν έχετε υπόλοιπο στο pool.")}
        else {
          var answer = window.confirm("Θέλετε να κάνετε ανάληψη "
          + this.state.stakes1 + 
          " Token1 και " +
          this.state.stakes2 +
           " Token2 και " +
           this.state.stakes3 +
           " Token3;");
          if (answer) {
              _exchange.methods.removeStake().send({
                from:accounts[0]
              })
            }
          else {
            
          }
        }
      }
  }

    
    render() {

    return (

      <div>              
        <Navbar account={this.state.account}/>
            <div>
              <main role="main" className="col-lg-12 d-flex text-center align-items-center h-100" style={{paddingTop: 80}}>
                <div className="content mr-auto ml-auto" >
                  <Card
                    style={{
                      width: 600,
                      height: 500,
                    }}
                  >
                    <Button 
                        onClick={ () => {ReactDOM.render(<Exchange />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>SWAP</Button>
                    <Button 
                        onClick={ () => {ReactDOM.render(<Pool />, document.getElementById('root'))}}
                        variant="info" 
                        size="lg"
                        style={{
                          width: 200
                        }}>POOL</Button>
                    <Button 
                        onClick={ () => {ReactDOM.render(<Vote />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>VOTE</Button>
                    <CardContent>
                      <Typography variant="h4" component="h2">
                        Καταθέσεις
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 12,
                        }}
                        color="textSecondary"
                      >
                        Καταθέστε νομίσματα Eth και Dai!
                      </Typography>
                      <div class="form-group">
                      <div class="row align-items-center">
                          <div class="col-sm">
                            <input 
                            name= 'input1'
                            value={this.state.value1} 
                            onChange={this.onChange1}
                            placeholder="0.0"
                            style={{
                              margin: 20,
                              borderRadius:20,
                              height: 100,
                              width: 300,  
                            }}/> <br/>
                          </div>
                          <div class="col-sm">
                            <Dropdown>
                              <Dropdown.Toggle
                               variant="success" 
                               id="dropdown-basic"
                               style={{
                                width: 160
                                
                               }}
                               >
                                <text>{this.state.token}</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),
                                  this.change("Token1"), this.setState({selectedRate1:0}))}>
                                  <Icon name="Token1" size={25} /> Token1 </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),
                                  this.change("Token2"), this.setState({selectedRate1:1}))}>
                                  <Icon name="Token2" size={25} /> Token2 </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),
                                  this.change("Token3"), this.setState({selectedRate1:2}))}>
                                  <Icon name="Token3" size={25} /> Token3</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      
                      </div>
                     
                    </CardContent>
                    
                      <div className="d-grid gap-2">
                        <Button 
                        onClick={this.onclick}
                        variant="outline-warning" 
                        size="lg"
                        style={{
                          width: 400
                        }}>Κατάθεση</Button>
                      </div>
                      <div className="d-grid gap-2" style={{paddingTop: 20}}>
                        <Button 
                        onClick={this.withdrawStake}
                        variant="outline-info" 
                        size="md"
                        style={{
                          width: 300
                        }}>Κάντε ανάληψη των καταθέσεων σας.</Button>
                        
                      </div>
                  </Card>
              </div>
            </main>
          </div>
      </div>
    );
    }
}
export default Pool; 