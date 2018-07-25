<template>
<div class="login-container" id="particles" style="overflow-y:hidden;">
    <!-- <div class="logo-box">
        <img src="../../assets/logotext.png" alt="">
    </div> -->
    <el-form class="card-box" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="logo logo-box">
            <img src="../../assets/logo.png" alt="">
        </div>
        <!-- <h3 class="title">东方头条融媒体平台</h3> -->
        <img src="../../assets/logotext.png" alt="" style="height:46px;margin-bottom:20px">
        <el-form-item prop="username">
            <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="账号" @blur='isNeedVerifycode' />
        </el-form-item>

        <el-form-item prop="password">
            <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        <div style="display:flex;align-items:center;margin-bottom:20px;" v-if="isNeedCode">
            <el-form-item prop="verCode" style="flex:1;margin:0">
                <el-input style="width:auto" ref="sendCode" id='sendCode' name="password" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.verCode" autoComplete="off" placeholder="验证码" />
            </el-form-item>
            <div style="margin-left:4px;">
                <el-button type="success" v-if="btnHide" @click.native.prevent="validate_time" disabled style="width: 88px;height:42px;">{{valiCode}}</el-button>
                <el-button type="success" @click.native.prevent="validate_time" v-else style="width: 88px;height:42px;">{{valiCode}}</el-button>
            </div>
        </div>


        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        <!-- <div class="tips">账号:admin 密码随便填</div>
        <div class="tips">账号:editor 密码随便填</div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">打开第三方登录</el-button> -->
    </el-form>
    <!-- <el-dialog title="第三方验证" :visible.sync="showDialog">
        本地不能模拟，请结合自己业务进行模拟！！！<br/><br/><br/> 邮箱登录成功,请选择第三方验证
        <br/>
        <social-sign />
    </el-dialog> -->
</div>
</template>

<script>
import {
    isvalidUsername
} from '@/utils/validate'
import {
    verifySSOLogin,
    getVerCode,
    isNeedVerifycode
} from '@/api/login'
import socialSign from './socialsignin'
import particles from 'particles.js'
import md5 from 'js-md5';

export default {
    components: {
        socialSign
    },
    name: 'login',
    mounted() {
        // this.verifySSOLogin()
        particlesJS.load('particles', './static/data.json')
    },
    data() {
        var validateCode = (rule, value, callback) => {
            if (!this.isNeedCode) {
                callback();
            } else if (value === '') {
                callback(new Error('请输入验证码'));
            } else {
                callback();
            }
        };
        return {
            // 验证码
            btnHide: false,
            valiCode: '验证码',
            loginForm: {
                username: '',
                password: '',
                verCode: ''
            },
            loginRules: {
                username: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                verCode: [{
                    validator: validateCode,
                    trigger: 'change'
                }]
            },
            isNeedCode: true,
            pwdType: 'password',
            loading: false,
            showDialog: false
        }
    },
    methods: {
        // 验证码
        validate_time() {
            if (this.loginForm.username == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入账号'
                });
                return;
            }
            if (this.loginForm.password == '') {
                this.$message({
                    type: 'warning',
                    message: '请输入密码'
                });
                return;
            }
            var loginParams = 'username=' + this.loginForm.username + '&password=' + md5(this.loginForm.password);
            getVerCode(loginParams).then(res => {
                let {
                    code,
                    ret,
                    state,
                    data
                } = res;
                if (code === '00001') {
                    this.btnHide = true;
                    this.codeTimer(); //倒计时
                    this.loginForm.verCode = data;
                }
                this.$refs.sendCode.focus()
            })
        },
        codeTimer() { //计时器
            var _this = this;
            var num = 60;
            var timer = setInterval(function() {
                _this.valiCode = num + "s";
                num--;
                if (num < 0) {
                    clearInterval(timer);
                    _this.valiCode = "重新发送";
                    _this.btnHide = false;
                    num = 60;
                }
            }, 1000);
        },
        isNeedVerifycode() {
            if (this.loginForm.username == '') {
                return;
            }
            isNeedVerifycode({
                userName: this.loginForm.username
            }).then(res => {
                this.isNeedCode = res.verifycode;
            });
        },
        verifySSOLogin() {
            verifySSOLogin().then(res => {
                if (res.state) {
                    this.$store.dispatch('LoginByUsername', 'username=&password=&verifyCode=').then(() => {
                        this.$router.push({
                            path: '/'
                        })
                    }).catch(() => {

                    })
                }
            })
        },
        format(time, format) {
            var t = new Date(time);
            var tf = function(i) {
                return (i < 10 ? '0' : '') + i
            };
            return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, function(a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                    case 'SSS':
                        return tf(t.getMilliseconds())
                }
            })
        },
        showPwd() {
            if (this.pwdType === 'password') {
                this.pwdType = ''
            } else {
                this.pwdType = 'password'
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('LoginByUsername', 'username=' + this.loginForm.username + '&password=' + md5(this.loginForm.password) + '&verifyCode=' + this.loginForm.verCode).then(() => {
                        this.loading = false
                        this.$router.push({
                            path: '/'
                        })
                        this.showDialog = true
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        },
        afterQRScan() {
            // const hash = window.location.hash.slice(1)
            // const hashObj = getQueryObject(hash)
            // const originUrl = window.location.origin
            // history.replaceState({}, '', originUrl)
            // const codeMap = {
            //   wechat: 'code',
            //   tencent: 'code'
            // }
            // const codeName = hashObj[codeMap[this.auth_type]]
            // if (!codeName) {
            //   alert('第三方登录失败')
            // } else {
            //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            //     this.$router.push({ path: '/' })
            //   })
            // }
        }
    },
    created() {
        // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan)
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.logo-box {
    width: 70px;
    height: 67px;
    border-radius: 50%;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 4px 4px 12px 0 rgba(0,0,0,.3);
    img {
        width: 70px;
    }
}
.card-box {
    width: 400px;
    position: absolute;
    right: 100px;
    top: 46%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    padding: 60px 40px;
    background-color: rgba(24,60,104,0.4);
}
.login-container {
    @include relative;
    height: 100vh;
    background: $bg url('../../assets/background.jpg') 100% 100%;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0 auto 40px;
        text-align: center;
        font-weight: bold;
    }
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px;
        margin: 120px auto;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .thirdparty-button {
        position: absolute;
        right: 35px;
        bottom: 28px;
    }
}
</style>
