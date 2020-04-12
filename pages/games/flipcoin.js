import React, { Component } from "react";
import { Segment, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import Game from '../../ethereum/game';
import { Link, Router } from '../../routes';
import CoinAnimation from '../../components/CoinAnimation';

class Flip extends Component {
    static async getInitialProps(props) {
        const game = Game(props.query.address);
        const summary = await game.methods.getSummary().call();
        let chosenFace = '';
        if(summary[7])
            chosenFace = 'Heads'
        else
            chosenFace = 'Tails';
        return {
            game: game,
            flipPlayer: summary[6],
            chosenFace: chosenFace
        }
    };

    state = {
        // boolean for if a side has been chosen yet
        isChosen: (this.props.flipPlayer != 0),
        calledFace: this.props.chosenFace,
        landedFace: '',
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

    //TODO: fix async problem
    /*
    async flipCoin() {
        this.setState({ loading: true, errorMessage: '' });
        // randomNum between 0 and 1
        const randomNum = Math.random();
        const isHeads = randomNum > .5;
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.game.methods.coinFlip(isHeads).send({
                from: accounts[0]
            });
            
            if (isHeads)
                this.setState({ landedFace: 'Heads' });
            else
                this.setState({ landedFace: 'Tails' }); 
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
        if (isHeads)
            return <CoinAnimation face='heads'></CoinAnimation>;
        else
            return <CoinAnimation face='tails'></CoinAnimation>;
    }
    */

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
                {this.state.isChosen && <Segment basic align={"center"}>
                    <h1>You Called {this.state.calledFace} </h1>
                    <CoinAnimation face='tails'></CoinAnimation>
                    {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                </Segment>}
            </Layout>
        )
    }
}
export default Flip;