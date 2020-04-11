import React, { Component } from 'react';
import { Card, Grid, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
// technically an instance of campaign
import Game from '../../ethereum/game';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class GameShow extends Component {
    static async getInitialProps(props) {
        // get address from routes.js in props.query.address
        // set campaign instance to variable
        const game = Game(props.query.address);

        const summary = await game.methods.getSummary().call();

        return{
            game: game,
            address: props.query.address,
            isCompleted: await game.methods.isCompleted().call(),
            isCancelled: await game.methods.isCancelled().call(),
            title: summary[0],
            value: summary[1],
            player1: summary[2],
            player2: summary[3],
            readyCount: summary[4],
            playersCount: summary[5],
            flipPlayer: summary[6],
            choseHeads: summary[7],
            landedHeads: summary[8],
            winner: summary[9]
        };
    }

    state = {
        errorMessage: '',
        loading: false
    };

    renderCards() {
        const {
            isCompleted,
            isCancelled,
            value,
            player1,
            player2,
            playersCount,
            flipPlayer,
            choseHeads,
            landedHeads,
            winner
        } = this.props;

        var chosenValue, landedValue;
        if(choseHeads)
            chosenValue = 'Heads'
        else
            chosenValue = 'Tails'
        
        if(landedHeads)
            landedValue = 'Heads'
        else
            landedValue = 'Tails'

        const items = [
            {
                header: player1,
                meta: 'Address of Player1',
                description: 'Player1 created the game, can cancel the game, ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            }
        ];
        if(playersCount > 1)
            items.push({
                header: player2,
                meta: 'Address of Player2',
                description: 'Player2 joined the game, can cancel the game ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            });
        items.push({
                header: web3.utils.fromWei(value, 'ether'),
                meta: 'Betting Amount (ether)',
                description: 'Amount each player must/has bet on the coin flip and ' +
                    'amount to be won',
            });
        if(isCancelled)
            items.push({
                header: 'Game Is Cancelled',
                description: 'A player has chosen to cancel the game, meaning ' +
                    'money has been returned to the players involved',
            });
        else if(isCompleted)
        items.push({
            header: flipPlayer,
            meta: 'Address of Player Who Flipped the Coin',
            description: 'This player chose the face for the coin flip and ' +
                'finalized the game',
            style: { overflowWrap: 'break-word' }
        },
        {
            header: chosenValue + '/' + landedValue,
            meta: 'Chosen Face / Landed Face',
            description: 'First face is the face called by the player, the second ' +
                'face is the result of the coin flip',
        },
        {
            header: winner,
            meta: 'Winner of Coin Toss',
            description: 'Address of the winner of the coin toss who wins the bet ether',
            style: { overflowWrap: 'break-word' }
        }
        );

        return < Card.Group items={items} />;
    }

    onJoin = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.game.methods.bet().send({
                from: accounts[0],
                value: this.props.value
            });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    onCancel = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.game.methods.cancel().send({
                from: accounts[0]
            });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    onReady = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await this.props.game.methods.ready().send({
                from: accounts[0]
            });
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    render() {
        return (
            <Layout>
                <h3>Game Title: '{this.props.title}'</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <Grid.Row>
                                <Button primary onClick={ this.onJoin }> Join the Game!</Button>
                                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                            </Grid.Row>
                            <br />
                            <Grid.Row>
                                <Button primary onClick={ this.onReady }> Ready Up!</Button>
                                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                            </Grid.Row>
                            <br />
                            <Grid.Row>
                                <Link route={`/games/${this.props.address}/flipcoin`}>
                                    <a>
                                        <Button primary>Flip the Coin!</Button>
                                    </a>
                                </Link>
                            </Grid.Row>
                            <br />
                            <Grid.Row>
                                <Button primary onClick={ this.onCancel }> Cancel Game... </Button>
                                {this.state.errorMessage && <Message error header='Oops!' content={this.state.errorMessage} />}
                            </Grid.Row>
                            <br />
                            <Grid.Row>
                                <Link route={`/`}>
                                    <a>
                                        <Button primary>Back</Button>
                                    </a>
                                </Link>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    };
}

export default GameShow;