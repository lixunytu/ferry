import request from '@/utils/devops_tools_request'

// 查询安全组详细
export function getSafeGroup(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/safegroup',
    method: 'get',
    params: data
  })
}

// 查询CloudFirewalld详细
export function getCloudFirewalld(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/cloudfirewalld',
    method: 'get',
    params: data
  })
}

// 查询ProdWhiteIps列表
export function listProdWhiteIps(query) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips',
    method: 'get',
    params: query
  })
}

// 查询ProdWhiteIps详细
export function getProdWhiteIps(id) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/' + id,
    method: 'get'
  })
}

// 新增ProdWhiteIps
export function addProdWhiteIps(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips',
    method: 'post',
    data: data
  })
}

// 修改ProdWhiteIps
export function updateProdWhiteIps(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除ProdWhiteIps
export function delProdWhiteIps(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips',
    method: 'delete',
    data: data
  })
}

// 查询safegroup 详情
export function GetSafeGroupDetail(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/safegroup',
    method: 'post',
    data: data
  })
}

// 新增ProdWhiteIps
export function GetCloudFirewalldDetail(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/cloudfirewalld',
    method: 'post',
    data: data
  })
}

export function AddIp(data) {
  return request({
    url: '/api/v1/devops-tools/prod-white-ips/addIps',
    method: 'post',
    data: data
  })
}
