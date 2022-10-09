<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-card>
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="80px"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item label="日期:">
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
        <!-- <el-form-item label="所属分类:">
          <el-select
            v-model="listQuery.class_id"
            filterable
            clearable
            placeholder="请选择所属分类"
          >
            <el-option
              v-for="item in ClassOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="所属书架:">
          <el-select
            v-model="listQuery.shelf"
            filterable
            clearable
            placeholder="请选择所属书架"
          >
            <el-option
              v-for="item in ShelfOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="评论内容:">
          <el-input
            v-model="listQuery.content"
            clearable
            placeholder="请输入评论内容"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="评论状态:">
          <el-radio-group
            v-model="listQuery.status"
            size="mini"
            @change="selectStatus()"
          >
            <!-- 状态：1 为 上架，2 下架 出库 3为 下架-->
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button :label="1">展示</el-radio-button>
            <el-radio-button :label="2">隐藏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <!-- <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="success"
              icon="el-icon-upload"
              @click="handleAdd"
              >录入书籍</el-button
            > -->
          <!-- <el-button
              v-waves
              size="mini"
              class="filter-item search"
              type="danger"
              icon="el-icon-arrow-down"
              @click="handleAllSetStatus()"
              >批量删除</el-button
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
        <!-- </div> -->
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
        <el-table-column type="selection" width="55" align="center" />
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
        <el-table-column label="图书信息" align="center" fixed="left">
          <template slot-scope="{ row }">
            <div style="color:#1890FF">
              {{ row.book_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center" min-width="100">
          <template slot-scope="{ row }">
            <el-image
              style="height:80px"
              fit="cover"
              :src="row.cover + '?imageView2/1/w/200/h/200'"
              :preview-src-list="[row.cover]"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column label="昵称" align="center" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" align="center" min-width="230">
          <template slot-scope="{ row }">
            <div style="color:#1890FF">
              {{ row.content }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
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
        </el-table-column> -->
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
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="{ row }">
            <!-- <el-button type="primary" size="mini" @click="handleEdit(row)"
              >编辑</el-button
            > -->
            <el-button type="danger" size="mini" @click="handleDel(row.id)"
              >删除</el-button
            >
            <!-- <el-button
              size="mini"
              :type="row.status == 1 ? 'danger' : 'success'"
              @click="handleModifyStatus(row.id, row.status, row.class_id)"
              >{{ row.status == 1 ? "下架" : "上架" }}</el-button
            > -->
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
      title="书籍信息"
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
        <el-form-item label="图书封面:" label-position="right" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="action"
            name="file"
            accept="image/*"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
          >
            <el-image class="avatar" :src="form.cover" v-if="form.cover" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="书名:" prop="book_name">
          <el-input
            v-model="form.book_name"
            placeholder="请输入输入书名"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item label="作者:" prop="author">
          <el-input
            v-model="form.author"
            placeholder="请输入输入书名"
            class="filter-item"
            clearable
          />
        </el-form-item>

        <el-form-item label="图书编号:" prop="book_code">
          <el-input
            v-model="form.book_code"
            placeholder="请输入输入图书编号"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item label="内部编码:" prop="book_no">
          <el-input
            v-model="form.book_no"
            placeholder="请输入输入内部编码"
            class="filter-item"
            clearable
          />
        </el-form-item>

        <el-form-item label="售卖价格:" prop="sale_price">
          <el-input-number
            v-model="form.sale_price"
            controls-position="right"
            :min="1"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="租用费用:" prop="unit_price">
          <el-input-number
            v-model="form.unit_price"
            controls-position="right"
            :min="1"
            :max="10000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="所属分类:" prop="class_id">
          <el-select
            v-model="form.class_id"
            filterable
            placeholder="请选择所属分类"
          >
            <el-option
              v-for="item in ClassOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属书架:" prop="shelf">
          <el-select
            v-model="form.shelf"
            filterable
            placeholder="请选择所属书架"
          >
            <el-option
              v-for="item in ShelfOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐指数:" prop="stars">
          <div class="ratestyle">
            <el-rate v-model="form.stars"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="展示状态:" prop="status">
          <el-radio-group v-model="form.status" size="mini">
            <!-- 状态：1 为 上架，2 下架 出库 3为 下架-->
            <el-radio-button :label="1">上架</el-radio-button>
            <el-radio-button :label="2">下架</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐:" prop="is_tui">
          <el-radio-group v-model="form.is_tui" size="mini">
            <!-- 状态：1 为 上架，2 下架 出库 3为 下架-->
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="2">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
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
  getBookCommentList,
  getSelectBookClass,
  delComment,
  editbookstatus,
  editBook,
  addBook,
  setAllbookStatus,
  getBookSelectShelf
} from "@/api/book";
import waves from "@/directive/waves"; // waves directive 123
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "getBookCommentList",
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
        1: "展示",
        2: "隐藏"
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
        author: [{ required: true, message: "请填写作者", trigger: "blur" }],
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
        status: "",
        tags: "",
        querydate: ""
      },
      form: {
        author: "",
        book_code: "",
        book_name: "",
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
    handdelComment(id) {
      delComment({ id }).then(res => {
        this.getList();
      });
    },
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
              addBook(this.form).then(res => {
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
      editbookstatus(data).then(() => {
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
      this.$confirm("此操作将删除评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger"
      })
        .then(() => {
          delComment({
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
      getBookCommentList(this.listQuery).then(response => {
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
