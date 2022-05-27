<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="shop_name" placeholder="下单店铺" style="width: 200px;" clearable @input="inputShopname" />
      <el-input v-model="order_detail" placeholder="商品描述" style="width: 200px;" clearable @input="inputorderDetail" />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter"> -->
      <!-- <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
      <!-- </el-select> -->
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        align="right"
        @change="fetchData"
      />
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button> -->
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button> -->
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
        <el-table-column label="下单时间">

          <template slot-scope="scope">
            <span>{{ scope.row.order_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单店铺">
          <template slot-scope="scope">
            <span>{{ scope.row.shop_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="转单价格">
          <template slot-scope="scope">
            <span>{{ scope.row.zhuandan_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售价格">
          <template slot-scope="scope">
            <span>{{ scope.row.sale_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" width="110" align="center">
          <!-- <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template> -->
          <template slot-scope="scope">
            <span>{{ scope.row.order_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="花娃订单编号" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hw_order_num }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="订单状态" label="订单状态" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_status | statusFilter">{{ scope.row.order_status }}</el-tag>
          </template>
        <!-- 待确认完成 -->
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="订单详情" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.order_detail }}</span>
          </template>
        <!-- 商品：33朵香槟玫瑰，3颗乒乓菊尤加利间插丰满，如图包装 -->
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="订单图片" width="200">
          <!-- <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template> -->
          <!-- <template slot-scope="scope">
          <img :src= "https://oss.huawa.com/shop/placeorder/07064049196934721.jpg"
        </template> -->
          <!-- <img src="https://oss.huawa.com/shop/placeorder/07064049196934721.jpg">
         -->
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope&&scope.row&&scope.row.order_pic" :preview-src-list="[scope&&scope.row&&scope.row.order_pic]" />
          </template>
        </el-table-column>
      </el-table>
      <template>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="50"
          layout="total,prev, pager, next, jumper"
          :total="page_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </div>
  </div></template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      shop_name: null,
      page: 1,
      currentPage: 1,
      page_count: 1,
      list: null,
      order_detail: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value2: '',
      start_time: undefined,
      end_time: undefined
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ 'page': this.page, 'hw_order_num': this.hw_order_num, 'order_detail': this.order_detail, 'order_num': this.order_num, 'order_pic': this.order_pic,
        'order_status': this.order_status, 'sale_price': this.sale_price, 'shop_name': this.shop_name,
        'zhuandan_price': this.zhuandan_price, 'order_time': this.order_time, 'start_time': this.value2[0], 'end_time': this.value2[1] }).then(response => {
        this.list = response.data.data.items
        console.log('aaaaaaaaaaaaaa')
        this.page_count = response.data.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.fetchData()
      console.log(`当前页: ${this.value2}`)
    },
    inputShopname() {
      this.page = 1
      this.currentPage = 1
      this.fetchData()
    },
    inputorderDetail() {
      this.page = 1
      this.currentPage = 1
      this.fetchData()
    }
  }
}
</script>
