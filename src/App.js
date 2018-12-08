import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import myBank from "./myBank";

class App extends Component {
  state = {
    owner: "",
    accounts: "",
    balance: "",
    indAddress: "",
    indBalance: "",
    totalBankBalance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    const owner = await myBank.methods.owner().call();
    //console.log(owner);

    const accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    const balance = await web3.eth.getBalance(accounts[0]);
    //console.log("balance", web3.utils.fromWei(balance, "ether"));

    const indAddress = await myBank.methods.indAddress().call();
    //console.log(indAddress);

    const indBalance = await myBank.methods.indBalance().call();
    //console.log(indBalance);

    const totalBankBalance = await web3.eth.getBalance(myBank.options.address);
    //console.log(totalBankBalance);

    this.setState({
      owner,
      accounts,
      balance,
      indAddress,
      indBalance,
      totalBankBalance
    });
  }

  finalDeposit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "We are processing your Deposit..." });
    await myBank.methods.deposit().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({ message: "Deposit successful..." });
  };

  finalWithdraw = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "We are processing your Withdraw..." });
    await myBank.methods.withdraw(this.state.value).send({
      from: accounts[0]
    });
    this.setState({ message: "Withdraw successful..." });
  };

  render() {
    return (
      <div>
        <h2>Bank</h2>
        <p>This Bank is managed by {this.state.owner}</p>

        <h2>My Wallet Address</h2>
        <p>{this.state.accounts}</p>

        <h2>My Wallet Balance</h2>
        <p>{web3.utils.fromWei(this.state.balance, "ether")} ether! </p>

        <h2>My Bank Balance</h2>
        <p>{web3.utils.fromWei(this.state.indBalance, "ether")} ether!</p>

        <h2>Total Bank Balance</h2>
        <p>{web3.utils.fromWei(this.state.totalBankBalance, "ether")} ether!</p>

        <form onSubmit={this.finalDeposit}>
          <h2>Enter the ethers to Deposit....</h2>
          <div>
            <input
              value1={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Deposit</button>
        </form>

        <form onSubmit={this.finalWithdraw}>
          <h2>Enter the ethers to Withdraw....</h2>
          <div>
            <input
              value2={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Withdraw</button>
        </form>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
