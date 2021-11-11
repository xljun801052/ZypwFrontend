<template>
  <div id="app">
    <div id="header">
      <div id="navbar_img">
        <img src="~assets/imgs/theme/tutu.png" alt="404"/>
      </div>
      <div id="navbar_motto">
        <span
        >请看我头戴簪花,一路走来一路盛开, 频频遗漏一些,又深陷风霜雨雪的感动...
        </span>
      </div>
      <!--退出登录-->
      <div id="logout_img" @click="logout">
        <img src="~assets/imgs/utils/logout.png">
      </div>
      <!-- <Divider /> -->
      <!-- <div class="header-col2">
          <div class="grid-content bg-purple-light">Motto</div>
          <div class="grid-content bg-purple-light">她那个时候年轻不懂事，不明白很多东西早已暗中标好了价格</div>
        </div>
        <div class="header-col3">
          <i id="qq" class="iconfont icon-zypw-QQ">2074863066</i>
          <i id="wechat" class="iconfont icon-zypw-weixin">zy1614735214</i>
          <i id="telephone" class="iconfont icon-zypw-iPhoneX">17317673034</i>
          <i id="settings" class="el-icon-setting">设置</i>
        </div> -->
    </div>
    <div id="body">
      <div id="narbar_link">
        <!--        <router-link to="/login">登录</router-link>-->
        <div class="link_content">
          <img src="~assets/imgs/emotions/happy.png">
          <router-link to="/homepage" class="module_link">随笔小札</router-link>
        </div>
        <div class="link_content">
          <img src="~assets/imgs/emotions/heihei.png">
          <router-link to="/pictures" class="module_link">Pic记录</router-link>
        </div>
        <div class="link_content">
          <img src="~assets/imgs/emotions/illumute.png">
          <router-link to="/vlogs" class="module_link">v-log生活</router-link>
        </div>
        <!--        <router-link to="/profile"></router-link>-->
      </div>
      <div>
        <!--router-view会替换掉展示组件的第一层根标签-->
        <router-view id="content-view" class="view"></router-view>
      </div>
      <!--<div id="search">
          <el-input
            id="searchInput"
            style="width: 800px; height: 50px;margin-left: 650px;margin-top: 50px"
            prefix-icon="iconfont icon-zypw-weixin"
            suffix-icon="el-icon-search"
            placeholder=" 搜你所想..."
            v-model="input"
            :disabled="false">
          </el-input>
        </div>-->
    </div>
  </div>
</template>

<script>
  import homepageRequest from "./network/homepageRequest";

  export default {
    name: "App",
    data() {
      return {};
    },
    created() {

    },
    methods: {
      logout() {
        // 账户退出
        homepageRequest({
          url: "/logout",
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          data: {
            "xxx": "yyy"
          }
        }).then((res) => {
          // todo:这里的取值时res.code可是登录的地方是res.data.code！！！所以这个到底data是不是算axios封装的？什么时候有什么时候没有？？？
          if (res.code = 216) {
            // 删除本地access_token
            window.localStorage.removeItem("access_token");
            alert(res.msg);
            this.$router.push("/")
          } else {
            alert(res.msg);
          }
        }).catch((res) => {
          alert("退出异常~~");
        });
        
      }
    }
  };
</script>

<style scoped>
  #app {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-image: url("~@/assets/imgs/background/bgimg1.jpg"); /*!*css中使用别名'~@'*!*/
    background-size: cover; /*设置背景图充满屏幕*/
    background-repeat: no-repeat; /*设置背景图不重复*/
  }

  #header {
    display: flex;
  }

  #navbar_img img {
    border-radius: 50%;
    position: absolute;
    top: 30px;
    left: 160px;
    height: 120px;
    width: 120px;
  }

  #navbar_motto {
    width: 420px;
    font-family: 楷体;
    font-size: 25px;
    color: rgb(34, 8, 66);
    position: absolute;
    top: 50px;
    left: 450px;
  }

  #narbar_link {
    width: 200px;
    position: relative;
    margin-top: 15%;
    /*margin-left: 40%;*/
    display: flex;
    flex-direction: column;
    margin-left: 160px;
    font-family: "Arial Black";
    font-size: 25px;
    text-shadow: 0 0 20px #fdec84,
    10px -10px 30px #ffae35,
    20px -20px 40px #ec760c,
    -20px -60px 50px #cd4607,
    0px -80px 60px #973717,
    10px -40px 70px #451b0e;
  }

  .link_content {
    display: flex;
    text-align: center;
    font-family: 楷体;
    font-weight: bold;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 30px;
  }

  #narbar_link div img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  #content-view {
    width: 60%;
    height: 60%;
    position: relative;
    top: -250px;
    left: 450px;
    /* border: 1px solid deeppink; */
  }

  #logout_img img {
    height: 32px;
    width: 32px;
    position: absolute;
    right: 50px;
    top: 50px;
  }
</style>
