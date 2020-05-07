import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class GameNew extends Component {
    state = {
        bettingAmount: '',
        gameTitle: '',
        errorMessage: '',
        statusMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            // only allow collections of letters, numbers, and underscores, separated by spaces
            if (!this.state.gameTitle.match(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/)){
                throw 'Must include a title (no special characters)';
            }
            this.setState({ statusMessage: 'Getting account from MetaMask'});
            const accounts = await web3.eth.getAccounts();
            this.setState({ statusMessage: 'Awaiting smart contract completion on blockchain to create and join game'});
            await factory.methods
                // bettingAmount inputted as ether, but converted to wei
                .createGame(this.state.gameTitle, web3.utils.toWei(this.state.bettingAmount, 'ether'))
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.bettingAmount, 'ether')
                });
            this.setState({ statusMessage: 'Game created and joined on blockchain'});
            Router.pushRoute('/');
        }
        catch (err) {
            this.setState({ statusMessage: '' });
            if (err.message != null)
                this.setState({ errorMessage: err.message });
            else
                this.setState({ errorMessage: err });
        }

        this.setState({ loading: false });
    }

    render() {
        return (
        <Layout>
            <h3>Create a Game</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Game Title</label>
                    <Input 
                        label='title' 
                        labelPosition='right'
                        value={this.state.gameTitle}
                        onChange={event => 
                            this.setState({ gameTitle: event.target.value })}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Betting Amount</label>
                    <Input 
                        label='ether' 
                        labelPosition='right'
                        value={this.state.bettingAmount}
                        onChange={event => 
                            this.setState({ bettingAmount: event.target.value })}
                    />
                </Form.Field>
                <Message error header='Oops!' content = {this.state.errorMessage} />
                {this.state.statusMessage && <Message positive header='Status' content={this.state.statusMessage} />}
                <Button primary loading={this.state.loading}>Create!</Button>
            </Form>
        </Layout>
        )
    };
}

export default GameNew;