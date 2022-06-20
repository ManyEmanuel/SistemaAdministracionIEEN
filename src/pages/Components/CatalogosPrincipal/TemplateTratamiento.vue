<template>
          <!-- Aqui inicia el template con la tabla -->
  <div class="row q-pa-sm q-gutter-md">
      <div class="col-12">
        <q-btn v-show="PRegistrar" class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroTratamiento = true, limpiarRegistro()"/>
          <q-table
              v-show="PLeer"
              title="Registro de tratamiento"
              :rows="rowstratamiento"
              :columns="columnstratamiento"
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
                  <q-btn v-if="col.name==='id'" v-show="PEliminar" flat round color="purple-ieen" icon="delete" @click="DeleteTratamiento(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" v-show="PActualizar" flat round color="purple-ieen" icon="edit" @click="EditarTratamientoMetodo(col.value)">
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
    <q-dialog v-model="RegistroTratamiento" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de puesto</div>
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
                    v-model="nombreTratamiento"
                    label="Nombre del tratamiento"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="siglasTratamiento"
                    label="Abreviatura del tratamiento"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
                <div class="col">
                </div>
              </div>

              <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTratamiento = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTratamiento" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Editar puesto</div>
          </q-card-section>
          <q-card-section>
            <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
              <q-input  v-show="false" v-model="idtratamiento" />
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombreTratamiento"
                    label="Nombre del tratamiento"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="siglasTratamiento"
                    label="Abreviatura del tratamiento"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingrese siglas']"
                  />
                </div>
                <div class="col">
                </div>
              </div>
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTratamiento = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
                </q-card-actions>
              </q-form>
          </q-card-section>
        </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref,onBeforeMount } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';


const columnstratamiento = [

                { name: 'nombre', align: 'center', label: 'Titulo del tratamiento', field: 'nombre', sortable: true, },
                { name: 'siglas', align: 'center', label: 'Abreviatura del tratamiento', field: 'siglas', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplateTratamiento',

  setup(){
    const $q = useQuasar()
    const store = useStore()
    //Variables de guardado y edición
    const idtratamiento = ref('')
    const nombreTratamiento = ref('')
    const siglasTratamiento = ref(false)
    //---------------------------------------------------------------------------//
    //
    const textbuscar = ref('')
    const rowstratamiento = ref([])
    const datos=ref([])
    const loading = ref(true)
    const RegistroTratamiento = ref(false)
    const EditarTratamiento = ref(false)
    const PRegistrar = ref(false)
    const PActualizar = ref(false)
    const PEliminar = ref(false)
    const PLeer = ref(false)
    const ListaPermiso = ref([])
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
     onBeforeMount (async() =>{
         const Lista= store.getters['auth/PermisosObtenidos']
         const filtro = Lista.find(elemento => elemento.nombre === "Tratamientos")
         ListaPermiso.value= filtro
         console.log("Este es el listado de los permisos de este modulo", ListaPermiso.value)
         const {registrar,actualizar,eliminar,leer} = ListaPermiso.value
         PRegistrar.value = registrar
         PActualizar.value = actualizar
         PEliminar.value = eliminar
         PLeer.value = leer
         console.log("Este es el registro",registrar)
    })

    const getAreas = async () => {
      loading.value = true
      const res = await api.get('/Tratamientos',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
              "id":reg.id,
              "nombre":reg.titulo,
              "siglas":reg.abreviatura,
            };
            rowstratamiento.value.push(obj)
        })

      loading.value = false
    }
    getAreas()

    const EditarTratamientoMetodo = async(id) =>{
      EditarTratamiento.value = true
      const res = await api.get('/Tratamientos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        idtratamiento.value = data.id
        nombreTratamiento.value = data.titulo
        siglasTratamiento.value = data.abreviatura
    }
    // Este es el metodo para eliminar registro
    const DeleteTratamiento = async(id) =>{
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
        message: '¿Esta seguro de eliminar este tratamiento?',
        persistent: true
      }).onOk(async () => {
         $q.loading.show()
          const respuesta = await api.delete('/Tratamientos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowstratamiento.value = [  ]
              getAreas()
              loading.value = false
              RegistroTratamiento.value = false
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

      })
    }

    //Este es el metodo para editar registro

    const limpiarRegistro = async() =>{
        idtratamiento.value = ""
        nombreTratamiento.value=""
        siglasTratamiento.value=""
    }


    return{
       // Variables de guardado y edición
       nombreTratamiento,
       siglasTratamiento,
       idtratamiento,
       textbuscar,
       columnstratamiento,
       rowstratamiento,
       RegistroTratamiento,
       EditarTratamiento,
       DeleteTratamiento,
       pagination,
       loading,
       limpiarRegistro,
       EditarTratamientoMetodo,
       datos,
        PRegistrar,
        PActualizar,
        PEliminar,
        PLeer,
        ListaPermiso,
      //MEtodo submit para guardar registro
       onSubmit(){
          $q.loading.show()
          const respuesta = api.post("/Tratamientos",{
                   titulo: nombreTratamiento.value,
                   abreviatura: siglasTratamiento.value,
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            console.log(respuesta)
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){

                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                rowstratamiento.value = [  ]
                getAreas()
                loading.value = false
                RegistroTratamiento.value = false
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
        onEdit(){
          $q.loading.show()
          const idT = idtratamiento.value;
          api.put("/Tratamientos/"+idT,{
                titulo: nombreTratamiento.value,
                abreviatura: siglasTratamiento.value,
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
              rowstratamiento.value = [  ]
              getAreas()
              loading.value = false
              EditarTratamiento.value = false
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
          const content = [columnstratamiento.map(col => wrapCsvValue(col.label))].concat(
          rowstratamiento.value.map(row => columnstratamiento.map(col => wrapCsvValue(
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
