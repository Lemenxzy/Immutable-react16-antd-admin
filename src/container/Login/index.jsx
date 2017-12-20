import React,{ Component } from 'react'
//引入login的头部
//import LoginHeader from 'PubComponents/loginHeader'
import { Form, Icon, Input, Checkbox,Button ,Col ,Row ,message,Tooltip} from 'antd';
const FormItem = Form.Item;
import { Link , withRouter } from 'react-router-dom'
//引入组件sass
import style from './login.scss'
//引用，不要签名的发起请求方式，写入cookie的util，还有需要签名的请求
//import { NotSigAsyncPost , fExportSetCookieMes ,AsyncPost} from 'Utils/utils';
//粒子动画库
import 'particles.js'

class Login extends Component {
    constructor(props) {
        super(props);
        //防止重复提交的flag
        this.loginflag = true;
    }


    componentDidMount(){
        //particlesJS()
        //粒子运动动画
        this.particlesConfig();
    }

    //粒子运动配置
    particlesConfig = ()=>{
        /* ---- particles.js config ---- */
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#d7d9da"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 0.2,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 15,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 20,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#d7d9da",
                    "opacity": 0.8,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

    };


    //提交登录信息
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.loginflag){
            this.loginflag = false;
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.loginflag = true
                }
            });
        }else{
            message.error('后台正在处理中，请稍等 !')
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={style.big_wrap}>
                <div className={style.login_wrap}>
                    <Row type="flex" className={style.row}>
                        <Col xs={2} sm={6} md={9} className={style.flexbox}></Col>
                        <Col xs={20} sm={12} md={6} className={style.flexbox}>
                            <div className={style.components_form_login}>
                                <div className = {style.img_wrap}>
                                    <img src={require('./img/logo.png')} className={style.img_width}/>
                                </div>
                                <Form onSubmit={this.handleSubmit} className={style.login_form}>
                                    {/*邮箱账号*/}
                                    <FormItem>
                                        {getFieldDecorator('userName', {
                                            rules: [{
                                                type: 'email', message: '请输入正确的邮箱',
                                            },{ required: true, message: '请输入您的邮箱 !' }],
                                        })(
                                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="邮箱" />
                                        )}
                                    </FormItem>
                                    {/*密码框*/}
                                    <FormItem>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入您的密码 !' }],
                                        })(
                                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                                        )}
                                    </FormItem>
                                    {/*登录按钮*/}
                                    <FormItem>
                                        {getFieldDecorator('remember', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                        })(
                                            <Checkbox>记住我</Checkbox>
                                        )}
                                        <Tooltip title="请联系管理员">
                                            <a className={style.login_form_forgot}>忘记密码？</a>
                                        </Tooltip>
                                        <Button type="primary" htmlType="submit" className={style.login_form_button}>
                                            登 录
                                        </Button>
                                        或者 <Link to='/register'>现在注册</Link>
                                    </FormItem>
                                </Form>
                            </div>
                        </Col>
                        <Col xs={2} sm={6} md={9} className={style.flexbox}></Col>
                    </Row>
                </div>
                {/*粒子动画容器*/}
                <div id="particles-js" className={style.particles}></div>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default withRouter(WrappedNormalLoginForm);