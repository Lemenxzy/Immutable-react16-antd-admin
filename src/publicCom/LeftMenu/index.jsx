/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import {  Menu , Icon } from 'antd'
import { Map } from 'immutable';
import { change } from 'RAndA/leftnav'
import { connect } from 'react-redux';

class LeftMenu extends BaseComponent {

    constructor(props) {
        super(props);
       
    }

    handleClick = (e)=>{
        //添加redux
        this.props.dispatch(change(e.key));
        console.log(this.props.match.url);
        //改变路由
        this.props.history.push(e.key)
    };

    render() {
        //console.log(this.props.select.getIn(['select']));
        return (
            <Menu theme="dark"
                  mode="inline"
                  onClick={this.handleClick}
                  selectedKeys = {[this.props.changeResult.getIn(['data'])]}
            >
                <Menu.Item key="/home">
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                </Menu.Item>
                <Menu.Item key="/home/Option2">
                    <Icon type="desktop" />
                    <span>Option 2</span>
                </Menu.Item>
            </Menu>
        )

    }
}


export default connect((state) => {
    return {
        changeResult: state.getIn(['chageResult'])
    }
})(LeftMenu)
