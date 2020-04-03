<template>
  <div class="app-container calendar-list-container">
    <el-form ref="searchForm" class="mtb-20" :model="searchForm" label-width="120px" style="padding-bottom:30px">
  
      <el-row>
        <el-col :span="8">
        <el-input style="width: 200px;"  placeholder="账号" v-model="searchForm.usernamename" @keyup.enter.native="handleSearch"></el-input>
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
        <el-input style="width: 200px;" placeholder="姓名" v-model="searchForm.realname" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-col :span="8">
        <el-input style="width: 200px;" placeholder="手机号码" v-model="searchForm.telphone_num" @keyup.enter.native="handleSearch"></el-input>
        </el-col>
        <el-button type="primary" v-waves icon="search" @click="handleSearch()">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" v-waves @click="handleAdd()">添加</el-button>
      </el-row>
    </el-form>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'userId', order: 'descending'}">
      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">{{ scope.row.usernamename }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" sortable prop='created'>
        <template slot-scope="scope">
          <span>
            {{scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.telphone_num }}</template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">{{ scope.row.realname }}</template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="备注">
        <template slot-scope="scope">{{ scope.row.comment }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" type="success" @click="permissionEdit(scope.row)" style="color:#00c">权限设置</a>
          <a size="small" type="success" @click="formEdit(scope.row,scope.$index)"  style="color:#00c">编辑</a>
          <a size="small" type="danger" @click="handleDelete(scope.row)"  style="color:#00c">删除</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- //  分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background
        @size-change="handlePageNumChange" @current-change="handlePageNoChange"
        :current-page.sync="listPageParams.pageNo + 1"
        :page-sizes="[20,40,60,80,100]" :page-size="listPageParams.pageNum"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- // from dialog -->
    <el-dialog :title='dialogTitleMap[dialogStatus]' :visible.sync='dialogFormVisible'>
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="usernamename">
          <el-input v-model="editForm.usernamename" placeholder="账号"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="realname">
          <el-input type="realname" v-model="editForm.realname" placeholder="请输入" ></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="telphone_num">
          <el-input type="telphone_num" v-model="editForm.telphone_num" placeholder="请输入" ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="passwordword">
          <el-input type="passwordword" v-model="editForm.passwordword" placeholder="请输入" ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="comment">
          <el-input type="comment" v-model="editForm.comment" placeholder="请输入" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formCancel('editForm')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="formCreate('editForm')">确 定</el-button>
        <el-button v-else type="primary" @click="formUpdate('editForm')">修 改</el-button>
      </div>
    </el-dialog>

    <!-- // from dialog -->
    <el-dialog :title='dialogTitleMap[dialogStatus]' :visible.sync='permissionFormVisible'>
      <el-form :model="permissionForm" :rules="editFormRules" ref="editForm" label-width="100px">
        用户名:{{permissionForm.usernamename}}
      <div class="bottom">
        <div>
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="permissionForm.selected"
            filterable
            :titles="['待选列表', '已添加']"
            :button-texts="['删除', '添加']"
            @change="handleChange"
            :data="permissionForm.permissionData">
            <span slot-scope="{ option }">{{ option.label }}</span>
          </el-transfer>
        </div>
      </div>
      </el-form>
      <div class="bts"><span class="gayr" @click="cancel">取消</span>
      <span class="blue" @click="submit">提交</span></div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, createUser, deleteUser, fetchVendorList, fetchUserVendor, updateUserVendor, updateUser } from '@/api/user'
import waves from '@/directive/waves/index.js' // 点击按钮时候显示水波纹动画
export default {
  directives: {
    waves
  },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`
        })
      }
      return data
    }
    return {
      list: null,
      listLoading: false,
      listPageParams: {
        pageNo: 1,
        pageNum: 20,
        username: ''
      },
      user: '',
      searchForm: {
        usernamename: '',
        telphone_num: '',
        realname: '',
        min_create: '',
        max_create: '',
        offset: 0,
        limit: 20
      },
      tableKey: 0,
      total: null,
      dialogFormVisible: false, // 表单是否显示
      permissionFormVisible: false,
      permissionForm: {
        usernamename: '',
        id: '',
        selected: [],
        permissionData: generateData()
      },
      selectVendor: {
        vendor: ''
      },
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑',
        create: '创建'
      },
      editForm: {
        usernamename: '',
        id: '',
        passwordword: '',
        realname: '',
        telphone_num: '',
        comment: ''
      },
      editFormRules: {
        usernamename: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        passwordword: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
        telphone_num: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
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
    this.getRoleList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchUserList(this.listPageParams).then(res => {
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
      fetchUserList().then(res => {
        this.editRolesOptions = res.data
      })
    },
    handleAdd() { // 添加
      this.formReset()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    reset() {
      this.searchForm.time = ''
      this.searchForm.telphone_num = this.searchForm.usernamename = this.searchForm.realname = this.searchForm.min_create = this.searchForm.max_create = ''
      this.getUserList()
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户(用户名:' + row.usernamename + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          if (res.usernamename) {
            this.getUserList()
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 })
          } else {
            this.$notify({ title: '失败', message: '删除失败', type: 'error', duration: 2000 })
          }
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, 123, direction, movedKeys)
    },
    cancel() {
      this.selected = []
      this.user = ''
    },
    submit() {
      let vendor_stirng = ''
      console.log(this.permissionForm.selected)
      for (let i = 0; i < this.permissionForm.selected.length; i++) {
        vendor_stirng += this.permissionForm.selected[i].toString()
        vendor_stirng += ', '
      }
      this.selectVendor.vendor = vendor_stirng.slice(0, -2)
      updateUserVendor(this.permissionForm.id, this.selectVendor).then(res => {
        this.permissionFormVisible = false
      })
    },
    formCreate(_from) {
      const f = this.$refs
      f[_from].validate(r => {
        if (!r) return r
        createUser(this.editForm).then(res => {
          if (!res.usernamename) {
            this.$notify({ title: '失败', message: '添加失败', type: 'error', duration: 2000 })
          } else {
            this.dialogFormVisible = false
            this.getUserList()
            this.$notify({ title: '成功', message: '添加成功', type: 'success', duration: 2000 })
          }
        })
        return r
      })
    },
    formCancel(_from) {
      this.dialogFormVisible = false
      this.$refs[_from].resetFields()
    },
    formEdit(row, _index) { // 编辑
      this.formReset()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      console.log(row.id)
      // this.editForm.usernamename = res.data.usernamename
      // this.editForm.password = ''

      this.listIndex = _index
      this.editForm = row

      // this.editForm.statu = res.data.statu
      // this.editForm.userId = res.data.userId
      // this.editForm.roleId = res.data.roleList.length > 0 ? res.data.roleList[0].roleId : ''
    },
    permissionEdit(row) { // 编辑
      this.formReset()
      this.dialogStatus = 'update'
      this.permissionFormVisible = true
      this.permissionForm.usernamename = row.usernamename
      this.permissionForm.id = row.id
      fetchVendorList().then(res => {
        const vendor_list = []
        for (let i = 0; i < res.length; i++) {
          vendor_list.push({
            key: res[i].id,
            label: res[i].vendor
          })
        }
        this.permissionForm.permissionData = vendor_list
      })
      fetchUserVendor(this.permissionForm.id).then(res => {
        const sel_list = []
        for (let i = 0; i < res.vendor.length; i++) {
          sel_list.push(res.vendor[i].id)
        }
        this.permissionForm.selected = sel_list
      })
    },
    formUpdate(_from) {
      const f = this.$refs
      f[_from].validate(r => {
        if (!r) return r
        updateUser(this.editForm.id, this.editForm).then(res => {
          if (!res.usernamename) {
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
  .box{
    margin: 50px 0px 0px 100px;
  }
  .top>input {
    padding: 5px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    outline: 0;
    height: 30px;
    line-height: 40px;
    width: 300px;
    margin-left: 30px;
  }
  .bottom{
    margin-top: 60px;
  }
  .bts{
    margin-top: 100px;
    margin-left: 50px;
  }
  .bts>span{
    border-radius: 5px;
    color: #fff;
    padding: 10px 80px;
  }
  .bts>span+span{
    margin-left: 20px;
  }
  .blue{
    background: rgba(24,144,255,1);
  }
  .gayr{
    background: rgba(204,204,204,1);
  }
</style>
