import React from 'react';
import {Map} from 'immutable';
import { Layout, Breadcrumb } from 'antd';
const { Content, Sider } = Layout;
import BaseComponent from 'Utils/BaseComponent.jsx'
import style from './home.scss'
import Foot from 'PubCom/footer'
import LeftMenu from 'PubCom/LeftMenu'
import { Route , Link} from 'react-router-dom'
import {AsyncComponent} from 'Utils/asyncComponent.jsx'
import { AsyncPost } from 'Utils/utils'
import SwitchCSSTransitionGroup from 'switch-css-transition-group'
import leftconfig from 'Config/leftnav'

class Home extends BaseComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            data:Map({
                collapsed: false
            })
        }
    }

    componentDidMount(){
        AsyncPost('/login',{},(data)=>{
            console.log(data);
        })
    }

    onCollapse = (collapsed) => {
        //this.setState({ collapsed });
        this.setState({
            data: this.state.data.update('collapsed', () => collapsed)
        });
    };


    render() {
        //面包屑逻辑
        const breadcrumbNameMap = {};
        leftconfig.map((data,index)=>{
            if (index !== 0 ){
                breadcrumbNameMap[data.path] = data.name
            }
        });
        const { location } = this.props;
        const pathSnippets = location.pathname.split('/').filter(i => i);
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
        const breadcrumbItems = [(
            <Breadcrumb.Item key="/home" className={style.firstBreadcrumb}>
                <Link to="/home">首页</Link>
            </Breadcrumb.Item>
        )].concat(extraBreadcrumbItems);

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
                    <LeftMenu location = {this.props.location} history = {this.props.history} match={this.props.match}/>
                </Sider>
                <Layout>
                    <Content className={style.ContentB}>

                        {/*面包屑*/}
                        <Breadcrumb separator=">" className={style.Breadcrumb}>
                            {breadcrumbItems}
                        </Breadcrumb>

                        {/*正文*/}
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <SwitchCSSTransitionGroup
                                location={this.props.location}
                                transitionName='example'
                                transitionLeaveTimeout={500}
                                transitionEnterTimeout={500}
                            >
                                {
                                    leftconfig.map((data,index)=>{
                                        return(
                                            <Route key={ "router"+index } exact strict path={data.path} component={ AsyncComponent(data.component) } />
                                        )
                                    })
                                }
                                
                            </SwitchCSSTransitionGroup>
                        </div>
                    </Content>
                    <Foot />
                </Layout>
            </Layout>
        );
    }
}


export default Home;
