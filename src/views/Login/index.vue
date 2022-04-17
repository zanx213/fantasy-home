<template>
  <div class="login">
    <div class="loginBox">
      <h2>登录</h2>
      <div class="item">
        <span>用户名</span>
        <a-input
          v-model:value="formState.username"
          type="text"
          @keyup.enter="submit"
        />
      </div>
      <div class="item password">
        <span>密码</span>
        <a-input
          v-model:value="formState.password"
          type="password"
          @keyup.enter="submit"
        />
      </div>

      <button class="btn" @click="submit">
        submit
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '@/request/api'
// import { closeCircleOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const formState = reactive({
  username: '',
  password: ''
})

const getUser = () => {
  return new Promise(resolve => {
    api.common.getUser().then(res => {
      const data = res.data
      localStorage.setItem('user', JSON.stringify(data))
      resolve()
    })
  })
}

const submit = () => {
  if (!formState.username) return message.error('请输入用户名')
  if (!formState.password) return message.error('请输入密码')
  api.common
    .login({
      username: formState.username,
      password: formState.password
    })
    .then(async res => {
      if (res.code === 0) {
        message.success('登录成功')
        localStorage.setItem('token', res.data.access_token)
        await getUser()
        router.push('/')
      } else {
        message.error(res.msg)
      }
    })
}
</script>

<style lang="scss" scoped>
input,
button {
  background: transparent;
  border: 0;
  outline: none;
}
.login {
  height: 100vh;
  background: linear-gradient(#141e30, #243b55);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #03e9f4;
}
.loginBox {
  width: 400px;
  height: 364px;
  background-color: #0c1622;
  margin: 100px auto;
  border-radius: 10px;
  box-shadow: 0 15px 25px 0 rgba(0, 0, 0, 0.6);
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  .ant-input {
    border-bottom: 1px solid #fff;
    color: #fff;
    padding-left: 0;
  }
  .ant-input:focus,
  .ant-input:hover {
    border-bottom: 1px solid #fff;
    box-shadow: none;
  }
}

h2 {
  font-size: 24px;
  text-align: center;
  color: aliceblue;
  margin-bottom: 30px;
  font-family: 'Courier New', Courier, monospace;
}

.item {
  text-align: left;
  > span {
    font-size: 14px;
  }
}
.password {
  margin-top: 10px;
}

.btn {
  width: 35%;
  padding: 10px 20px;
  margin-top: 40px;
  color: #03e9f4;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn:hover {
  border-radius: 5px;
  color: #fff;
  background: #03e9f4;
  box-shadow: 0 0 5px 0 #03e9f4, 0 0 25px 0 #03e9f4, 0 0 50px 0 #03e9f4,
    0 0 100px 0 #03e9f4;
  transition: all 1s linear;
}

.btn > span {
  position: absolute;
}

.btn > span:nth-child(1) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, transparent, #03e9f4);
  left: -100%;
  top: 0px;
  animation: line1 1s linear infinite;
}

@keyframes line1 {
  50%,
  100% {
    left: 100%;
  }
}

.btn > span:nth-child(2) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, #03e9f4);
  right: 0px;
  top: -100%;
  animation: line2 1s 0.25s linear infinite;
}

@keyframes line2 {
  50%,
  100% {
    top: 100%;
  }
}

.btn > span:nth-child(3) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, #03e9f4, transparent);
  left: 100%;
  bottom: 0px;
  animation: line3 1s 0.75s linear infinite;
}

@keyframes line3 {
  50%,
  100% {
    left: -100%;
  }
}

.btn > span:nth-child(4) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, #03e9f4);
  left: 0px;
  top: 100%;
  animation: line4 1s 1s linear infinite;
}

@keyframes line4 {
  50%,
  100% {
    top: -100%;
  }
}
</style>
