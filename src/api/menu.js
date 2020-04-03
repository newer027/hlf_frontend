import request from '@/utils/request'

export function fetchUserTree() {
  return request({
    url: 'users/user_tree/',
    method: 'get'
  })
}

