<template>
  <div class="dashboard-container">
    <div class="dashboard-text" style="text-align:center;margin-bottom:20px">天地链运输监控平台</div>
    <el-row :gutter="32">
      <el-col :xs="48" :sm="48" :lg="16">
        <div class="chart-wrapper">
          <el-row>
            <el-form ref="searchForm" class="mtb-20" :model="searchForm" label-width="120px">
              <el-col :span="14">
                <el-date-picker  v-model="searchForm.time" type="daterange" range-separator="-"
                  start-placeholder="对账单开始日期"
                  end-placeholder="对账单结束日期">
                </el-date-picker>
              </el-col>
              <el-button type="primary" v-waves icon="search" @click="handleSearch()">确定</el-button>
            </el-form>
          </el-row>
          <el-row style="margin-top:40px;padding-bottom:20px;border-bottom: 1px solid;">
          监控数据一览
          </el-row>
          <el-row>
        <el-col  :xs="12" :sm="12" :lg="6">
        <div class="card-panel-description">
          <div class="card-panel-text">
            整合社会车辆
          </div>
          <div class="card-panel-num">
            整合 辆
          </div>
        </div>
        </el-col>
        <el-col  :xs="12" :sm="12" :lg="6">
        <div class="card-panel-description">
          <div class="card-panel-text">
            运单规模
          </div>
          <div class="card-panel-num">
            整合{{order_quantity}}单
          </div>
        </div>
        </el-col>
        <el-col  :xs="12" :sm="12" :lg="6">
        <div class="card-panel-description">
          <div class="card-panel-text">
            货运总量
          </div>
          <div class="card-panel-num">
            整合 吨
          </div>
        </div>
        </el-col>
        <el-col  :xs="12" :sm="12" :lg="6">
        <div class="card-panel-description">
          <div class="card-panel-text">
            运费总额
          </div>
          <div class="card-panel-num">
            整合{{ amount }}元
          </div>
        </div>
        </el-col>
          </el-row>
          <el-row style="margin-top:40px;padding-bottom:20px;border-bottom: 1px solid;">
          各项异常占比
          </el-row>
          <el-row>
          <div class="chart-wrapper">
            <raddar-chart v-bind:abnormal_percent="passProp.abnormal_percent" :key="componentKey"> </raddar-chart>
          </div>
          </el-row>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <abnormal-list />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <abnormal-table />
    </el-row>
  </div>
</template>

<script>
import { dashboard, updateUser } from '@/api/user'
import { fetchRoleList } from '@/api/role'
import { mapGetters } from 'vuex'
import RaddarChart from './components/RaddarChart'
import AbnormalTable from './components/AbnormalTable'
import AbnormalList from './components/AbnormalList'
import waves from '@/directive/waves/index.js' // 点击按钮时候显示水波纹动画
export default {
  name: 'dashboard',
  components: {
    RaddarChart,
    AbnormalTable,
    AbnormalList
  },
  directives: {
    waves
  },
  data() {
    return {
      downloadLoading: false,
      listLoading: false,
      myDate: new Date(),
      amount: null,
      componentKey: 0,
      order_quantity: null,
      searchForm: {
        time: [new Date(), new Date()]
      },
      passProp: {
        abnormal_percent: null
      },
      listPageParams: {
        pageNo: 1,
        pageNum: 20,
        username: ''
      },
      tableKey: 0,
      total: null,
      dialogFormVisible: false, // 表单是否显示
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.myDate = new Date()
    this.searchForm.time[0] = new Date(this.myDate.setDate(this.myDate.getDate() - 14))
    this.getUserList()
    // this.getRoleList()
    // 设置权限，后续将采用动态方式
    this.user_upd = this.permissions['user_upd']
    this.user_del = this.permissions['user_del']
    this.user_add = this.permissions['user_add']
  },
  methods: {
    getUserList() {
      dashboard(this.searchForm.time[0].getFullYear(), this.searchForm.time[0].getMonth() + 1, this.searchForm.time[0].getDate(), this.searchForm.time[1].getFullYear(), this.searchForm.time[1].getMonth() + 1, this.searchForm.time[1].getDate()).then(res => {
        this.passProp.abnormal_percent = res.abnormal_percent
        this.amount = res.amount
        this.order_quantity = res.order_quantity
        this.componentKey += 1
      })
    },

    getTimeString(d) {
      if (d) {
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
      } else {
        return ''
      }
    },
    getRoleList() {
      fetchRoleList().then(res => {
        this.editRolesOptions = res.data
      })
    },
    reset() {
      this.searchForm.time = ''
      this.searchForm.vendor = this.searchForm.serial_id = this.searchForm.invoice_org = this.searchForm.min_create = this.searchForm.max_create = ''
      this.getUserList()
    },
    goWaybillDetail(id) {
      this.$router.push({ path: `orther/${id}` })
    },
    handleSearch() { // 搜索
      console.log(this.searchForm.time[0])
      var d0 = this.searchForm.time[0]
      this.searchForm.min_create = this.getTimeString(d0)
      var d1 = this.searchForm.time[1]
      this.searchForm.max_create = this.getTimeString(d1)
      this.listPageParams.pageNo = 0
      this.getUserList()
    },
    handlePageNumChange(_pageNum) { // 每页显示数量变化
      this.listPageParams.pageNum = this.searchForm.limit = _pageNum
      this.listPageParams.pageNum = _pageNum
      this.getUserList()
    },
    handlePageNoChange(_pageNo) { // 页码变化
      this.listPageParams.pageNo = _pageNo
      this.searchForm.offset = this.listPageParams.pageNum * (_pageNo - 1)
      this.getUserList()
    },
    formCancel(_from) {
      this.dialogFormVisible = false
      this.$refs[_from].resetFields()
    },
    formUpdate(_from) {
      const f = this.$refs
      f[_from].validate(r => {
        if (!r) return r
        updateUser(this.editForm).then(res => {
          if (!res.data) {
            this.$notify({ title: '失败', message: '修改失败', type: 'error', duration: 2000 })
          } else {
            this.dialogFormVisible = false
            this.getUserList()
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
          }
        })
        return r
      })
    },
    formReset() {
      this.editForm = {
        username: '',
        password: '',
        statu: '',
        roleId: ''
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSelectionChange(val) {
      var val0 = JSON.parse(JSON.stringify(val))
      val0.forEach(function(a) {
        const date = new Date(a.create_time * 1000)
        a.create_time = date.toLocaleString()
      })
      this.multipleSelection = val0
    }
  },
  computed: {
    ...mapGetters([
      'permissions',
      'name',
      'roles'
    ])
  }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
  
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
    .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
      .card-panel-description {
        float: left;
        font-weight: bold;
        margin-top: 16px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 14px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          line-height: 20px;
          color: #000;
          font-size: 20px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
