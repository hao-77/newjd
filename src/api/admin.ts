import request from '@/utils/request'
import type { AdminUser } from '@/types/api'

export function getAdminUsers() {
  return request.get<AdminUser[] | AdminUser>('/admin/getUsersInfo')
}

export function adminUpdateUser(data: Partial<AdminUser>) {
  return request.post<unknown>('/admin/update', data)
}

export function adminAddUser(data: { email: string; password: string; username: string }) {
  return request.post<unknown>('/admin/addUser', data)
}

export function adminDeleteUsers(ids: string[]) {
  return request.delete<unknown>('/admin/deleteUsers', {
    params: { ids },
    paramsSerializer: (params) => {
      const search = new URLSearchParams()
      const idList = params.ids as string[]
      idList.forEach((id) => search.append('ids', id))
      return search.toString()
    },
  })
}
