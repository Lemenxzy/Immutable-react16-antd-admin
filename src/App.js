import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import {AsyncComponent} from 'Utils/asyncComponent.jsx'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

class App extends Component {
  render() {
    return (
        <TransitionGroup style={ {width:"100%",height:"100%"} }>
            <CSSTransition transitionName="fade"
                           timeout = {{ enter: 300, exit: 200 }}
            >
                <Switch>
                  <Route path="/home" component={AsyncComponent('Home')} />
                  <Route exact strict path="/login" component={AsyncComponent('Login')} />
                  <Route exact strict path="/register" component={AsyncComponent('Register')} />
                </Switch>
        </CSSTransition>
        </TransitionGroup>
    );
  }
}
export default App;
