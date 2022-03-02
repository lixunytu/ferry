<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
          <WorkOrderSearch :genre="'my-create'" @handleSearch="handleSearch" />
      </el-form>
      <el-button type="primary" icon="el-icon-search" size="small" @click="dialogFormVisible = true">增加</el-button>
      <el-dialog title="输入白名单信息" :visible.sync="dialogFormVisible">
        <el-form :model="formAdd" :rules="rule" ref="formAdd">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
                  <el-input v-model="formAdd.ip" placeholder="请输入IP"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
                  <el-select v-model="formAdd.port" placeholder="选择端口">
                    <el-option label="80" value="80"></el-option>
                    <el-option label="443" value="443"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
              <el-input v-model="formAdd.remarks" type="textarea"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd('formAdd')">确 定</el-button>
        </div>
      </el-dialog>

      <el-table v-loading="loading" border :data="ticketList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="ID" prop="id" width="120" />
        <el-table-column label="IPS" prop="ip" :show-overflow-tooltip="true" />
        <el-table-column label="端口" prop="port" :show-overflow-tooltip="true" />
        <el-table-column label="备注" prop="remarks" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
          <template slot-scope="scope">
            <el-button
              v-permisaction="['process:list:myCreate:select']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              disabled
              @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
              v-permisaction="['process:list:myCreate:reopen']"
              size="mini"
              type="text"
              icon="el-icon-refresh-right"
              @click="handleDel(scope.row.id,scope.row.ip)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import { devipList, addDevWhiteIps, delDevWhiteIps } from '@/api/devops-tools/ip-white'

// 搜索
import WorkOrderSearch from './components/search/index'
export default {
  components: { WorkOrderSearch },
  data() {
    return {
      users: [],
      nodeList: [],
      queryParams: {
        pageIndex: 1,
        pageSize: 50
      },
      formAdd: {
        ip: '',
        port: '',
        remarks: ''
      },
      total: 0,
      loading: false,
      ticketList: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      ruleForm: {
        work_order_id: '',
        node_id: '',
        user_id: '',
        remarks: ''
      },
      rule: {
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          {
            required: true,
            pattern: /^(((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)[\/]([0-9]$|[0-2][0-9]|3[0-2])[,$]?)+$/,
            message: '示例：192.168.1.1/24,192.168.2.1/24',
            trigger: 'blur'
          }
        ],
        port: [
          { required: true, message: '请选择端口', trigger: 'blur' },
          {
            required: true,
            pattern: /^.+$/,
            message: '',
            trigger: 'blur'
          }
        ],
        remarks: [
          { required: true, message: '请输备注', trigger: 'blur' },
          {
            required: true,
            pattern: /^.+$/,
            message: '备注不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.listQuery.pageIndex = this.queryParams.pageIndex
      this.listQuery.pageSize = this.queryParams.pageSize
      devipList(this.listQuery).then(response => {
        this.ticketList = response.data.list
        this.queryParams.pageIndex = response.data.pageIndex
        this.queryParams.pageSize = response.data.pageSize
        this.total = response.data.count
        this.loading = false
      })
    },
    handleSearch(val) {
      for (var k in val) {
        this.listQuery[k] = val[k]
      }
      this.getList()
    },
    handleView(row) {
      this.$router.push({ name: 'ProcessListHandle', query: { workOrderId: row.id, processId: row.process }})
    },
    handleAdd(formadd) {
      this.$refs[formadd].validate((valid) => {
        if (valid) {
          addDevWhiteIps(this.formAdd).then(response => {
            this.$message({
              message: '白名单添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
        }
      })
    },
    handleDel(id, ip) {
      this.$confirm('确定删除 ' + ip + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        delDevWhiteIps({ id: id }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '成功!'
          })
        })
      })
    },
    handleSelectionChange() {
      console.log(233)
    }

  }
}
</script>

<style scoped>

</style>
