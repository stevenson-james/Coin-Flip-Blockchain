import React, { Component } from 'react';
import { Segment, Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
// technically an instance of campaign
import Game from '../../ethereum/game';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import JoinButton from '../../components/JoinButton';
import ReadyButton from '../../components/ReadyButton'
import CancelButton from '../../components/CancelButton';

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

    renderP1Wins(items) {
        items.push(
            {
                header: this.props.player1,
                meta: 'Address of Player1',
                color: 'green',
                description: 'Player1 created the game, can cancel the game, ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.player2,
                meta: 'Address of Player2',
                color: 'red',
                description: 'Player2 joined the game, can cancel the game ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            });
        return items; 
    }

    renderP2Wins(items) {
        items.push(
            {
                header: this.props.player1,
                meta: 'Address of Player1',
                color: 'red',
                description: 'Player1 created the game, can cancel the game, ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.player2,
                meta: 'Address of Player2',
                color: 'green',
                description: 'Player2 joined the game, can cancel the game ' + 
                    'and can flip the coin when both players are ready',
                style: { overflowWrap: 'break-word' }
            });
        return items;
    }

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
        var items = [];
        if(isCompleted)
            if (winner == player1)
                items = this.renderP1Wins(items);
            else
                items = this.renderP2Wins(items);
        else {
            items = [
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
        }
        items.push({
                header: web3.utils.fromWei(value, 'ether') + ' ether',
                meta: 'Betting Amount',
                description: 'Amount each player must/has bet on the coin flip and ' +
                    'amount to be won',
            });
        if(isCancelled)
            items.push({
                header: 'Game Is Cancelled',
                description: 'A player has chosen to cancel the game, meaning ' +
                    'money has been returned to the players involved',
            });
        else if(isCompleted) {
            if (player1 == flipPlayer)
                items.push({
                    header: 'Player 1',
                    meta: 'Player Who Flipped the Coin',
                    description: 'This player chose the face for the coin flip and ' +
                        'finalized the game',
                    style: { overflowWrap: 'break-word' }
                });
            else
                items.push({
                    header: 'Player 2',
                    meta: 'Player Who Flipped the Coin',
                    description: 'This player chose the face for the coin flip and ' +
                        'finalized the game',
                    style: { overflowWrap: 'break-word' }
                });
            if (player1 == winner)
                items.push({
                    header: 'Player 1',
                    meta: 'Winner of Coin Toss',
                    description: 'Address of the winner of the coin toss who wins the bet',
                    style: { overflowWrap: 'break-word' }
                });
            else
                items.push({
                    header: 'Player 2',
                    meta: 'Winner of Coin Toss',
                    description: 'Address of the winner of the coin toss who wins the bet',
                    style: { overflowWrap: 'break-word' }
                });
            items.push({});
            if (choseHeads)
                items.push({
                    image: "https://webstockreview.net/images/coin-clipart-dime-6.png",
                    header: 'Chosen Face',
                    description: 'The face called by the player'
                });
            else
                items.push({
                    image: "https://cdn.clipart.email/b6f9846cc40047b4b19009917b239936_quarter-tails-clipart_1208-1202.jpeg",
                    header: 'Chosen Face',
                    description: 'The face called by the player'
                });
            if (landedHeads)
                items.push({
                    image: "https://webstockreview.net/images/coin-clipart-dime-6.png",
                    header: 'Landed Face',
                    description: 'The face the coin landed on'
                });
            else
                items.push({
                    image: "https://cdn.clipart.email/b6f9846cc40047b4b19009917b239936_quarter-tails-clipart_1208-1202.jpeg",
                    header: 'Landed Face',
                    description: 'The face the coin landed on'
                });
        }
        return < Card.Group items={items} />;
    }
    
    render() {
        return (
            <Layout>
                <h3>Game Title: '{this.props.title}'</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.renderCards()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <br/>
                <Link route={`/`}>
                    <a>
                        <Button primary>Back</Button>
                    </a>
                </Link>
            </Layout>
        );
    };
}

export default GameShow;