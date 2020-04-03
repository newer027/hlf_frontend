<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row>
        <el-col :span="12"><p class="title">基本信息</p></el-col>
        <el-col :span="12"><p class="title">规则说明：</p></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">车速选择(V)</el-col>
        <el-col :span="12">设：
      出发地定位位置与实际出发地的距离为L,货车行驶时间均值为V</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-select v-model="updateForm.velocity" @change="changeFun" placeholder="请选择">
    <el-option
      v-for="item in vecOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  当前值：{{distanceDetail.velocity}}km/h</el-col>
        <el-col :span="12">合理误差距离S,   S=V*T</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">时间阈值(T)</el-col>
        <el-col :span="12">则：定位点距离L<=S ，视为定位正常</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-select v-model="updateForm.hours" @change="changeFun" placeholder="请选择">
    <el-option
      v-for="item in timeOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        当前值：{{distanceDetail.hours}}小时</el-col>
        <el-col :span="12">定位点距离L>S ，视为定位异常</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">合理误差距离：</el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><el-input
  placeholder="请输入内容"
  v-model="updateForm.distance"
  :disabled="true">
</el-input>
</el-col>
<el-col :span="6">
当前值：{{distanceDetail.distance}}km<p style="color:#fff">{{ input }}</p></el-col>
      </el-row>
      <el-row>
        <el-button type="primary" @click="formCreate('updateForm')">确 定</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { lastestDistance, createDistance, updateUser } from '@/api/user'
import { fetchRoleList } from '@/api/role'

export default {
  data() {
    return {
      downloadLoading: false,
      list: null,
      listAll: null,
      listLoading: false,
      listPageParams: {
        pageNo: 1,
        pageNum: 20
      },
      queryParams: {
        ledger: '',
        offset: 0,
        limit: 20
      },
      distanceDetail: {
        hours: '',
        velocity: '',
        distance: ''
      },
      tableKey: 0,
      total: null,
      dialogFormVisible: false, // 表单是否显示
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑',
        create: '创建'
      },
      updateForm: {
        velocity: 60,
        hours: 0.5,
        distance: 30
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
      statusOptions: [0, 1],
      vecOptions: [{
        value: 60,
        label: '60km'
      }, {
        value: 70,
        label: '70km'
      }, {
        value: 80,
        label: '80km'
      }, {
        value: 90,
        label: '90km'
      }, {
        value: 100,
        label: '100km'
      }],
      timeOptions: [{
        value: 0.5,
        label: '0.5小时'
      }, {
        value: 1,
        label: '1小时'
      }, {
        value: 1.5,
        label: '1.5小时'
      }, {
        value: 2,
        label: '2小时'
      }, {
        value: 2.5,
        label: '2.5小时'
      }]
    }
  },
  created() {
    this.getDistance()
  },
  methods: {
    getDistance() {
      lastestDistance().then(res => {
        this.distanceDetail.hours = res.hours
        this.distanceDetail.velocity = res.velocity
        this.distanceDetail.distance = res.distance
      })
    },
    getRoleList() {
      fetchRoleList().then(res => {
        this.editRolesOptions = res.data
      })
    },
    handleAdd() { // 添加
      this.formReset()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleSearch() { // 搜索
      this.listPageParams.pageNo = 0
      this.getUserList()
    },
    handlePageNumChange(_pageNum) { // 每页显示数量变化
      this.listPageParams.pageNum = this.queryParams.limit = _pageNum
      this.getUserList()
    },
    changeFun() {
      this.updateForm.distance = this.updateForm.hours * this.updateForm.velocity
    },
    handlePageNoChange(_pageNo) { // 页码变化
      this.listPageParams.pageNo = _pageNo
      this.queryParams.offset = this.listPageParams.pageNum * (_pageNo - 1)
      this.getUserList()
    },
    formCreate(_from) {
      createDistance(this.updateForm).then(res => {
        if (!res.created) {
          this.$notify({ title: '失败', message: '更新失败', type: 'error', duration: 2000 })
        } else {
          this.getDistance()
          this.$notify({ title: '成功', message: '更新成功', type: 'success', duration: 2000 })
        }
      })
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
    }
  },
  computed: {
    input: function(newValue) {
      return this.timeValue
    }
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
  .top{
    margin: 0 0px;
  }
  .el-row {
    margin-top: 15px;
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    font-size: 14px;
  }
  .title{
    font-weight: 600;
    font-size: 18px;
  }
  .filter-item{
    margin-top: 10px;
    float: right;
  }
</style>
