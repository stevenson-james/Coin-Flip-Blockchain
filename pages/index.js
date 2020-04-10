import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class GameIndex extends Component {
    // componentDidMount will not run on server rendering
    // so use getInitialProps (Next.js function) instead
    static async getInitialProps(){
        const games = await factory.methods.getDeployedGames().call();

        return { games };
    }

    renderGames() {
        const items = this.props.games.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/games/${address}`}>
                        <a>View Game</a>
                    </Link>
                ),
                fluid: true
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
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
                    {this.renderGames()}
                </div>
            </Layout>
        );
    }
}

export default GameIndex;