import React from 'react';
import { Button } from 'react-bootstrap';

import './ModalContent.css';

export default ({ title, body, buttons }) => (
    <div className='padded'>
        <h3>{ title }</h3>
        <hr/>
        <div>{ body }</div>
        { buttons ? 
            <span>
                <hr/>
                { buttons.map(button => (<Button {...button} key={button.title}>{button.title}</Button>)) }
            </span>
            :
            null
        }
    </div>
);