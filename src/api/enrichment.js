import request from '@/utils/request'


export function getEnrichmentById(enrichmentId) {
  return request({
    url: '/enrichment/' + enrichmentId,
    method: 'get'
  })
}

export function getEnrichmentList(projectId) {
  return request({
    url: '/enrichment/list/' + projectId,
    method: 'get'
  })
}

export function getEnrichmentSourceList(projectId) {
  return request({
    url: '/enrichmentsource/list/' + projectId,
    method: 'get'
  })
}

export function getFinalStorageList(projectId) {
    return request({
      url: '/finalstorage/list/' + projectId,
      method: 'get'
    })
  }

export function getDataTypeList() {
  return request({
    url: '/commons/datatypes',
    method: 'get'
  })
}

export function getEnrichmentSourceTables(sourceId) {
  return request({
    url: '/enrichmentsource/table/list/' + sourceId,
    method: 'get'
  })
}

export function getEnrichmentSourceColumns(sourceId, columnName) {
  return request({
    url: '/enrichmentsource/column/list/' + sourceId + "/" + columnName,
    method: 'get'
  })
}