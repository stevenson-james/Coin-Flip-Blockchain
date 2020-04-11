import React, { Component } from "react";
import { Segment, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import Game from '../../ethereum/game';
import { Link, Router } from '../../routes';

class Flip extends Component {
    static async getInitialProps(props) {
        const game = Game(props.query.address);
        return {
            game
        }
    };

    state = {
        isChosen: false,
        calledFace: '',
        errorMessage: '',
        loading: false
    };

    async onChoose (isHeads) {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.game.methods.chooseSide(isHeads).send({
                from: accounts[0]
            });
            if (isHeads)
                this.setState({ calledFace: 'Heads' });
            else
                this.setState({ calledFace: 'Tails' }); 
            this.setState({ isChosen: true });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    render() {
        return (
            <Layout>
                {!this.state.isChosen && <div>
                    <h1 align='center'>Call Your Side!</h1>
                    <Segment basic textAlign={"center"}>
                        <Button.Group size='massive' align='center' widths='5'>
                            <Button color='red' onClick={() => this.onChoose(true)}>
                                Heads
                            </Button>
                            <Button.Or />
                            <Button color='blue' onClick={() => this.onChoose(false)}>
                                Tails
                            </Button>
                        </Button.Group>
                        {this.state.errorMessage && <Message 
                            error header='Oops!' content={this.state.errorMessage} />}
                    </Segment>
                </div>}
                {this.state.isChosen && <div>
                    <h1>You Called {this.state.calledFace} </h1>
                </div>}
            </Layout>
        )
    }
}
export default Flip;