<template>
  <div class="app-container">
    <el-row>
      <h2>Projects</h2>
    </el-row>
    <el-row>
      <el-table border fit style="width: 100%"
        :data="list">
        <el-table-column prop="name" label="Name"/>
        <el-table-column prop="description" label="Description"/>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import {getProjectList} from '@/api/project'

export default {
  name: 'projet',
  components: {},
  data() {
    return {
      item: 0,
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList() {
      getProjectList().then(response=>{
        if(response.data){
          this.list = response.data
        }
      })
    }
  }
}
</script>
