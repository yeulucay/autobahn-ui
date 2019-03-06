import request from '@/utils/request'


export function getEnrichmentSourceList(projectId) {
  return request({
    url: '/enrichmentsource/list/' + projectId,
    method: 'get'
  })
}