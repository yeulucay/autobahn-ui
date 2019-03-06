<template>
  <div class="app-container">
    <el-row >
      <h2>Endpoint</h2>
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
        :data="endpoints">
        <el-table-column prop="name" label="Name"/>
        <el-table-column prop="address" label="Address"/>
        <el-table-column prop="port" label="Port"/>
        <el-table-column prop="endPointTypeCode" label="Type"/>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import {getEndpointList} from '@/api/endpoint'
import {getProjectList} from '@/api/project'

export default {
  name: 'endpoint',
  components: {},
  data() {
    return {
      item: 0,
      projects: [],
      endpoints:[],
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
            this.getEndpoints(this.selectedProject)
          }
        }
      })
    },
    getEndpoints(projectId){
      getEndpointList(projectId).then(response=>{
        if(response.data){
          this.endpoints = response.data
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
