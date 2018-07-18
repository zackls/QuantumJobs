import React from 'react';
import { Button } from 'react-bootstrap';

import './ModalContent.css';

export default (props) => (
    <div className='padded'>
        <h3>{ props.title }</h3>
        <hr/>
        <div>{ props.body }</div>
        <hr/>
        { props.buttons.map(button => (<Button {...button} key={button.title}>{button.title}</Button>)) }
    </div>
);