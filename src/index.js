import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import store from './store';

if(process.env.NODE_ENV == 'development'){
    let Mock = require('./mock').default;
    Mock.start();

}

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route render={(props)=>{
                return(
                    <App location = {props.location}/>
                )
              }} />
        </Router>
    </Provider>,
    document.getElementById('root'));

