/**
 * Created with JetBrains WebStorm.
 User: xuzhiyuan
 Date: 2017/8/22
 Time: 11:16
 To change this template use File | Settings | File Templates.
 */

import React from 'react';
import BaseComponent from 'Utils/BaseComponent.jsx'
import { Layout } from 'antd'
const { Footer } = Layout;

class Foot extends BaseComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                智成科技 ©2016 Created by ZhiCheng
            </Footer>
        )

    }
}


export default Foot
