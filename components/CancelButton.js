// Button to join an open game
// Requires props of game and web3

import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';

class CancelButton extends Component {
    static async getInitialProps(props) {
        return{
            game: props.game,
            web3: props.web3
        }
    }

    state = {
        errorMessage: '',
        loading: false
    };

    onCancel = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await this.props.web3.eth.getAccounts();
            await this.props.game.methods.cancel().send({
                from: accounts[0]
            });
        }
        catch (err) {
            this.setState({ loading: false, errorMessage: err.message });
        }
    }

    render() {
        return (
            <div>
                <Button primary onClick={ this.onCancel } loading={this.state.loading}> Cancel Game </Button>
                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
            </div>
        );
    }
}

export default CancelButton;