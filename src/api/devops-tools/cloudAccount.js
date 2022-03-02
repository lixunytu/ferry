import request from '@/utils/devops_tools_request'

// 查询CloudAccount列表
export function listCloudAccount(query) {
  return request({
    url: '/api/v1/devops-tools/cloud-account',
    method: 'get',
    params: query
  })
}

// 查询CloudAccount详细
export function getCloudAccount(id) {
  return request({
    url: '/api/v1/devops-tools/cloud-account/' + id,
    method: 'get'
  })
}

// 新增CloudAccount
export function addCloudAccount(data) {
  return request({
    url: '/api/v1/devops-tools/cloud-account',
    method: 'post',
    data: data
  })
}

// 修改CloudAccount
export function updateCloudAccount(data) {
  return request({
    url: '/api/v1/devops-tools/cloud-account/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除CloudAccount
export function delCloudAccount(data) {
  return request({
    url: '/api/v1/devops-tools/cloud-account',
    method: 'delete',
    data: data
  })
}

// 获取CloudAccount ramList
export function getRamList(id, query) {
  return request({
    url: '/api/v1/devops-tools/cloud-account/ram/' + id,
    method: 'get',
    params: query
  })
}

// 获取CloudAccount ramDetail
export function getRamDetail(data) {
  return request({
    url: '/api/v1/devops-tools/cloud-account/ram',
    method: 'get',
    params: data
  })
}

// 关闭Ram 登录
export function CloseRamAccount(data) {
  return request({
    url: '/api/v1/devops-tools/cloud-account/ram',
    method: 'delete',
    data: data
  })
}
