// takes prop of isHeads, isWinner, and Link
// special thanks to Siva's Vlogs youtube channel for the tutorial assistance

import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

class CoinAnimation extends Component {

    static async getInitialProps(){
        this.setMessage();
        return { face: props.face, 
            isWinner: props.isWinner, 
            Link: props.Link
         };
    }

    state = {
        isDelayed: false,
        isWinner: false
    }

    setMessage() {
        setTimeout(() => { 
            this.setState({ isDelayed: true });
            if(this.props.isWinner)
                this.setState({ isWinner: true });
         }, 10000);
    }

    render() {
        return (
            <div>
                {this.props.face === 'Heads' && <div className="coin animate-heads">
                    <div className="heads" />
                    <div className="tails" />    
                </div>}
                {this.props.face === 'Tails' && <div className="coin animate-tails">
                    <div className="heads" />
                    <div className="tails" />    
                </div>}
                {this.setMessage()}
                
                {this.state.isDelayed && this.state.isWinner && <h1>YOU WIN!!!</h1>}
                {this.state.isDelayed && !this.state.isWinner && <h1>Sorry, you lost</h1>}
                {this.state.isDelayed &&
                    <this.props.Link route = '/'>
                        <a><Button primary>Back to Games</Button></a>
                    </this.props.Link>
                }
                <style jsx>{`
                    .coin {
                        width: 20rem;
                        height: 20rem;
                        transform-style: preserve-3d;
                    }
                    
                    .coin div {
                        width: 100%;
                        height: 100%
                        border: 3px solid black;
                        border-radius:  50%;
                        backface-visibility: hidden;
                        position: absolute;
                    }

                    .coin .heads {
                        background-image: url("https://webstockreview.net/images/coin-clipart-dime-6.png");
                        background-size: contain;
                    }

                    .coin .tails {
                        background-image: url("https://cdn.clipart.email/b6f9846cc40047b4b19009917b239936_quarter-tails-clipart_1208-1202.jpeg");
                        background-size: contain;
                        transform: rotateY(-180deg);
                    }

                    .animate-heads {
                        animation: flipHeads 10s;
                        animation-fill-mode: forwards;
                    }

                    @keyframes flipHeads {
                        from {
                            transform: rotateY(0deg);
                        }
                        to {
                            transform: rotateY(2880deg);
                        }
                    }

                    .animate-tails {
                        animation: flipTails 10s;
                        animation-fill-mode: forwards;
                    }

                    @keyframes flipTails {
                        from {
                            transform: rotateY(0deg);
                        }
                        to {
                            transform: rotateY(3060deg);
                        }
                    }
                `}</style>
            </div>
            
        );
    }
}

export default CoinAnimation;