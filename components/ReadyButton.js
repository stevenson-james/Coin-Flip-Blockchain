// Button to ready up for a game
// Requires props of game and web3

import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';

class ReadyButton extends Component {
    static async getInitialProps(props) {
        return{
            game: props.game,
            web3: props.web3,
            Router: props.Router
        }
    }

    state = {
        errorMessage: '',
        loading: false
    };

    onReady = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await this.props.web3.eth.getAccounts();
            await this.props.game.methods.ready().send({
                from: accounts[0]
            });
            this.setState({ loading: false });
            this.props.Router.pushRoute(`/`);
        }
        catch (err) {
            this.setState({ loading: false, errorMessage: err.message });
        }
    }

    render() {
        return (
            <div>
                <Button primary onClick={ this.onReady } loading={this.state.loading}> Ready Up!</Button>
                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
            </div>
        );
    }
}

export default ReadyButton;