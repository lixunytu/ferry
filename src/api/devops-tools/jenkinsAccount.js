import request from '@/utils/devops_tools_request'

// 查询JenkinsAccount列表
export function listJenkinsAccount(query) {
  return request({
    url: '/api/v1/devops-tools/jenkins-account',
    method: 'get',
    params: query
  })
}

// 查询JenkinsAccount详细
export function getJenkinsAccount(id) {
  return request({
    url: '/api/v1/jenkins-account/' + id,
    method: 'get'
  })
}

// 新增JenkinsAccount
export function addJenkinsAccount(data) {
  return request({
    url: '/api/v1/jenkins-account',
    method: 'post',
    data: data
  })
}

// 修改JenkinsAccount
export function updateJenkinsAccount(data) {
  return request({
    url: '/api/v1/jenkins-account/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除JenkinsAccount
export function delJenkinsAccount(data) {
  return request({
    url: '/api/v1/devops-tools/jenkins-account',
    method: 'delete',
    data: data
  })
}

