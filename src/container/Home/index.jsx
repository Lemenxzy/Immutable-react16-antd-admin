import React from 'react';
import {Map} from 'immutable';
import { Layout, Breadcrumb } from 'antd';
const { Content, Sider } = Layout;
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './home.scss'
import Foot from 'PubCom/footer'
import LeftMenu from 'PubCom/LeftMenu'
import { Route } from 'react-router-dom'
import {AsyncComponent} from 'Utils/asyncComponent.jsx'


class Home extends BaseComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            data:Map({
                collapsed: false
            })
        }
    }

    onCollapse = (collapsed) => {
        //this.setState({ collapsed });
        this.setState({
            data: this.state.data.update('collapsed', () => collapsed)
        });
    };




    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.data.getIn(['collapsed'])}
                    onCollapse={this.onCollapse}
                >
                    <div className={style.logobox}>
                        <img src={
                            this.state.data.getIn(['collapsed'])?
                                    require('./img/logo2.png')
                                :
                                    require('./img/logo.png')
                                }
                             className = { style.logo }
                        />
                    </div>
                    <LeftMenu history = {this.props.history} match={this.props.match}/>
                </Sider>
                <Layout>
                    <Content className={style.ContentB}>
                        <Breadcrumb className={style.Breadcrumb}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Route exact strict path="/home" component={ AsyncComponent('Option1') } />
                            <Route exact strict path="/home/Option2" component={ AsyncComponent('Option2') } />
                        </div>
                    </Content>
                    <Foot />
                </Layout>
            </Layout>
        );
    }
}


export default Home;
