<template>
          <!-- Aqui inicia el template con la tabla -->
  <div class="row q-pa-sm q-gutter-md">
      <div class="col-12">
        <q-btn v-show="PRegistrar" class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroPuesto = true, limpiarRegistro()"/>
          <q-table
              v-show="PLeer"
              title="Registro de puestos"
              :rows="rowspuestos"
              :columns="columnspuestos"
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
                  <q-btn v-if="col.name==='id'" v-show="PEliminar" flat round color="purple-ieen" icon="delete" @click="DeletePuesto(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" v-show="PActualizar" flat round color="purple-ieen" icon="edit" @click="EditarPuestoMetodo(col.value)">
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
    <q-dialog v-model="RegistroPuesto" persistent transition-show="scale" transition-hide="scale">
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
                    v-model="nombrePuesto"
                    label="Nombre del puesto"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="descripcionPuesto"
                    label="Descripción del puesto"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una descripción']"
                  />
                </div>

              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sueldoPuesto"
                    label="Sueldo del puesto"
                    type="number" prefix="$"
                    lazy-rules
                    :rules="[ val => val && val > 0 || 'Por favor ingresa un sueldo']"

                  />
                </div>
                <div class="col">

                </div>
              </div>
              <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroPuesto = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarPuesto" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Editar puesto</div>
          </q-card-section>
          <q-card-section>
            <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
              <q-input  v-show="false" v-model="idpuesto" />
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombrePuesto"
                    label="Nombre del puesto"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="descripcionPuesto"
                    label="Descripción del puesto"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una descripción']"
                  />
                </div>

              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sueldoPuesto"
                    label="Sueldo del puesto"
                    type="number" prefix="$"
                    lazy-rules
                    :rules="[ val => val && val > 0 || 'Por favor ingresa un sueldo']"

                  />
                </div>
                <div class="col">

                </div>
              </div>
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarPuesto = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
                </q-card-actions>
              </q-form>
          </q-card-section>
        </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref, onBeforeMount } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';


const columnspuestos = [

                { name: 'nombre', align: 'center', label: 'Nombre del Puesto', field: 'nombre', sortable: true, },
                { name: 'descripcion', align: 'center', label: 'Descripción del Puesto', field: 'descripcion', sortable: true, },
                { name: 'sueldo', align: 'center', label: 'Sueldo del Puesto', field: 'sueldo', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplatePuestos',

  setup(){
    const $q = useQuasar()
    const store = useStore()
    //Variables de guardado y edición
    const idpuesto = ref('')
    const nombrePuesto = ref('')
    const descripcionPuesto = ref('')
    const sueldoPuesto = ref('')

    //---------------------------------------------------------------------------//
    //
    const textbuscar = ref('')
    const rowspuestos = ref([])
    const idEditarArea = ref("")
    const editarArea = ref("")
    const loading = ref(true)
    const RegistroPuesto = ref(false)
    const EditarPuesto = ref(false)
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

        onBeforeMount (async() =>{
         const Lista= store.getters['auth/PermisosObtenidos']
         const filtro = Lista.find(elemento => elemento.nombre === "Puestos")
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
     const res = await api.get('/Puestos',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
              "id":reg.id,
              "nombre":reg.nombre,
              "descripcion":reg.descripcion,
              "sueldo":reg.sueldo,
                      };
            rowspuestos.value.push(obj)
        })

      loading.value = false
    }
    getAreas()

    const EditarPuestoMetodo = async (id) =>{
      EditarPuesto.value = true
      const res = await api.get('/Puestos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        idpuesto.value = data.id
        nombrePuesto.value = data.nombre
        descripcionPuesto.value = data.descripcion
        sueldoPuesto.value = data.sueldo
    }
    // Este es el metodo para eliminar registro
    const DeletePuesto = async (id) =>{
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
        message: '¿Esta seguro de eliminar este puesto?',
        persistent: true
      }).onOk( async() => {
         $q.loading.show()
          const respuesta = await api.delete('/Puestos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowspuestos.value = [  ]
              getAreas()
              loading.value = false
              RegistroPuesto.value = false
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
        idpuesto.value = ""
        nombrePuesto.value=""
        descripcionPuesto.value=""
        sueldoPuesto.value=""
    }


    return{
       // Variables de guardado y edición
       nombrePuesto,
       descripcionPuesto,
       sueldoPuesto,
       idpuesto,
       textbuscar,
       editarArea,
       idEditarArea,
       columnspuestos,
       rowspuestos,
       RegistroPuesto,
       EditarPuesto,
       DeletePuesto,
       pagination,
       loading,
       limpiarRegistro,
       EditarPuestoMetodo,
        PRegistrar,
        PActualizar,
        PEliminar,
        PLeer,
        ListaPermiso,
      //MEtodo submit para guardar registro
       onSubmit(){
          $q.loading.show()
          const respuesta = api.post("/Puestos",{
            nombre: nombrePuesto.value,
            descripcion: descripcionPuesto.value,
            sueldo: sueldoPuesto.value,
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
                rowspuestos.value = [  ]
                getAreas()
                loading.value = false
                RegistroPuesto.value = false
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
          const idT = idpuesto.value;
          const respuesta = api.put("/Puestos/"+idT,{
                nombre: nombrePuesto.value,
                descripcion: descripcionPuesto.value,
                sueldo: sueldoPuesto.value,
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
              rowspuestos.value = [  ]
              getAreas()
              loading.value = false
              EditarPuesto.value = false
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
          const content = [columnspuestos.map(col => wrapCsvValue(col.label))].concat(
          rowspuestos.value.map(row => columnspuestos.map(col => wrapCsvValue(
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
