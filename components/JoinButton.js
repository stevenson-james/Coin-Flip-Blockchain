// Button to join an open game
// Requires props of game, value, and web3

import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';

class JoinButton extends Component {
    static async getInitialProps(props) {
        return{
            game: props.game,
            web3: props.web3,
            Router: props.Router,
        }
    }

    state = {
        errorMessage: '',
        statusMessage: '',
        loading: false
    };

    onJoin = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            this.setState({ statusMessage: 'Getting account from MetaMask'});
            const accounts = await this.props.web3.eth.getAccounts();
            this.setState({ statusMessage: 'Awaiting smart contract completion on blockchain to join game'});
            await this.props.game.methods.bet().send({
                from: accounts[0],
                value: this.props.value
            });
            this.setState({ loading: false });
            this.setState({ statusMessage: 'Player added to game on blockchain'});
            this.props.Router.pushRoute(`/`);
        }
        catch (err) {
            this.setState({ loading: false, errorMessage: err.message, statusMessage: '' });
        }
    }

    render() {
        return (
            <div>
                <Button primary onClick={this.onJoin} loading={this.state.loading}> Join the Game!</Button>
                {this.state.statusMessage && <Message positive header='Status' content={this.state.statusMessage} />}
                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage.substring(0, 100)} />}
            </div>
        );
    }
}

export default JoinButton;