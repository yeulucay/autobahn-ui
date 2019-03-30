import request from '@/utils/request'


export function getEndpointList(projectId) {
  return request({
    url: '/endpoints/list/' + projectId,
    method: 'get'
  })
}

export function getEndpointTypes() {
  return request({
    url: '/endpoints/type/list/',
    method: 'get'
  })
}
