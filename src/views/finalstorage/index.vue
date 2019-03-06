<template>
  <div class="app-container">
    <el-row >
      <h2>Final Storage</h2>
    </el-row>
    <el-row>
      <el-select v-model="selectedProject" placeholder="Select">
      <el-option
        v-for="project in projects"
        :key="project.id"
        :label="project.name"
        :value="project.id">
      </el-option>
      </el-select>
    </el-row>
    <el-row class="row-margin">
      <el-table border fit style="width: 100%"
        :data="finalStorageList">
        <el-table-column prop="name" label="Name"/>
        <el-table-column prop="address" label="Address"/>
        <el-table-column prop="port" label="Port"/>
        <el-table-column prop="schemaName" label="Schema"/>
        <el-table-column prop="finalStorageTypeCode" label="Type"/>

      </el-table>
    </el-row>
  </div>
</template>
<script>
import {getFinalStorageList} from '@/api/enrichment'
import {getProjectList} from '@/api/project'

export default {
  name: 'enrichmentsource',
  components: {},
  data() {
    return {
      item: 0,
      projects: [],
      finalStorageList:[],
      selectedProject: 0
    }
  },
  created () {
      this.getProjects()
  },
  methods: {
    getProjects() {
      getProjectList().then(response=>{
        if(response.data){
          this.projects = response.data
          if(this.projects.length > 0){
            this.selectedProject = this.projects[0].id
            this.getFinalStorages(this.selectedProject)
          }
        }
      })
    },
    getFinalStorages(projectId){
      getFinalStorageList(projectId).then(response=>{
        if(response.data){
          this.finalStorageList = response.data
        }
      })
    }
  }
}
</script>
<style>
  .row-margin{
    margin-top: 20px
  }
</style>