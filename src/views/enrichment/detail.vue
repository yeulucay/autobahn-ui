<template>
  <div class="app-container">
    <el-row >
      <h2>Enrichment Detail</h2>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="label">Endpoint:</span><br />
        <el-select v-model="enrichment.endPointId" placeholder="Select">
          <el-option
            v-for="ep in endpoints"
            :key="ep.id"
            :label="ep.name"
            :value="ep.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span class="label">Enrichment Source:</span><br />
        <el-select v-model="enrichment.enrichmentSourceId" placeholder="Select">
          <el-option
            v-for="es in enrichmentSources"
            :key="es.id"
            :label="es.name"
            :value="es.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span class="label">Final Storage:</span><br />
        <el-select v-model="enrichment.finalStorageId" placeholder="Select">
          <el-option
            v-for="fs in finalStorages"
            :key="fs.id"
            :label="fs.name"
            :value="fs.id">
          </el-option>
        </el-select>
      </el-col>

      
    </el-row>
    <el-row>
        {{enrichment}}
    </el-row>

  </div>
</template>
<script>
import {getEnrichmentById, getEnrichmentSourceList, getFinalStorageList} from '@/api/enrichment'
import {getEndpointTypes, getEndpointList} from '@/api/endpoint'
import {getProjectList} from '@/api/project'

export default {
  name: 'enrichmentsource',
  components: {},
  data() {
    return {
      endpoints: [],
      enrichmentSources: [],
      finalStorages: [],
      selectedEndpoint: null,
      enrichment: {},
      enrichmentId: 0
    }
  },
  created () {
      this.enrichmentId = this.$route.params.enrichmentId
      this.getEnrichment()
  },
  methods: {
  
    getEndpoints(projectId){
      getEndpointList(projectId).then(response=>{
        if(response.data){
          this.endpoints = response.data
        }
      })
    },
    getEnrichment(){
      getEnrichmentById(this.enrichmentId).then(response=>{
        if(response.data){
          this.enrichment = response.data
          this.getEndpoints(this.enrichment.projectId)
          this.getEnrichmentSources(this.enrichment.projectId)
          this.getFinalStorages(this.enrichment.projectId)
        }
      })
    },
    getEnrichmentSources(projectId){
      getEnrichmentSourceList(projectId).then(response=>{
        if(response.data){
          this.enrichmentSources = response.data
        }
      })
    },
    getFinalStorages(projectId){
      getFinalStorageList(projectId).then(response=>{
        if(response.data){
          this.finalStorages = response.data
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
  .label{
    color:#7a7a7a;
    font-size: medium;
    padding-bottom: 10px;
  }
</style>