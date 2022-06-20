<template>
          <!-- Aqui inicia el template con la tabla -->
        <q-btn v-show="PRegistrar" class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistrarResponsable(), limpiarRegistro()"/>
         <q-table
              v-show="PLeer"
              title="Registro de responsables de área"
              :rows="rowsresponsable"
              :columns="columnsresponsable"
              :filter="textbuscar"
              row-key ="id"
              color="purple-ieen"
              :loading="loading"
              v-model:pagination="pagination"
              no-data-label="No se encontraron registros"
              rows-per-page-label="Registros por página"
              :visible-columns="visibleColumns"
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

                  <q-btn v-if="col.name==='id'" v-show="PActualizar" flat round color="purple-ieen" icon="edit" @click="EditarResponsableMetodo(col.value)">
                    <q-tooltip>
                      Editar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" v-show="PLeer" flat round color="purple-ieen" icon="visibility" @click="Historial(props.row.idArea, props.row.area)">
                    <q-tooltip>
                      Ver historial
                    </q-tooltip>
                  </q-btn>
                  <label v-else-if="col.name === 'activo' && col.value ===true"> Activo</label>
                  <label v-else-if="col.name === 'activo' && col.value ===false"> Baja</label>
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>

       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroResponsable" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de responsable de área</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-sm"
            >
             <div class="q-pa-md">
               <div class="q-gutter-sm row items-start">
                 <div class="col">
                  <q-select
                    filled
                    v-model="idEmpleado"
                    :options="itemEmpleado"
                    label="Nombre de empleado"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un empleado']"
                  />
                 </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="idArea"
                    :options="itemArea"
                    label="Área que se hara responsable"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un área']"
                  />
                </div>
               </div>
               <div class="q-gutter-sm row items-start">
                  <div class="col">
                    <q-input
                      v-model="fechaAsignacion"
                      filled
                      type="date"
                      hint="Fecha de asignación"
                    />
                  </div>
                  <div class="col">
                    <q-checkbox
                      v-model="activoRepresentacion"
                      label="Activar asignación"
                      color="purple-ieen"
                    />
                  </div>
               </div>

            </div>
            <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroResponsable = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarRepresentante" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar información de empleado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onEdit"
            class="q-gutter-sm"
            >
            <q-input v-show="false" v-model="idResponsable" />
             <div class="q-pa-md">
                <div class="q-gutter-sm row items-start">
                 <div class="col">
                  <q-select
                    filled
                    v-model="idEmpleado"
                    :options="itemEmpleado"
                    label="Nombre de empleado"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un empleado']"
                  />
                 </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="idArea"
                    :options="itemArea"
                    label="Área que se hara responsable"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un área']"
                  />
                </div>
               </div>
               <div class="q-gutter-sm row items-start">
                  <div class="col">
                    <q-input
                      v-model="fechaAsignacion"
                      filled
                      type="date"
                      hint="Fecha de asignación"
                    />
                  </div>
                  <div class="col">
                    <q-checkbox
                      v-model="activoRepresentacion"
                      label="Activar asignación"
                      color="purple-ieen"
                    />
                  </div>
               </div>

            </div>
            <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarRepresentante = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="VerHistorial" persistent transition-show="scale" transition-hide="scale">

       <q-card style="width: 900px; max-width: 80vw;">
         <div class="q-pa-md">
          <h5 class="text-center">{{Etiqueta}}</h5>
      </div>
         <q-card-section>
            <q-table
              title="Historial de responsables del área"
              :rows="rowsHistorial"
              :columns="columnsHistorial"
              :filter="textbuscar1"
              row-key ="id"
              color="purple-ieen"
              :loading="loading"
              v-model:pagination="pagination"
              no-data-label="No se encontraron registros"
              rows-per-page-label="Registros por página"
              >
              <template v-slot:top-right>
                <q-input v-model="textbuscar1" dense label="Buscar"  class="q-pr-md">
                  <template v-slot:append>
                    <q-icon v-if="textbuscar1 !== ''" name="close" @click="textbuscar1 = ''" class="cursor-pointer" />
                    <q-icon v-else name="search" />
                  </template>
                </q-input>
                <q-btn flat round color="purple-ieen" icon="archive" @click="exportTable1"/>
              </template >
              <template v-slot:body ="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >

                  <q-btn v-if="col.name==='id'" v-show="PEliminar"  flat round color="purple-ieen" icon="delete" @click="DeleteRepresentante(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>

                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>

         </q-card-section>
          <q-card-actions align="right">
           <q-btn label="Cerrar" type="reset" color="negative"   @click="VerHistorial = false" />
          </q-card-actions>
       </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref,onBeforeMount,watch} from 'vue';
import { date, exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';


const columnsresponsable = [

                { name: 'empleado', align: 'center', label: 'Nombre del responsable', field: 'empleado', sortable: true, },
                { name: 'area', align: 'center', label: 'Área a cargo', field: 'area', sortable: true, },
                { name: 'activo', align: 'center', label: 'Estatus del cargo', field: 'activo', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                { name: 'idArea', align: 'center', field: 'idArea' },


            ]

const columnsHistorial = [

                { name: 'empleado', align: 'center', label: 'Nombre del responsable', field: 'empleado', sortable: true, },
                { name: 'fecha_Asignacion', align: 'center', label: 'Fecha de asignación', field: 'fecha_Asignacion', sortable: true, },
                { name: 'fecha_destitucion', align: 'center', label: 'Fecha de destitución', field: 'fecha_destitucion', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplateResponsables',

  setup(){
    const $q = useQuasar()
    const store = useStore()
    //Variables de guardado y edición

    const idResponsable = ref()
    const idArea = ref()
    const idEmpleado = ref()
    const fechaAsignacion = ref()
    const activoRepresentacion = ref(false)
    const PRegistrar = ref(false)
    const PActualizar = ref(false)
    const PEliminar = ref(false)
    const PLeer = ref(false)
    const ListaPermiso = ref([])
    //---------------------------------------------------------------------------//
    //
    const textbuscar = ref('')
    const textbuscar1 = ref('')
    const rowsresponsable = ref([])
    let Etiqueta = ref("")
    const visibleColumns = ref([
      "empleado",
      "area",
      "activo",
      "id",

    ])
    const rowsHistorial = ref([])
    const itemArea = ref([])
    const itemEmpleado = ref([])
    const loading = ref(true)
    const RegistroResponsable = ref(false)
    const EditarRepresentante = ref(false)
    const VerHistorial = ref(false)
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
         const filtro = Lista.find(elemento => elemento.nombre === "EncargadoArea")
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
      const res = await api.get('/ResponsablesAreas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        data.forEach(reg => {
          let obj = {
            "id":reg.id,
            "empleado":reg.empleado,
            "activo":reg.activo,
            "area": reg.area,
            "idArea": reg.area_Id,
          };
        rowsresponsable.value.push(obj)
        })
      loading.value = false
    }
    getAreas()

    const Historial = async(id,Titulo) =>{
       rowsHistorial.value = []
      const getHistorial = async () => {
        const res = await api.get('/ResponsablesAreas/HistoricoByArea/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
          let {data} = res.data
          data.forEach(reg => {
            let obj = {
              "id":reg.id,
              "empleado":reg.empleado,
              "fecha_Asignacion": reg.fecha_Asignacion,
              "fecha_destitucion": reg.fecha_destitucion,
            };
            rowsHistorial.value.push(obj)
        })
      }
    Etiqueta.value = Titulo
    VerHistorial.value = true
    getHistorial()
    }


    // Este es el metodo para eliminar registro
    const DeleteRepresentante = async(id) =>{
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
        message: '¿Esta seguro de eliminar este requisito?',
        persistent: true
      }).onOk(async () => {
         $q.loading.show()
          const respuesta = await api.delete('/ResponsablesAreas/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){

              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowsresponsable.value = [  ]
              getAreas()
              loading.value = false
              RegistroResponsable.value = false
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

    const limpiarRegistro = function(){
        idResponsable.value = ""
        idArea.value=""
        idEmpleado.value=""
        fechaAsignacion.value=""
        activoRepresentacion.value=false
    }

     const RegistrarResponsable = async() =>{
      RegistroResponsable.value = true
      itemArea.value =[]
      itemEmpleado.value=[]
      const respuesta = await api.get('/Areas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemArea.value.push({
            label: item.nombre,
            value: item.id
          });
        })

      const res = await api.get('/Empleados',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let dato = res.data.data;
        dato.forEach((item)=>{
          itemEmpleado.value.push({
            label: item.nombres +" "+ item.apellido_Paterno + " "+ item.apellido_Materno,
            value: item.id
          });
        })


    }
     const EditarResponsableMetodo = async(id) =>{
      EditarRepresentante.value = true
      itemArea.value = []
      itemEmpleado.value = []

      const respuesta = await api.get('/Areas',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemArea.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      const respuesta1 = await api.get('/Empleados',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let dato = respuesta1.data.data;
        dato.forEach((item)=>{
          itemEmpleado.value.push({
            label: item.nombres +" "+ item.apellido_Paterno +" "+ item.apellido_Materno,
            value: item.id
          });
        })

      const respuesta2 = await api.get('/ResponsablesAreas/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let dato1 = respuesta2.data.data
          idResponsable.value = dato1.id
          fechaAsignacion.value= date.formatDate(dato1.fecha_Asignacion,'YYYY-MM-DD')
          activoRepresentacion.value= dato1.activo
          const filtro1 = itemArea.value
          var itemp1 = filtro1.find(elemento => elemento.value === dato1.area_Id)
          idArea.value = itemp1
          const filtro2 = itemEmpleado.value
          var itemp2 = filtro2.find(elemento1 => elemento1.value === dato1.empleado_Id)
          idEmpleado.value = itemp2

    }


    return{

        idResponsable,
        idArea,
        idEmpleado,
        fechaAsignacion,
        activoRepresentacion,
       // Variables de guardado y edición

       textbuscar,
       textbuscar1,
       itemArea,
       itemEmpleado,
       columnsresponsable,
       columnsHistorial,
       visibleColumns,
       rowsresponsable,
       rowsHistorial,
       RegistroResponsable,
       RegistrarResponsable,
       EditarRepresentante,
       DeleteRepresentante,
       VerHistorial,
       pagination,
       Historial,
       loading,
       Etiqueta,
       limpiarRegistro,
       EditarResponsableMetodo,
       PRegistrar,
       PActualizar,
       PEliminar,
       PLeer,
       ListaPermiso,
      //MEtodo submit para guardar registro
       onSubmit(){
          $q.loading.show()
          let Empleado = idEmpleado.value
          let Area = idArea.value
          const respuesta = api.post("/ResponsablesAreas",{
            empleado_Id: Empleado.value,
            area_Id: Area.value,
            activo: activoRepresentacion.value,
            fecha_Asignacion: fechaAsignacion.value
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
                rowsresponsable.value = []
                getAreas()
                RegistroResponsable.value = false
                limpiarRegistro()
                $q.loading.hide()

            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
            }

       },


      //Metodo edit para editar los registros
        onEdit(){
          $q.loading.show()
          const idT = idResponsable.value;
           let Empleado = idEmpleado.value
          let Area = idArea.value
          const respuesta = api.put("/ResponsablesAreas/"+idT,{
            empleado_Id: Empleado.value,
            area_Id: Area.value,
            activo: activoRepresentacion.value,
            fecha_Asignacion: fechaAsignacion.value,
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                rowsresponsable.value = []
                getAreas()
                EditarRepresentante.value = false
                limpiarRegistro()
                $q.loading.hide()

            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
            }

          },

       exportTable () {
          const content = [columnsresponsable.map(col => wrapCsvValue(col.label))].concat(
          rowsresponsable.value.map(row => columnsresponsable.map(col => wrapCsvValue(
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

       exportTable1 () {
          const content = [columnsHistorial.map(col => wrapCsvValue(col.label))].concat(
          rowsHistorial.value.map(row => columnsHistorial.map(col => wrapCsvValue(
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
