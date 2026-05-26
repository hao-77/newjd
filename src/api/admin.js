import request from '@/utils/request'

export function getAdminUsers() {
  return request.get('/admin/getUsersInfo')
}

export function adminUpdateUser(data) {
  return request.post('/admin/update', data)
}

export function adminAddUser(data) {
  return request.post('/admin/addUser', data)
}

export function adminDeleteUsers(ids) {
  return request.delete('/admin/deleteUsers', {
    params: { ids },
    paramsSerializer: (params) => {
      const search = new URLSearchParams()
      ;(params.ids || []).forEach((id) => search.append('ids', id))
      return search.toString()
    },
  })
}

