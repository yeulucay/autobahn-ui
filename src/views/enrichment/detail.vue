<template>
  <div class="app-container">
    <el-row>
      <h2>Enrichment Detail</h2>
    </el-row>
    <el-row>
      <el-col :span="6">
        <span class="label">Endpoint:</span>
        <br>
        <el-select v-model="enrichment.endPointId" placeholder="Select">
          <el-option v-for="ep in endpoints" :key="ep.id" :label="ep.name" :value="ep.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="label">Data Type:</span>
        <br>
        <el-select v-model="enrichment.dataTypeId" placeholder="Select">
          <el-option v-for="dt in dataTypes" :key="dt.id" :label="dt.code" :value="dt.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="label">Enrichment Source:</span>
        <br>
        <el-select
          v-model="enrichment.enrichmentSourceId"
          @change="onEnrichmentSourceChange"
          placeholder="Select"
        >
          <el-option v-for="es in enrichmentSources" :key="es.id" :label="es.name" :value="es.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="label">Final Storage:</span>
        <br>
        <el-select v-model="enrichment.finalStorageId" placeholder="Select">
          <el-option v-for="fs in finalStorages" :key="fs.id" :label="fs.name" :value="fs.id"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="row-margin">
      <el-button type="primary" @click="addEnrichment" round>
        Add
        <i class="el-icon-plus el-icon-right"></i>
      </el-button>
      <el-button type="success" @click="saveEnrichment" round style="float:right">Save</el-button>
      <el-button type="infor" @click="cancelEnrichment" round style="float:right">Cancel</el-button>
    </el-row>

    <el-tabs style="margin-top:15px;" type="border-card">
      <el-tab-pane label="Matches">
        <el-row v-for="(item, i) in enrichmentModel" v-bind:key="i" class="match">
          <el-row>
            <el-col :span="1">
              <i class="el-icon-error close-icon" @click="closeMatch(i)"></i>
            </el-col>
            <el-col :span="11">
              <span class="label">Attribute Match:</span>
              <el-input
                v-model="item.selectedAttr"
                @keyup.enter.native="attrEnter(i)"
                placeholder="Enter new attribute"
              />
              <el-drag-select
                v-model="item.matchedAttrList"
                style="width:100%;"
                multiple
                placeholder="select"
              >
                <el-option
                  v-for="col in item.sourceAttrNames"
                  :label="col"
                  :value="col"
                  :key="col"
                />
              </el-drag-select>
            </el-col>
            <el-col :span="11" :offset="1">
              <span class="label">Column Match:</span>
              <br>
              <el-select
                v-model="item.selectedTable"
                style="width: 100%"
                @change="onTableChange(i)"
                placeholder="Select"
              >
                <el-option v-for="t in tableNames" :key="t" :label="t" :value="t"></el-option>
              </el-select>
              <br>
              <el-drag-select
                v-model="item.matchedColumnList"
                style="width:100%;"
                multiple
                placeholder="select"
              >
                <el-option v-for="col in item.columnNames" :label="col" :value="col" :key="col"/>
              </el-drag-select>
            </el-col>
          </el-row>
          <el-row class="row-margin" v-for="(join,j) in item.joinModel" v-bind:key="j">
            <!-- join -->

            <el-col :span="11" :offset="1">
              <span class="label">{{j+1}} Join Source:</span>
              <br>
              <el-select
                v-model="join.joinSourceTable"
                style="width: 100%"
                @change="onJoinTableChange(i, j, true)"
                placeholder="Select"
              >
                <el-option v-for="t in tableNames" :key="t" :label="t" :value="t"></el-option>
              </el-select>
              <br>
              <el-drag-select
                v-model="join.joinSourceMatchList"
                style="width:100%;"
                multiple
                placeholder="select"
              >
                <el-option
                  v-for="col in join.joinSourceColumns"
                  :label="col"
                  :value="col"
                  :key="col"
                />
              </el-drag-select>
            </el-col>
            <el-col :span="11" :offset="1">
              <span class="label">{{j+1}} Join Destination:</span>
              <br>
              <el-select
                v-model="join.joinDestTable"
                style="width: 100%"
                @change="onJoinTableChange(i, j, false)"
                placeholder="Select"
              >
                <el-option v-for="t in tableNames" :key="t" :label="t" :value="t"></el-option>
              </el-select>
              <br>
              <el-drag-select
                v-model="join.joinDestMatchList"
                style="width:100%;"
                multiple
                placeholder="select"
              >
                <el-option
                  v-for="col in join.joinDestColumns"
                  :label="col"
                  :value="col"
                  :key="col"
                />
              </el-drag-select>
            </el-col>
          </el-row>
          <el-row>
            <el-button type="text" @click="addJoinModel(i)">join table</el-button>
          </el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Final Data">
        <span class="label">Select Final Storage Columns:</span>
          <br>
        <el-row class="row-margin" v-for="(list, i) in totalList" v-bind:key="i">
          <el-drag-select
            v-model="list.selected"
            style="width:100%;"
            multiple
            placeholder="select"
          >
            <el-option v-for="col in list.all" :label="col" :value="col" :key="col"/>
          </el-drag-select>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import ElDragSelect from "@/components/DragSelect";
import {
  getEnrichmentById,
  getEnrichmentSourceList,
  getFinalStorageList,
  getDataTypeList,
  getEnrichmentSourceTables,
  getEnrichmentSourceColumns
} from "@/api/enrichment";
import { getEndpointTypes, getEndpointList } from "@/api/endpoint";
import { getProjectList } from "@/api/project";

export default {
  name: "enrichmentsource",
  components: {
    draggable,
    ElDragSelect
  },
  data() {
    return {
      endpoints: [],
      dataTypes: [],
      options: {},
      tableNames: [],
      sourceAttrNames: [],
      enrichmentSources: [],
      finalStorages: [],
      selectedEndpoint: null,
      selectedTable: "",
      matchedColumnList: [],
      matchedAttrList: [],
      enrichment: {},
      enrichmentId: 0,
      enrichmentModel: [],
      totalColumnList: [],
      totalSelectedColumnList: [],
      totalAttrList: [],
      totalSelectedAttrList: [],
      totalList: []
    };
  },
  created() {
    this.enrichmentId = this.$route.params.enrichmentId;
    this.getEnrichment();
    this.getDataTypes();
  },
  methods: {
    saveEnrichment(){
      console.log(this.totalColumnList)
    },
    addJoinModel(i) {
      this.enrichmentModel[i].joinModel.push({
        joinSourceTable: "",
        joinSourceMatchList: [],
        joinSourceColumns: [],
        joinDestTable: "",
        joinDestMatchList: [],
        joinDestColumns: []
      });
    },
    closeMatch(i) {
      this.enrichmentModel.splice(i, 1);
    },
    addEnrichment() {
      this.enrichmentModel.push({
        selectedTable: "",
        columnNames: [],
        sourceAttrNames: [],
        matchedAttrList: [],
        matchedColumnList: [],
        availableTables: [],
        joinModel: []
      });
      this.totalList.push({
        all:[],
        selected: []
      });
    },
    attrEnter(i) {
      this.enrichmentModel[i].sourceAttrNames.push(
        this.enrichmentModel[i].selectedAttr
      );
      this.enrichmentModel[i].matchedAttrList.push(
        this.enrichmentModel[i].selectedAttr
      );
      this.enrichmentModel[i].selectedAttr = "";
    },
    getEndpoints(projectId) {
      getEndpointList(projectId).then(response => {
        if (response.data) {
          this.endpoints = response.data;
        }
      });
    },
    getEnrichment() {
      getEnrichmentById(this.enrichmentId).then(response => {
        if (response.data) {
          this.enrichment = response.data;
          this.getEndpoints(this.enrichment.projectId);
          this.getEnrichmentSources(this.enrichment.projectId);
          this.getFinalStorages(this.enrichment.projectId);
          this.getTableNames(this.enrichment.enrichmentSourceId);
        }
      });
    },
    getEnrichmentSources(projectId) {
      getEnrichmentSourceList(projectId).then(response => {
        if (response.data) {
          this.enrichmentSources = response.data;
        }
      });
    },
    getFinalStorages(projectId) {
      getFinalStorageList(projectId).then(response => {
        if (response.data) {
          this.finalStorages = response.data;
        }
      });
    },
    getDataTypes() {
      getDataTypeList().then(response => {
        if (response.data) {
          this.dataTypes = response.data;
        }
      });
    },
    getTableNames(sourceId) {
      getEnrichmentSourceTables(sourceId).then(response => {
        if (response.data.tableNames) {
          this.tableNames = response.data.tableNames;
        }
      });
    },
    getColumnNames(sourceId, columnName, i) {
      getEnrichmentSourceColumns(sourceId, columnName).then(response => {
        if (response.data.columnNames) {
          this.enrichmentModel[i].columnNames = response.data.columnNames;
          this.$forceUpdate();
          this.organizeTotalSelectedColumnList();
        }
      });
    },
    getJoinColumnNames(sourceId, columnName, i, j, isSource) {
      getEnrichmentSourceColumns(sourceId, columnName).then(response => {
        if (response.data.columnNames) {
          if (isSource) {
            this.enrichmentModel[i].joinModel[j].joinSourceColumns =
              response.data.columnNames;
          } else {
            this.enrichmentModel[i].joinModel[j].joinDestColumns =
              response.data.columnNames;
          }
          this.$forceUpdate();
          this.organizeTotalSelectedColumnList();
        }
      });
    },
    onEnrichmentSourceChange(value) {
      this.getTableNames(value);
    },
    onTableChange(i) {
      this.getColumnNames(
        this.enrichment.enrichmentSourceId,
        this.enrichmentModel[i].selectedTable,
        i
      );
    },
    onJoinTableChange(i, j, isSource) {
      console.log(i);
      console.log(j);
      console.log(isSource);

      var colName = "";
      if (isSource) {
        colName = this.enrichmentModel[i].joinModel[j].joinSourceTable;
      } else {
        colName = this.enrichmentModel[i].joinModel[j].joinDestTable;
      }

      this.getJoinColumnNames(
        this.enrichment.enrichmentSourceId,
        colName,
        i,
        j,
        isSource
      );
    },
    organizeTotalSelectedColumnList() {
      this.totalSelectedColumnList = [];

      for (let i = 0; i < this.enrichmentModel.length; i++) {
        const model = this.enrichmentModel[i];
        model.columnNames.forEach(col => {
          const extColName = model.selectedTable + "." + col;
          if (this.totalList[i].all.indexOf(extColName) < 0) {
            this.totalList[i].all.push(extColName);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.row-margin {
  margin-top: 15px;
}

.match {
  background-color: #e4e7ed;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.close-icon {
  color: #f56c6c;
  cursor: pointer;
}

.label {
  color: #7a7a7a;
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
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>