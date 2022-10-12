import React, { Component } from 'react';
import Navbar from './Navbar.js';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Icon from "react-crypto-icons";
import _exchange from './ExchangeSol.js';
import web3 from './web3';
import ReactDOM from 'react-dom';
import App from './App';
import Pool from './Pool.js';
import Vote from './Vote.js';
 

class Exchange extends Component {

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          ethBalance: '0',
          value1: '',
          value2: '',
          token: 'Επιλέξτε νόμισμα',
          token2: 'Επιλέξτε νόμισμα',
          rate: [, ,], //Μας δείχνει πόσα tokens παίρνει κάποιος με 1 eth (με την σειρά των tokens eth, dai, tsrd)
          selectedRate1: '',
          selectedRate2: '',
          firstAddress: '',
          secondAddress: ''
        };
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);

      }

      updateRates = async () => {
        const rate1 = await _exchange.methods.returnRate(web3.utils.toChecksumAddress('0xca3b9A3F84Bad262637720e1c71f6eA9fa37B48a')).call();
        this.state.rate[0] = rate1;
        const rate2 = await _exchange.methods.returnRate(web3.utils.toChecksumAddress('0x933b201c88C01Ae6D7b0BdAE777A91e7730BA73B')).call();
        this.state.rate[1] = rate2;
        const rate3 = await _exchange.methods.returnRate(web3.utils.toChecksumAddress('0x669ec5e89DC20dfd428C0cBF459F1e0bBD4045d5')).call();
        this.state.rate[2] = rate3;
      }


      onChange1(e){
        

        const re = /^[0-9]*([.][0-9]*)?$/;
        if (e.target.value === '' || re.test(e.target.value)) {
           this.setState({value1: e.target.value})
        }

        
        if(this.state.token === "Token1" && this.state.token2 === "Token2") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[1]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "Token2" && this.state.token2 === "Token1") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "Token1" && this.state.token2 === "Token3") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "Token3" && this.state.token2 === "Token1") {
          this.setState({value2: e.target.value/this.state.rate[2]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "Token2" && this.state.token2 === "Token3") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "Token3" && this.state.token2 === "Token2") {
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
      

      const re = /^[0-9]*([.][0-9]*)?$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         this.setState({value2: e.target.value})
      }

      if(this.state.token === "Token1" && this.state.token2 === "Token2") {
        this.setState({value1: e.target.value*this.state.rate[0]/this.state.rate[1]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "Token2" && this.state.token2 === "Token1") {
        this.setState({value1: e.target.value*this.state.rate[1]/this.state.rate[0]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "Token1" && this.state.token2 === "Token3") {
        this.setState({value1: e.target.value*this.state.rate[0]/this.state.rate[2]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "Token3" && this.state.token2 === "Token1") {
        this.setState({value1: e.target.value*this.state.rate[2]/this.state.rate[0]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "Token2" && this.state.token2 === "Token3") {
        this.setState({value1: e.target.value*this.state.rate[1]/this.state.rate[2]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "Token3" && this.state.token2 === "Token2") {
        this.setState({value1: e.target.value*this.state.rate[2]/this.state.rate[1]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token ===  this.state.token2 && this.state.token2!=='Επιλέξτε νόμισμα') {
        this.setState({value1: e.target.value}, 
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

    changeRateUp(amount) {
      this.state.rate[0] = this.state.rate[0] + amount/100;
    }

    
    onclick = async () => {

      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});


      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }
      else if(this.state.token === 'Επιλέξτε νόμισμα' || this.state.token2 === 'Επιλέξτε νόμισμα') {
        alert("Παρακαλώ επιλέξτε νομίσματα.")
        } else if (this.state.token ===  this.state.token2){
          alert("Επιλέξτε διαφορετικά νομίσματα.")
        }
      else if(this.state.value1 === '' || this.state.value2 === '') {
        alert("Παρακαλώ ορίστε ποσότητα νομισμάτων.")
      }
      else if(isNaN(parseFloat(this.state.value1)) || isNaN(parseFloat(this.state.value2))) {
        alert("Οι τιμές δεν συμπληρώθηκαν σωστά.")
      }
     
     

      else {

        if(this.state.token ==='Token1') {this.setState({firstAddress:'0xca3b9A3F84Bad262637720e1c71f6eA9fa37B48a'})}
        if(this.state.token ==='Token2') {this.setState({firstAddress:'0x933b201c88C01Ae6D7b0BdAE777A91e7730BA73B'})}
        if(this.state.token ==='Token3') {this.setState({firstAddress:'0x669ec5e89DC20dfd428C0cBF459F1e0bBD4045d5'})}

        if(this.state.token2 ==='Token1') {this.setState({secondAddress:'0xca3b9A3F84Bad262637720e1c71f6eA9fa37B48a'})}
        if(this.state.token2 ==='Token2') {this.setState({secondAddress:'0x933b201c88C01Ae6D7b0BdAE777A91e7730BA73B'})}
        if(this.state.token2 ==='Token3') {this.setState({secondAddress:'0x669ec5e89DC20dfd428C0cBF459F1e0bBD4045d5'})}


          await _exchange.methods.swap(
            web3.utils.toChecksumAddress(this.state.firstAddress),
            web3.utils.toChecksumAddress(this.state.secondAddress),
            web3.utils.toWei(String(this.state.value1, 'ether')),
            web3.utils.toWei(String(this.state.value2, 'ether'))
            ).send({
              from:accounts[0]
            });
          

        
      }
    }



    render() {
    this.updateRates();
    
    let isotimia;
    if(this.state.token !== 'Επιλέξτε νόμισμα' && this.state.token2 !== 'Επιλέξτε νόμισμα') {
      isotimia = <h6>Με 1 {this.state.token} παίρνετε {this.state.rate[this.state.selectedRate2]/this.state.rate[this.state.selectedRate1]}  {this.state.token2} </h6>
    }

    return (
      <div>              
        <Navbar account={this.state.account}/>
            <div>
              <main role="main" className="col-lg-12 d-flex 
                     text-center align-items-center h-100"
                     style={{paddingTop: 80}}>
                <div className="content mr-auto ml-auto">
                  <Card
                    style={{
                      width: 600,
                      height: 550,
                     
                    }}
                  >
                    <Button 
                        onClick={() => {ReactDOM.render(<Exchange />, 
                        document.getElementById('root'))}}
                        variant="info" 
                        size="lg"
                        style={{
                          width: 200
                        }}>SWAP</Button>
                    <Button 
                        onClick={() => {ReactDOM.render(<Pool />, 
                        document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>POOL</Button>
                    <Button 
                        onClick={() => {ReactDOM.render(<Vote />, 
                        document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>VOTE</Button>
                    <CardContent>
                      <Typography variant="h4" component="h2">
                        Συναλλαγή
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 12,
                        }}
                        color="textSecondary"
                      >
                        Επιλέξτε συνδιασμό νομισμάτων:
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
                              width: 300
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
                        <div class="row align-items-center">
                          <div class="col-sm">
                            <input 
                            name= 'input2'
                            value={this.state.value2} 
                            onChange={this.onChange2}
                            placeholder="0.0"
                            style={{
                              margin: 20,
                              borderRadius:20,
                              height: 100,
                              width: 300
                            }} />
                          </div>
                          <div class="col-sm">
                            <Dropdown>
                              <Dropdown.Toggle 
                              variant="success" 
                              id="dropdown-basic"
                              style={{
                                width: 160
                               }}>
                              <text>{this.state.token2}</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),
                                  this.change2("Token1"), this.setState({selectedRate2:0}))}>
                                  <Icon name="Token1" size={25} /> Token1 </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),
                                  this.change2("Token2"), 
                                  this.setState({selectedRate2:1}))}>
                                  <Icon name="Token2" size={25} /> Token2 </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),
                                  this.change2("Token3"), this.setState({selectedRate2:2}))}>
                                  <Icon name="Token3" size={25} /> Token3</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        {isotimia}
                      </div>
                    </CardContent>
                      <div className="d-grid gap-2">
                        <Button 
                        onClick={this.onclick}
                        variant="dark" 
                        size="lg"
                        style={{
                          width: 400
                        }}>Συναλλαγή</Button>
                      </div>
                  </Card>
              </div>
            </main>
          </div>
        </div>
      
    );
    }
}
export default Exchange;

