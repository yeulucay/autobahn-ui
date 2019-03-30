<template>
  <div class="app-container">
    <el-row >
      <h2>Enrichment Detail</h2>
    </el-row>
    <el-row>
      <el-col :span="6">
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
      <el-col :span="6">
        <span class="label">Data Type:</span><br />
        <el-select v-model="enrichment.dataTypeId" placeholder="Select">
          <el-option
            v-for="dt in dataTypes"
            :key="dt.id"
            :label="dt.code"
            :value="dt.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="label">Enrichment Source:</span><br />
        <el-select v-model="enrichment.enrichmentSourceId" 
          @change="onEnrichmentSourceChange" placeholder="Select">
          <el-option
            v-for="es in enrichmentSources"
            :key="es.id"
            :label="es.name"
            :value="es.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
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
    <!-- <el-row>
        {{enrichment}}
    </el-row>
    <el-row>
      {{tableNames}}
    </el-row> -->
    <el-row class="row-margin"> 
      <el-button type="primary" @click="addEnrichment" round>Add <i class="el-icon-plus el-icon-right"></i></el-button>
    </el-row>

    <el-row v-for="(item, i) in enrichmentModel" v-bind:key="i" class="row-margin">
      <el-col :span="1">
        <i class="el-icon-error close-icon" @click="closeMatch(i)"></i>
      </el-col>
      <el-col :span="11" >
        <span class="label">Attribute Match:</span>
        <el-input v-model="item.selectedAttr" @keyup.enter.native="attrEnter(i)" placeholder="Enter new attribute" />
        <el-drag-select v-model="item.selectedAttrList" style="width:100%;" multiple placeholder="select">
          <el-option v-for="col in item.sourceAttrNames" :label="col" :value="col" :key="col" />
        </el-drag-select>
      </el-col>
      <el-col :span="11" :offset="1">
        <span class="label">Column Match:</span><br />
        <el-select v-model="item.selectedTable" style="width: 100%"
          @change="onTableChange" placeholder="Select">
          <el-option
            v-for="t in tableNames"
            :key="t"
            :label="t"
            :value="t">
          </el-option>
        </el-select>
        <br />
        <el-drag-select v-model="item.selectedColumnList" style="width:100%;" multiple placeholder="select">
          <el-option v-for="col in columnNames" :label="col" :value="col" :key="col" />
        </el-drag-select>
      </el-col>
      
    </el-row>

  </div>
</template>
<script>
import draggable from 'vuedraggable'
import ElDragSelect from '@/components/DragSelect'
import {
  getEnrichmentById, 
  getEnrichmentSourceList, 
  getFinalStorageList, 
  getDataTypeList,
  getEnrichmentSourceTables,
  getEnrichmentSourceColumns} from '@/api/enrichment'
import {getEndpointTypes, getEndpointList} from '@/api/endpoint'
import {getProjectList} from '@/api/project'

export default {
  name: 'enrichmentsource',
  components: {
    draggable, ElDragSelect
  }
  ,data() {
    return {
      endpoints: [],
      dataTypes: [],
      options: {},
      tableNames: [],
      columnNames: [],
      sourceAttrNames: [],
      enrichmentSources: [],
      finalStorages: [],
      selectedEndpoint: null,
      selectedTable: '',
      selectedColumnList: [],
      selectedAttr: '',
      selectedAttrList: [],
      enrichment: {},
      enrichmentId: 0,
      enrichmentModel: []
    }
  },
  created () {
      this.enrichmentId = this.$route.params.enrichmentId
      this.getEnrichment()
      this.getDataTypes()
  },
  methods: {
    closeMatch(i){
      this.enrichmentModel.splice(i,1)
    },
    addEnrichment(){
      this.enrichmentModel.push({
        sourceAttrNames:[],
        selectedAttrList:[],
        selectedColumnList:[]
      })
    },
    attrEnter(i){
      this.enrichmentModel[i].sourceAttrNames.push(this.enrichmentModel[i].selectedAttr)
      this.enrichmentModel[i].selectedAttrList.push(this.enrichmentModel[i].selectedAttr)
      this.enrichmentModel[i].selectedAttr = ''
    },
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
          this.getTableNames(this.enrichment.enrichmentSourceId)
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
    },
    getDataTypes(){
      getDataTypeList().then(response=>{
        if(response.data){
          this.dataTypes = response.data
        }
      })
    },
    getTableNames(sourceId){
      getEnrichmentSourceTables(sourceId).then(response=>{
        if(response.data.tableNames){
          this.tableNames = response.data.tableNames
        }
      })
    },
    getColumnNames(sourceId, columnName){
      getEnrichmentSourceColumns(sourceId, columnName).then(response=>{
        if(response.data.columnNames){
          this.columnNames = response.data.columnNames
        }
      })
    },
    onEnrichmentSourceChange(value){
      this.getTableNames(value)
    },
    onTableChange(value){
      console.log(value)
      this.getColumnNames(this.enrichment.enrichmentSourceId,value)
    }
  }
}
</script>
<style>
  
</style>
<style lang="scss">
.close-icon{
  color: #f56c6c;
  cursor: pointer;
}

.row-margin{
    margin-top: 20px
}

.label{
  color:#7a7a7a;
  font-size: medium;
  padding-bottom: 10px;
}

.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);
    }
  }
}
</style>