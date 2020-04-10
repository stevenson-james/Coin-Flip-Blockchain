import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop : '10px' }}>
            <Link route = '/'>
                <a className='item'>Coin Flip Professional League</a>
            </Link>
            <Menu.Menu position='right'>
                <Link route = '/'>
                    <a className='item'>Games</a>
                </Link>
                <Link route = '/games/new'>
                <a className='item'><Icon name='plus' /></a>
            </Link>
            </Menu.Menu>
        </Menu>
    )
}