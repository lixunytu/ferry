<template>
  <div style="text-align: center">
    <el-form>
      <el-form-item label="IP地址">
        <el-input
          v-model="listQuery.ip"
          placeholder="请输入IP地址"
          clearable
          size="small"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="端口">
        <el-input
          v-model="listQuery.port"
          placeholder="请输入端口"
          clearable
          size="small"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="listQuery.remarks"
          placeholder="备注"
          clearable
          size="small"
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getCheck">检查</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { devipWhiteCheck } from "@/api/devops-tools/ip-white";

export default {
  name: 'WorkOrderSearch',
  // eslint-disable-next-line vue/require-prop-types
  props: ['genre'],
  data() {
    return {
      processValueList: [],
      loading: false,
      timeValue: '',
      listQuery: {},
      UserOptions: []
    }
  },
  created() {
    // this.getProcessList()
  },
  methods: {
    getSearch() {
      if ((this.listQuery.ip === null || this.listQuery.ip === null || this.listQuery.ip === '') && (
        this.listQuery.port === null || this.listQuery.port === null || this.listQuery.port === ''
      )) {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.$emit('handleSearch', this.listQuery)
    },
    getCheck() {
      devipWhiteCheck(this.listQuery).then(response => {
        this.$message({
          type: 'success',
          message: response.msg
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
