import request from '@/utils/request'


export function getProjectList() {
    return request({
      url: '/projects/list',
      method: 'get'
    })
  }