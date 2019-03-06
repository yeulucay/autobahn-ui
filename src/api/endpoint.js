import request from '@/utils/request'


export function getEndpointList(projectId) {
  return request({
    url: '/endpoints/list/' + projectId,
    method: 'get'
  })
}