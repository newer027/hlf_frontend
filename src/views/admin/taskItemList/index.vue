<template>
  <div class="app-container calendar-list-container">
    <el-form ref="searchForm" class="mtb-20" :model="searchForm" label-width="120px">
  
      <el-row>
        <el-col :span="8">
        <el-input style="width: 200px;"  placeholder="供应商" v-model="searchForm.vendor" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-col :span="8">
        <el-date-picker  v-model="searchForm.time" type="daterange" range-separator="-"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期">
        </el-date-picker>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="8">
        <el-input style="width: 200px;" placeholder="发车单号" v-model="searchForm.serial_id" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-col :span="8">
        <el-input style="width: 200px;" placeholder="签约主体" v-model="searchForm.invoice_org" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-button type="primary" v-waves icon="search" @click="handleSearch()">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button :loading="downloadLoading" style="margin-bottom:20px; float:right" type="primary" icon="document" @click="handleDownload">
          导出选中行
        </el-button>
      </el-row>
    </el-form>

    <el-table ref="multipleTable" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'vendor', order: 'descending'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="运单号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.serial_id}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="日期时间" prop="create_time">
        <template slot-scope="scope">
          <span>
            {{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="货主">
        <template slot-scope="scope">{{ scope.row.goods_owner }}</template>
      </el-table-column>
      <el-table-column align="center" label="货物名称">
        <template slot-scope="scope">{{ scope.row.goods_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="重量">
        <template slot-scope="scope">{{ scope.row.weight }}</template>
      </el-table-column>
      <el-table-column align="center" label="体积">
        <template slot-scope="scope">{{ scope.row.cube }}</template>
      </el-table-column>
      <el-table-column align="center" label="运费">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" sortable prop="amount" label="运单状态">
        <template slot-scope="scope">
          <span>{{scope.row.task_state | parseStateStatus()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" sortable prop="amount" label="上链ID">
        <template slot-scope="scope">
          <span>{{scope.row.txid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            plain
            @click="goWaybillDetail(scope.row.serial_id)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- //  分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background
        @size-change="handlePageNumChange" @current-change="handlePageNoChange"
        :current-page.sync="listPageParams.pageNo"
        :page-sizes="[20,40,60,80,100]" :page-size="listPageParams.pageNum"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- // from dialog -->
    <el-dialog :title='dialogTitleMap[dialogStatus]' :visible.sync='dialogFormVisible'>
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'create'" label="密码" prop="password">
          <el-input type="password" v-model="editForm.password" placeholder="请输入密码" ></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="roleId">
          <el-select class="filter-item" v-model="editForm.roleId" placeholder="请选择">
            <el-option v-for="item in editRolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="editIsDisabled[item.statu]">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" v-if="dialogStatus == 'update' && user_del " prop="statu" >
          <el-select class="filter-item" v-model="editForm.statu" placeholder="请选择" clearable filterable>
            <el-option v-for="(item,index) in statusOptions" :key="index" :label="item | statusFilter" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formCancel('editForm')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="formCreate('editForm')">确 定</el-button>
        <el-button v-else type="primary" @click="formUpdate('editForm')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUser, fetchTaskItemList } from '@/api/user'
import { fetchRoleList } from '@/api/role'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 点击按钮时候显示水波纹动画
export default {
  directives: {
    waves
  },
  data() {
    return {
      downloadLoading: false,
      list: null,
      listLoading: false,
      searchForm: {
        serial_id: '',
        goods_owner: '',
        min_status: '',
        min_create: '',
        max_create: '',
        offset: 0,
        limit: 20
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
      },
      editForm: {
        username: '',
        password: '',
        statu: '',
        deptName: '',
        roleId: ''
      },
      editFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      editRolesOptions: [],
      editIsDisabled: {
        0: false, 1: true
      },
      statusOptions: [0, 1]
    }
  },
  created() {
    this.getUserList()
    // this.getRoleList()
    // 设置权限，后续将采用动态方式
    this.user_upd = this.permissions['user_upd']
    this.user_del = this.permissions['user_del']
    this.user_add = this.permissions['user_add']
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchTaskItemList(this.searchForm).then(res => {
        this.list = res.results
        this.total = res.count
        this.listLoading = false
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
      this.$router.push({ path: `taskitem/${id}` })
    },
    handleSearch() { // 搜索
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
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('./Export2Excel').then(excel => {
          const tHeader = ['供应商', '对账时间', '对账单号', '签约主体', '对账单总金额']
          const filterVal = ['vendor', 'create_time', 'serial_id', 'invoice_org', 'amount']
          const listExcl = this.multipleSelection
          const data = this.formatJson(filterVal, listExcl)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: '请至少选择一行',
          type: 'warning'
        })
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
      'permissions'
    ])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '有效',
        1: '无效',
        9: '锁定'
      }
      return statusMap[status]
    }
  }
}
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
