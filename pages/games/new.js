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
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            if (!this.state.gameTitle.match(/^[A-Za-z0-9]+(\s[[A-Za-z0-9])*$/)){
                throw 'Must include a title (no special characters)';
            }
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                // bettingAmount inputted as ether, but converted to wei
                .createGame(this.state.gameTitle, web3.utils.toWei(this.state.bettingAmount, 'ether'))
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.bettingAmount, 'ether')
                });
            
            Router.pushRoute('/');
        }
        catch (err) {
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
                <Button primary loading={this.state.loading}>Create!</Button>
            </Form>
        </Layout>
        )
    };
}

export default GameNew;