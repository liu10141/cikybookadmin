<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="80px"
        size="mini"
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
        <el-form-item label="座位编号:">
          <el-input
            v-model="listQuery.table_no"
            clearable
            placeholder="请输入座位编号"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="书籍状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus()"
          >
            <!-- 状态：1 为 上架，2 下架 出库 3为 下架-->
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
            type="success"
            icon="el-icon-upload"
            @click="handleAdd"
            >添加座位编码</el-button
          >
          <!-- <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="danger"
              icon="el-icon-arrow-down"
              @click="handleAllSetStatus()"
              >批量下架</el-button
            > -->
          <el-button
            v-waves
            size="mini"
            class="filter-item search"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >
        </el-form-item>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="编号"
          align="center"
          fixed="left"
          min-width="40"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center" min-width="130">
          <template slot-scope="{ row }">
            <el-image
              style="height:80px"
              fit="cover"
              :src="row.mini_code"
              :preview-src-list="[row.mini_code]"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column
          sortable
          label="桌号"
          align="center"
          min-width="60"
          prop="table_no"
        />
        <el-table-column
          sortable
          label="状态"
          align="center"
          :show-overflow-tooltip="true"
          min-width="60"
        >
          <template slot-scope="{ row }">
            <el-tag :type="row.status | typeFilter">{{
              row.status | statusFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="上架时间"
          align="center"
          :show-overflow-tooltip="true"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="{ row }">
            <!-- <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            > -->
            <el-button
              size="mini"
              :type="row.status == 1 ? 'danger' : 'success'"
              @click="handleModifyStatus(row.id, row.status, row.class_id)"
              >{{ row.status == 1 ? "停用" : "启用" }}</el-button
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
      title="添加座位"
      :visible.sync="dialogFormVisible"
      center
      top="10vh"
      width="32%"
    >
      <el-form
        :model="form"
        inline
        ref="fromdata"
        label-width="90px"
        :rules="rules"
      >
        <el-form-item label="座位编号:" prop="table_no">
          <el-input-number
            v-model.number="form.table_no"
            :min="1"
            label="座位编号"
          ></el-input-number>
          <!-- <el-input
            v-model="form.author"
            placeholder="请输入座位编号"
            class="filter-item"
            clearable
          /> -->
        </el-form-item>
        <!-- <el-form-item label="展示状态:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio-button :label="1">上架</el-radio-button>
            <el-radio-button :label="2">下架</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData()">立即提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTableList,
  getSelectBookClass,
  delBook,
  setTableStatus,
  editBook,
  addTable,
  setAllbookStatus,
  getBookSelectShelf
} from "@/api/book";
import waves from "@/directive/waves"; // waves directive 123
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getTableList",
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
        2: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      rules: {
        cover: [{ required: true, message: "请上传封面", trigger: "change" }],
        book_name: [{ required: true, message: "请填写书名", trigger: "blur" }],
        table_no: [
          { required: true, message: "请填写书桌编号", trigger: "blur" }
        ],
        book_code: [
          { required: true, message: "请填写图书编号", trigger: "blur" }
        ],
        book_no: [
          { required: true, message: "请填写内部编码", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        sale_price: [
          { required: true, message: "请填写售卖价格", trigger: "blur" }
        ],
        unit_price: [
          { required: true, message: "请填写租用费用", trigger: "blur" }
        ],
        class_id: [
          { required: true, message: "请填写所属分类", trigger: "change" }
        ],
        shelf: [
          { required: true, message: "请填写所属书架", trigger: "change" }
        ],
        stars: [
          { required: true, message: "请填写推荐指数", trigger: "change" }
        ]
      },
      tableKey: 0,
      list: null,
      total: 0,
      action: process.env.VUE_APP_BASE_API + "/upImage",
      date: "",
      listLoading: false,
      imgfilelist: [],
      table: true,
      multipleSelection: [],
      status: "全部",
      ShelfOptions: [],
      ClassOptions: [],
      fileList: [],
      disabled: "false",
      listQuery: {
        page: 1,
        pageSize: 10,
        table_no: "",
        status: "",
        tags: "",
        querydate: ""
      },
      form: {
        status: 1,
        author: "",
        book_code: "",
        book_name: "",
        table_no: "",
        book_no: "",
        class_name: "",
        cover: "",
        sale_price: "",
        unit_price: "",
        is_tui: "",
        desc: ""
      }, //
      formType: "",
      dialogFormVisible: false,
      dialogAddFormVisible: false
    };
  },
  watch: {},
  created() {
    this.getList();
    // 获取书籍分类
    getSelectBookClass().then(res => {
      this.ClassOptions = res.data;
    });
    getBookSelectShelf().then(res => {
      this.ShelfOptions = res.data;
    });
  },
  methods: {
    // 选择的需要删除的记录
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(row => {
        this.multipleSelection.push(row.id);
      });
    },
    //删除文件列表
    onimageremove(file, fileList) {
      this.imgfilelist = fileList;
    },
    // 批量下架书籍
    handleAllSetStatus() {
      this.listLoading = true;
      if (this.multipleSelection.length == 0) {
        this.$notify({
          title: "小提示",
          message: "请先选择需要操作的记录",
          type: "error",
          duration: 3000
        });
        this.listLoading = false;
        return;
      }
      // 批量还车
      setAllbookStatus({ ids: this.multipleSelection }).then(response => {
        this.$notify({
          title: "Success",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      });
    },
    //提交订单备注
    submitEditData() {
      this.$refs["fromdata"].validate(valid => {
        if (valid) {
          switch (this.formType) {
            case 1:
              addTable(this.form).then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.getList();
                this.$refs["fromdata"].resetFields();
                this.dialogFormVisible = false;
              });
              break;
            case 2:
              editBook(this.form).then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.getList();
                this.$refs["fromdata"].resetFields();
                this.dialogFormVisible = false;
              });
              break;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传封面成功
    handleAvatarSuccess(res) {
      this.imageloading = false;
      this.form.cover = res.data.imgUrl;
    },
    // 修改书籍状态
    handleModifyStatus(id, status, class_id) {
      const userstatus = status == 1 ? 2 : 1;
      const data = { status: userstatus, id: id, class_id: class_id };
      setTableStatus(data).then(() => {
        this.$notify({
          title: "Success",
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      });
    },
    //修改书籍
    handleEdit(row) {
      this.formType = 2;
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      console.log(this.form);
      // this.$refs["fromdata"].resetFields();
    },
    //录入书籍
    handleAdd() {
      this.formType = 1;
      // this.form = {
      //   status: 1,
      //   cover: ""
      // };
      this.dialogFormVisible = true;
    },
    // 删除书籍
    handleDel(id, url) {
      this.$confirm("此操作将删除相册照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger"
      })
        .then(() => {
          delBook({
            id: id,
            url: url
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
    // 筛选书籍
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
      getTableList(this.listQuery).then(response => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = list.map(item => {
          item["shelf"] = item["shelf_name"];
          return item;
        });
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
  margin-left: 100px;
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
.el-upload--Bookture-card {
  width: 178px;
  height: 178px;
  line-height: 178px;
}
.el-upload-list--Bookture-card .el-upload-list__item {
  width: 178px;
  height: 178px;
  /* line-height: 178px; */
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
.itme_box p {
  padding: 0;
  margin: 0;
}
.ratestyle {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  height: 36px;
}
</style>
