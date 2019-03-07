import request from '@/utils/request'


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