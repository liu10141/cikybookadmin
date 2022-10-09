<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="160px"
        class="demo-form-inline"
      >
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
          <el-form-item label="状态:">
            <el-radio-group
              v-model="listQuery.status"
              size="mini"
              @change="selectStatus()"
            >
              <!-- 状态：1 为 启用，2 停用 出库 3为 停用-->
              <el-radio-button label>全部</el-radio-button>
              <el-radio-button :label="1">启用</el-radio-button>
              <el-radio-button :label="2">停用</el-radio-button>
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
              type="success"
              @click="handleaddBookClass"
              >添加书籍分类</el-button
            >
          </el-form-item>
        </div>
      </el-form>
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
          label="分类名称"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分类库存"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分类排序"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <span>{{ row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          :show-overflow-tooltip="true"
          min-width="60"
        >
          <template slot-scope="{ row }">
            <el-tag
              @click="handleModifyStatus(row.id, row.status)"
              :type="row.status | typeFilter"
              effect="dark"
            >
              {{ row.status | statusFilter }}
            </el-tag>
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
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="handleDel(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 导入地点 -->
    <el-dialog
      title="书籍分类"
      :visible.sync="dialogFormVisible"
      center
      top="5vh"
      width="20%"
    >
      <el-form :model="form" label-width="100px" ref="formName">
        <el-form-item label="状态:">
          <el-radio-group v-model="form.status" size="mini">
            <!-- 状态：1 为 启用，2 停用 出库 3为 停用-->
            <el-radio-button :label="1">启用</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            clearable
            size="mini"
            placeholder="请输入分类名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddData()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBookClass,
  addBookClass,
  editBookClass,
  delBookClass,
  editBookClassStatus
} from "@/api/book";
import waves from "@/directive/waves"; // waves directive 123
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getBookClass",
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
        1: "启用",
        2: "停用"
      };
      return statusMap[status];
    },

    // 状态颜色
    typeFilter(status) {
      const statusMap = {
        1: "success",
        2: "warning",
        3: "danger"
      };
      return statusMap[status];
    }
  },

  data() {
    return {
      cover: "",
      tableKey: 0,
      list: null,
      total: 0,
      date: "",
      action: process.env.VUE_APP_BASE_API + "/upImage",
      listLoading: false,
      table: true,
      formType: "",
      status: "全部",
      disabled: "false",
      listQuery: {
        page: 1,
        pageSize: 10,
        order_no: "",
        status: "",
        pay_type: "",
        querydate: "",
        userinfo: ""
      },
      form: {
        cover: "",
        img: ""
      }, //
      dialogFormVisible: false
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    //添加卡片到列表
    subAddData() {
      switch (this.formType) {
        case 1:
          addBookClass(this.form).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.getList();
            this.dialogFormVisible = false;
          });
          break;
        case 2:
          editBookClass(this.form).then(res => {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.getList();
            this.dialogFormVisible = false;
          });
          break;
      }
    },
    // 修改书籍照片状态
    handleModifyStatus(id, status) {
      const userstatus = status == 1 ? 2 : 1;
      const data = { status: userstatus, id: id };
      editBookClassStatus(data).then(() => {
        this.$notify({
          title: "Success",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      });
    },
    // 删除照片
    handleDel(id) {
      this.$confirm("此操作将删除书籍照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delBookClass({
            id: id
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
    // 上传封面成功
    handleAvatarSuccess(res) {
      this.imageloading = false;
      this.form.cover = res.data.imgUrl;
      this.cover = res.data.imgUrl;
    },
    //上传背景图片
    handleImgSuccess(res) {
      this.imageloading = false;
      this.form.img = res.data.imgUrl;
    },
    //修改卡包
    handleEdit(row) {
      this.formType = 2;
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    //添加卡片到卡包
    handleaddBookClass(row) {
      this.formType = 1;
      this.form = {
        status: 1
      };
      this.dialogFormVisible = true;
    },
    // 筛选地点状态
    selectStatus() {
      this.getList();
    },
    // 获取地点列表
    getList() {
      this.listLoading = true;
      getBookClass(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.result;
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
