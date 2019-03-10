<template>
  <div class="app-container">
    <el-row >
      <h2>Enrichment</h2>
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
        :data="enrichmentList">
        <el-table-column prop="name" label="Name"/>
        <el-table-column prop="endPointTypeCode" label="End Point"/>
        <el-table-column prop="enrichmentSourceTypeCode" label="Enrichment Source"/>
        <el-table-column prop="finalStorageTypeCode" label="Final Storage"/>
        <el-table-column label="Action">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getDeatil(scope.row.id)">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import {getEnrichmentList} from '@/api/enrichment'
import {getProjectList} from '@/api/project'

export default {
  name: 'enrichmentsource',
  components: {},
  props:{
    //selectedProject:{type:Number}
  },
  data() {
    return {
      item: 0,
      projects: [],
      enrichmentList:[],
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
            this.getEnrichmentListByProjectId(this.selectedProject)
          }
        }
      })
    },
    getEnrichmentListByProjectId(projectId){
      getEnrichmentList(projectId).then(response=>{
        if(response.data){
          this.enrichmentList = response.data
        }
      })
    },
    getDeatil(enrichmentId){
      let path = '/enrichment/detail/' + enrichmentId
      //this.$router.params.projectId = this.projectId
      this.$router.replace({
        path: path
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