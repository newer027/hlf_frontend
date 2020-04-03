

<template>
  <div class="chart-wrapper" style="padding-bottom:20px">
        <el-row style="margin-top:20px;padding-bottom:20px;border-bottom: 2px grey solid;">
          监控数据一览
          </el-row>
          <ul id="example-1">
            <li v-for="abnormal in listAbnormal">
              
          <a style="margin-top:0px;padding-bottom:0px;color:blue" v-bind:href="'/#/admin/taskdetail/'+ abnormal.item_id">系统检测到运单号{{ abnormal.serial_id }}定位异常</a>
              
          <el-row style="margin-top:10px;padding-bottom:10px;border-bottom: 1px #ccc solid;font-size:12px">{{ abnormal.created | formatTime() }}</el-row>
            </li>
          </ul>
        </div>
        </template>



<script>
import { lastestAbnormal } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      downloadLoading: false,
      listAbnormal: null,
      listLoading: false,
      amount: null,
      order_quantity: null,
      searchForm: {
        time: ''
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
    this.getAbnormal()
  },
  methods: {
    getAbnormal() {
      lastestAbnormal().then(res => {
        this.listAbnormal = res
      })
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
