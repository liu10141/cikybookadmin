<template>
  <el-card style="margin: 20px">
    <div class="dashboard-container">
      <h3>系统设置：用于添加管理员和修改密码。</h3>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";

export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
      ws: null
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    console.log(this);
    if (!this.roles.includes("admin")) {
      this.currentRole = "editorDashboard";
    }
    // this.WebSocketinit();
  },
  methods: {
    // 创建socket
    WebSocketinit() {
      let that = this;
      if ("WebSocket" in window) {
        // 打开一个 web socket
        this.ws = new WebSocket("ws://47.111.178.57:8282");
        this.ws.onopen = () => {
          console.log("链接成功");
        };

        this.ws.onmessage = function(evt) {
          var received_msg = evt.data;
          received_msg = JSON.parse(received_msg);
          if (received_msg.type == "msg") {
            console.log(received_msg);
            that.$notify({
              title: "成功",
              message: `${received_msg.msg}`,
              type: "success"
            });
          }
        };
        this.ws.onclose = function() {
          // 关闭 websocket
        };
      } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    }
  },
  beforeDestroy() {
    console.log(1112);
    this.ws.close();
  }
};
</script>
