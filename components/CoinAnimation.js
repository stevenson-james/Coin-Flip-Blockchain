// takes prop of isHeads
// special thanks to Siva's Vlogs youtube channel for the tutorial assistance

import React, { Component } from 'react';

class CoinAnimation extends Component {

    static async getInitialProps(){
        return { face: props.face };
    }

    render() {
        return (
            <div>
                {this.props.face === 'heads' && <div className="coin animate-heads">
                    <div className="heads" />
                    <div className="tails" />    
                </div>}
                {this.props.face === 'tails' && <div className="coin animate-tails">
                    <div className="heads" />
                    <div className="tails" />    
                </div>}
                <style jsx>{`
                    .coin {
                        width: 15rem;
                        height: 15rem;
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
                        background-image: url("https://clipart.printcolorcraft.com/wp-content/uploads/quarter/quarter%20tails%20clipart%201.jpg");
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