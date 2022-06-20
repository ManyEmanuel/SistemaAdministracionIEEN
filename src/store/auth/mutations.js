
import { useQuasar } from 'quasar'

const $q = useQuasar()
export const setToken = (state,{ token, userName}) => {
  state.token = token
  state.userName = userName
  localStorage.setItem('token', token)
  localStorage.setItem('user',userName)
  state.isAuthenticated = true

}

export const removeToken = (state) => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  state.token = null
  state.isAuthenticated = false
  state.userName = null

}

export const PermisosUsuarios = (state,ListaPermiso) => {
  state.Permisos = ListaPermiso

}

export const CatalogosPrincipal = (state,Permiso) => {
  state.CatalogosPrincipal = Permiso

}

export const CatalogosTipos = (state,Permiso) => {
  state.CatalogosTipos = Permiso

}

export const Empleados = (state,Permiso) => {
  state.Empleados = Permiso

}

export const setMe = (state, me) => {
  state.me = me
}
