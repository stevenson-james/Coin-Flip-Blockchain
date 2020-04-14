import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Game from '../ethereum/game';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';
import { Link, Router } from '../routes';
import ReadyButton from '../components/ReadyButton';
import CancelButton from '../components/CancelButton';
import JoinButton from '../components/JoinButton';

class GameIndex extends Component {

    // componentDidMount will not run on server rendering
    // so use getInitialProps (Next.js function) instead
    static async getInitialProps(){
        var games = await factory.methods.getDeployedGames().call();
        const summaries = await Promise.all(
            games.map(address => { return Game(address).methods.getSummary().call();})
        );
        const accounts = await web3.eth.getAccounts();
        return { games, summaries, accounts };
    }

    renderGames() {
        // i iterates through each address to keep it accessible
        //  if given more time I would have refactored the map to include the address
        //  as well as the summary
        var i = -1;
        return this.props.summaries.map(summary => {
            i++;

            const title = summary[0];
            const value = summary[1];
            const p1 = summary[2];
            const p2 = summary[3];
            const readyCount = summary[4];
            const playersCount = summary[5];
            const isCompleted = summary[10];
            const isCancelled = summary[11];
            const address = this.props.games[i];
            const game = Game(this.props.games[i]);

            const { Row, Cell } = Table;
            return (
                <Row
                active={isCompleted || isCancelled}
                positive={readyCount > 1 && !isCompleted}>
                    <Cell>
                        <Link route={`/games/${address}`}>
                            <a>{title}</a>
                        </Link>
                    </Cell>
                    <Cell>{web3.utils.fromWei(value, 'ether') + ' ether'}</Cell>
                    <Cell>{readyCount + '/' + playersCount}</Cell>
                    {playersCount < 2 &&
                        <React.Fragment>
                            <Cell><JoinButton
                                    game={ game }
                                    value={ value } 
                                    address={ address } 
                                    web3={ web3 } 
                                    Router={ Router }></JoinButton></Cell>
                            <Cell>Game Completed</Cell>
                            <Cell>Game Completed</Cell>
                            <Cell>Game Completed</Cell>
                        </React.Fragment>
                    }
                    {(readyCount < 2) && (playersCount > 1) && !isCancelled && !isCompleted &&
                        <React.Fragment>
                            <Cell>Game Full</Cell>
                            <Cell><ReadyButton game={ game } web3={ web3 }></ReadyButton></Cell>
                            <Cell><CancelButton game={ game } web3={ web3 }></CancelButton></Cell>
                            <Cell>Players Not Ready</Cell>
                        </React.Fragment>
                    }
                    {(readyCount == 2) && !isCancelled && !isCompleted &&
                        <React.Fragment>
                            <Cell>Game Full</Cell>
                            <Cell>Players Ready</Cell>
                            <Cell><CancelButton game={ game } web3={ web3 }></CancelButton></Cell>
                            <Cell><Link route={`/games/${address}/flipcoin`}>
                                    <a>
                                        <Button primary>Flip the Coin!</Button>
                                    </a>
                                </Link>
                            </Cell>
                        </React.Fragment>
                    }
                    {isCompleted &&
                        <React.Fragment>
                            <Cell>Game Full</Cell>
                            <Cell>Game Completed</Cell>
                            <Cell>Game Completed</Cell>
                            <Cell>Game Completed</Cell>
                        </React.Fragment>
                    }
                </Row>
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <div>
                    <h3>All Games</h3>
                    
                    <Link route='/games/new'>
                        <a>
                            <Button
                                floated='right'
                                content='Create Game'
                                icon='add circle'
                                primary
                            />
                        </a>
                    </Link>
                    <Table>
                        <Header>
                            <Row>
                                <HeaderCell>Title</HeaderCell>
                                <HeaderCell>Buy In Value</HeaderCell>
                                <HeaderCell>Ready Players</HeaderCell>
                                <HeaderCell>Join Game</HeaderCell>
                                <HeaderCell>Ready Up</HeaderCell>
                                <HeaderCell>Cancel Game</HeaderCell>
                                <HeaderCell>Flip Coin</HeaderCell>
                            </Row>
                        </Header>
                        <Body>
                            {this.renderGames()}
                        </Body>
                    </Table>
                </div>
            </Layout>
        );
    }
}

export default GameIndex;