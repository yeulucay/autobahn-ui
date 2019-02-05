<template>
  <div class="app-container">
    <p1>Project Page</p1>
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
  },
  methods: {
    getList() {
      this.list = [0,1,2]
    }
  }
}
</script>