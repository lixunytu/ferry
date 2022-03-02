import request from '@/utils/devops_tools_request'

// 测试环境ip白名单校验
export function devipWhiteCheck(data) {
  return request({
    url: '/api/v1/devops-tools/devWhiteList/Check',
    method: 'post',
    data: data
  })
}

// 测试环境ip白名单list
export function devipList(params) {
  return request({
    url: '/api/v1/devops-tools/devWhiteList',
    method: 'get',
    params
  })
}

// 测试环境ip白名单list
export function devipSearch(params) {
  return request({
    url: '/api/v1/devops-tools/devSearch',
    method: 'get',
    params
  })
}

// 新增DevWhiteIps
export function addDevWhiteIps(data) {
  return request({
    url: '/api/v1/devops-tools/devWhiteList',
    method: 'post',
    data: data
  })
}

// 修改DevWhiteIps
export function updateDevWhiteIps(data) {
  return request({
    url: '/api/v1/dev-white-ips/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除DevWhiteIps
export function delDevWhiteIps(data) {
  return request({
    url: '/api/v1/devops-tools/devWhiteList',
    method: 'delete',
    data: data
  })
}
