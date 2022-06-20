
import {api} from 'src/boot/axios'
import {useQuasar } from 'quasar'
import {useStore} from 'vuex'

const $q = useQuasar();
const store = useStore();

export const GeneraPermisos = async ({commit}) => {
  const valores = window.location.search
  const urlParams = new URLSearchParams(valores)
  const token = urlParams.get('token')
  const sistema = urlParams.get('sistema')
  localStorage.setItem("token", token)
  localStorage.setItem("sistema", sistema)
  const ListaPermisos = []
  const Modulos = await api.get('/Modulos/BySistema/'+sistema,{headers:{'Authorization': 'Bearer'+' '+ token}})
  let ListaModulos = Modulos.data.data
  const Acceso = await api.get('/PermisosModulosUsuarios/Bysuario/'+sistema,{headers:{'Authorization': 'Bearer'+' '+ token}})
  let ListadoAcceso = Acceso.data.data
  ListaModulos.forEach((item) => {
    let filtro = ListadoAcceso.find(elemento => elemento.modulo_Id === item.id)
    if(filtro != undefined){
      ListaPermisos.push({
        id: item.id,
        nombre: item.nombre,
        acceso: true,
        registrar: filtro.registrar,
        actualizar: filtro.actualizar,
        eliminar: filtro.eliminar,
        leer: filtro.leer
      })
    }else{
      ListaPermisos.push({
        id: item.id,
        nombre: item.nombre,
        acceso: false,
        registrar: false,
        actualizar: false,
        eliminar: false,
        leer: false
      })
    }
  })
    commit('PermisosUsuarios',ListaPermisos)
    const {CatalogosPrincipal,CatalogosTipos,Empleados} = await ListadoAccesos(ListaPermisos)
    commit('CatalogosPrincipal', CatalogosPrincipal)
    commit('CatalogosTipos', CatalogosTipos)
    commit('Empleados',Empleados)
    return{success: true, msj: "Permisos Guardados"}
  }


  export const ListadoAccesos = async (Permisos) => {
    const CatalogosPrincipal = []
    const CatalogosTipos = []
    const Empleados = []
    Permisos.forEach((item) => {
      switch(item.nombre){
        case 'Áreas':
          CatalogosPrincipal.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de áreas"
          })
          break;
        case 'Puestos':
          CatalogosPrincipal.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de puestos"
          })
          break;
        case 'Requisitos':
          CatalogosPrincipal.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de requisitos"
          })
          break;
        case 'Tratamientos':
          CatalogosPrincipal.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de tratamientos"
          })
          break;
        case 'TabuladorViaticos':
          CatalogosPrincipal.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de tabulador de viatico"
          })
          break;
        case 'TiposAreas':
          CatalogosTipos.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Tipos de áreas"
          })
          break;
        case 'TiposEmpleados':
          CatalogosTipos.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Tipos de empleados"
          })
          break;
        case 'TiposMovimientos':
          CatalogosTipos.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Tipos de movimientos"
          })
          break;
        case 'TiposRepresentantes':
          CatalogosTipos.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Tipos de representantes"
          })
          break;
        case 'RegistroEmpleado':
          Empleados.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Registro de empleados"
          })
          break;
        case 'EncargadoArea':
          Empleados.push({
            id: item.id,
            nombre: item.nombre,
            acceso: item.acceso,
            label: "Encargado de área"
          })
          break;

      }


    })
    return {CatalogosPrincipal,CatalogosTipos,Empleados}
  }
export default GeneraPermisos




