import React, { Component } from "react";
import { Segment, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import Game from '../../ethereum/game';
import { Link } from '../../routes';
import CoinAnimation from '../../components/CoinAnimation';

//TODO: add winning message
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
        loading: false,
        isWinner: false
    };

    async onChoose (isChosenHeads) {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            // randomNum between 0 and 1
            const randomNum = Math.random();
            const isLandedHeads = randomNum > .5;

            await this.props.game.methods.coinFlip(isChosenHeads, isLandedHeads).send({
                from: accounts[0]
            });
            this.setState({ loading: false });
            this.setState({ isChosen: true });
            if (isChosenHeads)
                this.setState({ calledFace: 'Heads' });
            else
                this.setState({ calledFace: 'Tails' }); 

            if (isLandedHeads)
                this.setState({ landedFace: 'Heads' });
            else
                this.setState({ landedFace: 'Tails' }); 
            
            if (isChosenHeads == isLandedHeads)
                this.setState({ isWinner: true });
            else
                this.setState({ isWinner: false });
        }
        catch (err) {
            this.setState({ loading: false, errorMessage: err.message });
        }
    }

    render() {
        return (
            <Layout>
                {!this.state.isChosen && <div>
                    <h1 align='center'>Call Your Side!</h1>
                    <Segment basic textAlign={"center"}>
                        <Button.Group size='massive' align='center' widths='5'>
                            <Button color='red' onClick={() => this.onChoose(true)} loading={ this.state.loading}>
                                Heads
                            </Button>
                            <Button.Or />
                            <Button color='blue' onClick={() => this.onChoose(false)} loading={ this.state.loading}>
                                Tails
                            </Button>
                        </Button.Group>
                        {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                    </Segment>
                </div>}
                {this.state.isChosen && <Segment basic align={"center"}>
                    <h1>You Called {this.state.calledFace}</h1>
                    <CoinAnimation face={this.state.landedFace} isWinner={this.state.isWinner} Link={Link}></CoinAnimation>
                    {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                </Segment>}
            </Layout>
        )
    }
}
export default Flip;