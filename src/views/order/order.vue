<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="80px"
        class="demo-form-inline"
      >
        <el-form-item label="订单编号:">
          <el-input
            v-model="listQuery.order_no"
            clearable
            size="mini"
            placeholder="请输入订单编号"
            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="用户信息:">
          <el-input
            v-model="listQuery.userinfo"
            clearable
            size="mini"
            placeholder="请输入手机号/姓名"
            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="创建日期:">
          <el-date-picker
            v-model="listQuery.querydate"
            clearable
            size="mini"
            value-format="yyyy-MM-dd"
            unlink-panels
            type="daterange"
            class="filter-item"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <div>
          <el-form-item label="订单状态:">
            <el-radio-group
              v-model="listQuery.status"
              size="mini"
              @change="selectStatus()"
            >
              <!-- 状态：1 为 启用，2 停用 出库 3为 停用-->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button :label="1">已支付</el-radio-button>
              <el-radio-button :label="2">待支付</el-radio-button>
              <el-radio-button :label="3">已退款</el-radio-button>
              <el-radio-button :label="4">订单异常</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="支付方式:">
            <el-radio-group
              v-model="listQuery.pay_type"
              size="mini"
              @change="payTypeSelect()"
            >
              <!-- 1 小程序支付 2 余额支付 3其他方式支付-->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button :label="1">微信支付</el-radio-button>
              <el-radio-button :label="3">免费赠送</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
              >搜索</el-button
            >
            <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="success"
              icon="el-icon-download"
              @click="excelDown"
              >导出订单</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <div class="numblock" style="font-size:24px;margin:10px 50px;">
        总收款 ：
        <span style="font-size:30px;color:#13CE66;margin-right:16px">
          {{ (orderInfo.shoukuan + orderInfo.tuikuan).toFixed(2) }}
        </span>
        已退款：
        <span style="font-size:30px;color:#FF4949;margin-right:16px">
          {{ orderInfo.tuikuan.toFixed(2) }}
        </span>
        实际收入：
        <span style="font-size:30px;color:#13CE66">
          {{ orderInfo.shoukuan.toFixed(2) }}
        </span>
      </div>
    </el-card>
    <!-- 列表 -->
    <el-card style="margin-top: 20px">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label="编号"
          align="center"
          fixed="left"
          min-width="60px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="头像"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-avatar size="large" :src="row.headimgurl"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="订单号"
          align="center"
          :show-overflow-tooltip="true"
          min-width="150"
        >
          <template slot-scope="{ row }">
            <span>{{ row.order_no }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="付款金额"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.status | typeFilter">{{
              row.status | statusFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="支付时间"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.pay_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="handleReturn(row)"
              >退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <audio
      id="audio"
      hidden
      ref="audio"
      :src="audioUrl"
      :loop="false"
      controls="false"
      poster
      name="欢迎"
      binderror
      bindplay="bindplay"
      bindpause
      bindtimeupdate
      bindended
    ></audio>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 导入地点 -->
    <el-dialog
      title="订单备注"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="35%"
    >
      <el-form :model="form" label-width="100px" ref="formName" :rules="rules">
        <el-form-item label="订单编号:" prop="name">
          <span>{{ form.order_no }}</span>
        </el-form-item>
        <el-form-item label="订单备注:" label-position="right">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            clearable
            size="mini"
            placeholder="请输入订单备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProData()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getVipOrderList,
  setVipOrderRemark,
  returnVipOrder
} from "@/api/order";
// import { exportVipOrder } from "@/api/count";
import waves from "@/directive/waves"; // waves directive 123
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getVipOrderList",
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    // 状态订单状态 1 已支付 2 未支付 3 已退款 4 退款失败  5 待审批 6审批失败 7待退款
    statusFilter(status) {
      const statusMap = {
        1: "已支付",
        2: "待支付",
        3: "已退款",
        4: "订单异常"
      };
      return statusMap[status];
    },

    // 状态颜色
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "danger",
        4: "danger"
      };
      return statusMap[status];
    },
    // 1 小程序支付 2 余额支付 3其他方式支付
    payTypeFilter(pay_type) {
      const payTypeMap = {
        1: "微信支付",
        2: "余额支付",
        3: "免费赠送"
      };
      return payTypeMap[pay_type];
    }
  },

  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入地点名称", trigger: "change" }
        ],
        address: [{ required: true, message: "请输入地点", trigger: "change" }],
        // tump: [{ required: true, message: "请上传缩略图", trigger: "change" }],
        class_id: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        lng: [
          { required: true, message: "请输入地点经度lng", trigger: "change" }
        ],
        lat: [
          { required: true, message: "请输入地点纬度lat", trigger: "change" }
        ]
      },
      tableKey: 0,
      list: null,
      audioUrl:
        "https://voiceintelligent-1253824635.file.myqcloud.com/voiceintelligent/2022/03/97417e0a-ad55-4c8f-883a-27334299d6d7.mp3", //订单提醒
      total: 0,
      date: "",
      listLoading: false,
      table: true,
      orderInfo: "",
      options: [],
      status: "全部",
      disabled: "false",
      listQuery: {
        page: 1,
        pageSize: 10,
        order_no: "",
        status: "",
        pay_type: "",
        card_id: "",
        querydate: "",
        userinfo: ""
      },
      form: {}, //
      dialogFormVisible: false
    };
  },
  watch: {},
  created() {
    this.getList();
    console.log(this, "this.order");
  },
  // 离开页面时执行
  destroyed: function() {},
  methods: {
    // 导出
    excelDown() {
      const loading = this.$loading({
        lock: true,
        text: "下载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const payTypeMap = {
        1: "公众号",
        2: "小程序",
        3: "免费赠送"
      };
      const statusMap = {
        1: "已支付",
        2: "待支付",
        3: "已进入",
        4: "已退款",
        5: "订单异常"
      };
      exportVipOrder(this.listQuery).then(res => {
        let list = res.data;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "编号",
            "姓名",
            "订单号",
            "支付金额",
            "支付时间",
            "支付方式",
            "状态"
          ];
          let data = list.map(item => {
            return [
              item.id,
              item.name,
              item.order_no,
              item.price,
              item.pay_time,
              payTypeMap[item.pay_type],
              statusMap[item.status]
            ];
          });
          excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: "会员订单", //非必填
            autoWidth: true, //非必填
            bookType: "csv" //非必填
          });
          loading.close();
        });
        console.log(res);
      });
    },
    //提交订单备注
    submitProData() {
      setVipOrderRemark(this.form).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    //弹出导入地点表单
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    // 删除订单
    handleReturn(row) {
      this.$confirm("此操作将退回订单金额此操作比较敏感, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          returnVipOrder({
            id: row.id,
            order_no: row.order_no,
            price: row.price
          }).then(response => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 筛选地点状态
    selectStatus() {
      this.getList();
    },
    // 筛选支付方式
    payTypeSelect() {
      this.getList();
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getVipOrderList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.result;
        this.orderInfo = response.data.orderInfo;
        this.total = response.data.pageInfo.total;
      });
    },

    //筛选过滤
    handleFilter() {
      this.getList();
    }
  }
};
</script>
<style>
.demonstration {
  display: inline-block;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #606266;
}
.textinput {
  width: 60%;
}
.search {
  margin-left: 30px;
}
.list_time {
  width: 88px;
}
.sarch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  width: 80px;
  height: 80px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
