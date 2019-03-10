<template>
  <div class="app-container">
    <el-row >
      <h2>Enrichment Detail</h2>
    </el-row>
    <el-row>
        {{enrichment}}
    </el-row>

  </div>
</template>
<script>
import {getEnrichmentById} from '@/api/enrichment'

export default {
  name: 'enrichmentsource',
  components: {},
  data() {
    return {
      enrichment: {},
      enrichmentId: 0
    }
  },
  created () {
      this.enrichmentId = this.$route.params.enrichmentId
      this.getEnrichment()
  },
  methods: {
    getEnrichment(){
      getEnrichmentById(this.enrichmentId).then(response=>{
        if(response.data){
          this.enrichment = response.data
          console.log(this.enrichment)
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