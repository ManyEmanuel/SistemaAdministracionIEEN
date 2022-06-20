<template>
          <!-- Aqui inicia el template con la tabla -->
  <div class="row q-pa-sm q-gutter-md">
      <div class="col-12">
        <q-btn v-show="PRegistrar" class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="  RegistrarArea"/>
          <q-table
              v-show="PLeer"
              title="Registro de áreas"
              :rows="rowsareas"
              :columns="columnsareas"
              :filter="textbuscar"
              row-key ="id"
              color="purple-ieen"
              :loading="loading"
              v-model:pagination="pagination"
              no-data-label="No se encontraron registros"
              rows-per-page-label="Registros por página"
              >
              <template v-slot:top-right>
                <q-input v-model="textbuscar" dense label="Buscar"  class="q-pr-md">
                  <template v-slot:append>
                    <q-icon v-if="textbuscar !== ''" name="close" @click="textbuscar = ''" class="cursor-pointer" />
                    <q-icon v-else name="search" />
                  </template>
                </q-input>
                <q-btn flat round color="purple-ieen" icon="archive" @click="exportTable"/>
              </template >
              <template v-slot:body ="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                  <q-btn v-if="col.name==='id'" v-show="PEliminar" flat round color="purple-ieen" icon="delete" @click="DeleteArea(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" v-show="PActualizar" flat round color="purple-ieen" icon="edit" @click="EditarAreaMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
      </div>
  </div>
       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroTipoArea" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de área</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-sm"
            >
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombreArea"
                    label="Nombre del área"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="siglasArea"
                    label="Siglas del área"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa las siglas']"
                  />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="tipoArea"
                    :options="itemsArea"
                    label="Tipo de área"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor selecciona un tipo de área']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="emailArea"
                    label="Email del área"
                    type="email"

                  />
                </div>
                <div class="col">
                  <q-input
                    filled
                    v-model="extArea"
                    label="Extensión del área"
                    type="tel"

                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-checkbox
                    v-model="Dependencia"
                    size="md"
                    label="¿Esta área depende de otra?" />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="AreaPadre"
                    v-show="Dependencia"
                    :options="itemsPadre"
                    label="Área perteneciente"
                  />
                </div>
              </div>
              <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTipoArea = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTipoArea" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Editar tipo de área</div>
          </q-card-section>
          <q-card-section>
            <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
              <q-input  v-show="false" v-model="idarea" />
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombreArea"
                    label="Nombre del área"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="siglasArea"
                    label="Siglas del área"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa las siglas']"
                  />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="tipoArea"
                    :options="itemsArea"
                    label="Tipo de área"
                    @filter="filtroSelect"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor selecciona un tipo de área']"

                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="emailArea"
                    label="Email del área"
                    type="email"

                  />
                </div>
                <div class="col">
                  <q-input
                    filled
                    v-model="extArea"
                    label="Extensión del área"
                    type="tel"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-checkbox
                    v-model="Dependencia"
                    size="md"
                    label="¿Esta área depende de otra?" />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="AreaPadre"
                    v-show="Dependencia"
                    :options="itemsPadre"
                    label="Área perteneciente"
                  />
                </div>
              </div>
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTipoArea = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
                </q-card-actions>
              </q-form>
          </q-card-section>
        </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref,onBeforeMount,watch } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';
import { application } from 'express';


const columnsareas = [

                { name: 'nombre', align: 'center', label: 'Nombre de Área', field: 'nombre', sortable: true, },
                { name: 'siglas', align: 'center', label: 'Siglas del Área', field: 'siglas', sortable: true, },
                { name: 'email', align: 'center', label: 'Email del Área', field: 'email', sortable: true, },
                { name: 'extension', align: 'center', label: 'Extensión del Área', field: 'extension', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplateArea',

  setup(){
    const $q = useQuasar()
    const capturaIdTipoArea = ref([])
    //Variables de guardado y edición
    const idarea = ref('')
    const tipoArea = ref()
    const AreaPadre = ref()
    const nombreArea = ref('')
    const siglasArea = ref('')
    const emailArea = ref('')
    const extArea = ref('')
    const itemsArea = ref([])
    const itemsPadre = ref([])
    const store = useStore()
    //---------------------------------------------------------------------------//
    //
    const Dependencia = ref(false)
    const PRegistrar = ref(false)
    const PActualizar = ref(false)
    const PEliminar = ref(false)
    const PLeer = ref(false)
    const ListaPermiso = ref([])
    const textbuscar = ref('')
    const rowsareas = ref([])
    const idEditarArea = ref("")
    const editarArea = ref("")
    const loading = ref(true)
    const RegistroTipoArea = ref(false)
    const EditarTipoArea = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )

    onBeforeMount (async() =>{
         const Lista= store.getters['auth/PermisosObtenidos']
         const filtro = Lista.find(elemento => elemento.nombre === "Áreas")
         ListaPermiso.value= filtro
         console.log("Este es el listado de los permisos de este modulo", ListaPermiso.value)
         const {registrar,actualizar,eliminar,leer} = ListaPermiso.value
         PRegistrar.value = registrar
         PActualizar.value = actualizar
         PEliminar.value = eliminar
         PLeer.value = leer
         console.log("Este es el registro",registrar)
    })
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      loading.value = true
      const res =  await api.get('/Areas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
              "id":reg.id,
              "nombre":reg.nombre,
              "siglas":reg.siglas,
              "email":reg.email,
              "extension":reg.extension,
            };
            rowsareas.value.push(obj)
        })
      loading.value = false
    }
    getAreas()

    watch(Dependencia,(nuevoValor, viejoValor) => {
      if(nuevoValor === true && EditarTipoArea.value === false){
        ListadoAreaPadre()
      }
      else if(nuevoValor === true || nuevoValor === false && EditarTipoArea.value === true){

      }
      else{
        AreaPadre.value = ""
        itemsPadre.value = []
      }
    })

    const ListadoAreaPadre = async() => {
      itemsPadre.value = []
       const respuesta =  await api.get('/Areas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
       let {data} = respuesta.data
       data.forEach((item) =>{
         itemsPadre.value.push({
           label: item.nombre,
           value: item.id
         })
       })
    }

    const RegistrarArea = async () =>{
      limpiarRegistro()
      RegistroTipoArea.value = true
      itemsArea.value =[]
      const respuesta = await api.get('/TiposAreas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsArea.value.push({
            label: item.tipo,
            value: item.id
          });
        })

    }

    const EditarAreaMetodo = async (id) =>{
      EditarTipoArea.value = true

      itemsArea.value =[]
      itemsPadre.value = []
      const respuesta = await api.get('/TiposAreas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let resp = respuesta.data.data;
        resp.forEach((item)=>{
          itemsArea.value.push({
            label: item.tipo,
            value: item.id
          });
        })

       const listPadre =  await api.get('/Areas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
       let padre = listPadre.data.data
       padre.forEach((item) =>{
        if(item.id != id){
         itemsPadre.value.push({
           label: item.nombre,
           value: item.id
         })
        }
       })

      const res = await api.get('/Areas/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        console.log("Este es el listado",itemsPadre.value,"Esa es la consulta", res.data)
        let {data} = res.data
          idarea.value = data.id
          nombreArea.value = data.nombre
          siglasArea.value = data.siglas
          emailArea.value = data.email
          extArea.value = data.extension
          console.log("Este es el id del area padre",data.area_Padre_Id)
          if(data.area_Padre_Id != null){
            Dependencia.value = true
            const filtro2 = itemsPadre.value
            let valor2 = filtro2.find(elemento => elemento.value === Number(data.area_Padre_Id))
            AreaPadre.value = valor2

          }
          const filtro1 = itemsArea.value
          let valor = filtro1.find(elemento => elemento.value === data.tipo_Area_Id)
          tipoArea.value = valor
      }

    // Este es el metodo para eliminar registro
    const DeleteArea = async (id) =>{
      $q.dialog({
        title: 'Eliminar registro',
        icon: 'Warning',
        ok:{
          color: 'positive',
          label: 'Aceptar'
        },
        cancel:{
          color: 'negative',
          label: 'Cancelar'
        },
        message: '¿Esta seguro de eliminar esta área?',
        persistent: true
      }).onOk( async () => {
         $q.loading.show()
          const verificacion = await api.get('/ResponsablesAreas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
          let listadoAreas = verificacion.data.data
          let filtro = listadoAreas.find(elemento => elemento.area_Id === id)
          if(filtro != undefined){
            const respuesta = await api.delete('/Areas/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowsareas.value = [  ]
              getAreas()
              loading.value = false
              RegistroTipoArea.value = false
               $q.loading.hide()


            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
               $q.loading.hide()
            }

          }else{
            $q.notify({
              type: 'negative',
              message: 'No se puede realizar esta acción, el área esta ligado a un responsable de la misma',
              position: 'center'
            })
            $q.loading.hide()
          }


      })
    }

    //Este es el metodo para editar registro
    /*const EditarTipoAreaMetodo = async (id) =>{
      EditarTipoArea.value = true;
      const res = api.get('/TiposAreas/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
            editarArea.value = data.tipo
            idEditarArea.value = data.id

    }*/

    const limpiarRegistro = async() =>{
      idarea.value = ""
        nombreArea.value=""
        siglasArea.value=""
        emailArea.value=""
        extArea.value=""
        tipoArea.value =""
        Dependencia.value = false
        AreaPadre.value = ""

    }


    return{
       // Variables de guardado y edición
       nombreArea,
       siglasArea,
       emailArea,
       extArea,
       idarea,
       tipoArea,
       AreaPadre,
       itemsPadre,
       itemsArea,
       textbuscar,
       editarArea,
       idEditarArea,
       columnsareas,
       rowsareas,
       RegistroTipoArea,
       EditarTipoArea,
       RegistrarArea,
       DeleteArea,
       pagination,
       loading,
       limpiarRegistro,
       EditarAreaMetodo,
       PRegistrar,
       PActualizar,
       PEliminar,
       PLeer,
       Dependencia,
       ListaPermiso,
      //MEtodo submit para guardar registro
       async onSubmit () {
          $q.loading.show()
          const{value} = tipoArea.value
          let idPadre = null
          if(Dependencia.value === true){
            idPadre = AreaPadre.value.value
          }
          const respuesta =  await api.post("/Areas",{
             tipo_Area_Id: value,
                   nombre: nombreArea.value,
                   siglas: siglasArea.value,
                   email: emailArea.value,
                   extension: extArea.value,
                   area_Padre_Id: idPadre
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})

              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){

                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                rowsareas.value = [  ]
                getAreas()
                loading.value = false
                RegistroTipoArea.value = false
                limpiarRegistro()
              $q.loading.hide()

            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
             $q.loading.hide()
            }

       },


      //Metodo edit para editar los registros
       async onEdit(){
          $q.loading.show()
          const {value} = tipoArea.value
           let idPadre = null
          if(Dependencia.value === true){
            idPadre = AreaPadre.value.value
          }
          const idT = idarea.value;
          const respuesta = await api.put("/Areas/"+idT,{
               tipo_Area_Id: value,
                   nombre: nombreArea.value,
                   siglas: siglasArea.value,
                   email: emailArea.value,
                   extension: extArea.value,
                    area_Padre_Id: idPadre
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })
              loading.value = true
              rowsareas.value = [  ]
              getAreas()
              loading.value = false
              EditarTipoArea.value = false
              limpiarRegistro()
             $q.loading.hide()
            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
               $q.loading.hide()
            }

          },

       exportTable () {
          const content = [columnsareas.map(col => wrapCsvValue(col.label))].concat(
          rowsareas.value.map(row => columnsareas.map(col => wrapCsvValue(
              typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
              col.format
          )).join(','))
          ).join('\r\n')

          const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
          )

          if (status !== true) {
          $q.notify({
              message: 'Archivo no se pudo descargar...',
              color: 'negative',
              icon: 'warning',
              position: 'top-right'
          })
          }
      },
    }
    function wrapCsvValue (val, formatFn) {
      let formatted = formatFn !== void 0
          ? formatFn(val)
          : val

      formatted = formatted === void 0 || formatted === null
          ? ''
          : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    }

  },

})
</script>
