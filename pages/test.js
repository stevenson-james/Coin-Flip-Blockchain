import React, { Component } from 'react';
import $ from 'jquery';
import '../test.css';

class FlipAnimation extends Component {
    componentDidMount() {
        $('#coin').on('click', function(){
            var flipResult = Math.random();
            $('#coin').removeClass();
            setTimeout(function(){
                if(flipResult <= 0.5){
                    $('#coin').addClass('heads');
                    console.log('it is head');
                }
                else{
                    $('#coin').addClass('tails');
                    console.log('it is tails');
                }
            }, 100);
        });
    }

    render() {
        return (
            <div>
                <div id="coin">
                    <div class="side-a"></div>
                    <div class="side-b"></div>
                </div>
                <h1>Click on coin to flip</h1>
            </div>
        );
    }
}

export default FlipAnimation;