<template>
  <div>
    <el-card style="margin:20px">
      <el-form
        :inline="true"
        :model="listQuery"
        label-width="80px"
        size="mini"
        class="demo-form-inline"
      >
        <el-form-item label="上传日期:">
          <el-date-picker
            v-model="listQuery.querydate"
            clearable
            value-format="yyyy-MM-dd"
            unlink-panels
            type="daterange"
            class="filter-item"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="图书名称:">
          <el-input
            v-model="listQuery.userinfo"
            clearable
            placeholder="请输入图书名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
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
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin:20px" v-loading="listLoading" class="">
      <div class="imagelist">
        <div v-for="(item, index) in list" :key="index" class="blockimage">
          <el-image
            style="width:100%; height: 200px"
            :preview-src-list="[item.url]"
            fit="cover"
            :src="item.url + '?imageView2/2/w/400'"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="button">
            <el-avatar :src="item.headimgurl"></el-avatar>
            <div class="userinfo">
              <p class="name">{{ item.name }}</p>
              <p>{{ item.mobile }}</p>
              <p>{{ item.create_time }}</p>
            </div>
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              circle
              @click="download(item.url)"
            ></el-button>
            <!-- <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button> -->
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin:20px">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getImgList } from "@/api/book";
export default {
  name: "imageList",
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      total: 0,
      list: [],
      imglist: [],
      listQuery: {
        userinfo: "",
        querydate: "",
        page: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //筛选过滤
    handleFilter() {
      this.getList();
    },
    download(imgUrl) {
      const a = document.createElement("a");
      // 这里是将url转成blob地址，
      fetch(imgUrl) // 跨域时会报错
        .then(res => res.blob())
        .then(blob => {
          // 将链接地址字符内容转变成blob地址
          a.href = URL.createObjectURL(blob);
          a.download = "天空之橙·城市书房打卡图片"; // 下载文件的名字
          document.body.appendChild(a);
          a.click();
          //在资源下载完成后 清除 占用的缓存资源
          window.URL.revokeObjectURL(a.href);
          document.body.removeChild(a);
        });
    },
    getList() {
      this.listLoading = true;
      getImgList(this.listQuery).then(response => {
        this.listLoading = false;
        let list = response.data.result;
        this.list = response.data.result;
        console.log(list, "1213132123123");
        this.imglist = list.map(item => {
          return item.url;
        });
        this.total = response.data.pageInfo.total;
      });
    }
  }
};
</script>

<style lang="scss">
.imagelist {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .blockimage {
    position: relative;
    width: 24%;
    margin-bottom: 10px;
    margin-right: 10px;
    .button {
      // position: absolute;
      width: 100%;
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      box-sizing: border-box;
      .userinfo {
        line-height: 1.2;
        .name {
          font-weight: 600;
        }
        p {
          margin: 0;
          text-align: center;
        }
      }
    }
  }
}
</style>
