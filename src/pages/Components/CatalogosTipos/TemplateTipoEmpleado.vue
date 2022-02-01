<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroTipoEmpleado = true"/>
          <q-table
              title="Tipos de Empleado"
              :rows="rowsempleados"
              :columns="columnsempleados"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteTipoEmpleado(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarTipoEmpleadoMetodo(col.value)">
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
    <q-dialog v-model="RegistroTipoEmpleado" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de tipo de empleado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <q-input
              filled
              v-model="tipoEmpleado"
              label="  Titulo del nuevo tipo de empleado"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
            />    
            <q-input
              filled
              v-model="descriEmpleado"
              label="  Descripción del tipo de empleado"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
            />   
            <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTipoEmpleado = false" />
              <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />        
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog> 

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTipoEmpleado" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Editar tipo de empleado</div>
              </q-card-section>
            <q-card-section>
              <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
                <q-input  v-show="false" v-model="idEditarEmpleado" />
                <q-input
                  filled
                  v-model="editarEmpleado"
                  label="  Nuevo nombre del tipo de empleado"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
                />   
                 <q-input
                  filled
                  v-model="editarDescripcion"
                  label="  Nueva descripción del tipo de empleado"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
                />          
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTipoEmpleado = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />             
                </q-card-actions>
              </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>    
  
</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'


const columnsempleados = [                
                { name: 'tipo', align: 'center', label: 'Tipo de empleado', field: 'tipo', sortable: true, },
                { name: 'descripcion', align: 'center', label: 'Descipción del empleado', field: 'descripcion', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
                
            ]


export default defineComponent({
  name: 'TemplateTipoEmpleado',
  
  setup(){
    const $q = useQuasar()
    const textbuscar = ref('')
    const rowsempleados = ref([])
    const tipoEmpleado = ref("")
    const descriEmpleado = ref("")
    const idEditarEmpleado = ref("")
    const editarEmpleado = ref("")
    const editarDescripcion = ref("")
    const loading = ref(true)
    const RegistroTipoEmpleado = ref(false)
    const EditarTipoEmpleado = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/TiposEmpleados').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "tipo":reg.tipo, 
                        "descripcion": reg.descripcion                
                      };
            rowsempleados.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    // Este es el metodo para eliminar registro
    const DeleteTipoEmpleado = function(id){ 
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
        message: '¿Esta seguro de eliminar este tipo de área?',
        persistent: true
      }).onOk(() => {
         $q.loading.show()
          api.delete('/TiposEmpleados/'+id).then(function (respuesta){    
            let{data,success} = respuesta.data        
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })
            
              loading.value = true
              rowsempleados.value = [  ]
              getAreas()
              loading.value = false
              RegistroTipoEmpleado.value = false
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
      })
    }
  
    //Este es el metodo para editar registro
    const EditarTipoEmpleadoMetodo = function(id){
      EditarTipoEmpleado.value = true;
      api.get('/TiposEmpleados/'+id).then(function(res) {  
        let {data} = res.data
            editarEmpleado.value = data.tipo
            editarDescripcion.value = data.descripcion
            idEditarEmpleado.value = data.id 
        })
    }
       
    return{
       
       textbuscar,
       tipoEmpleado,
       descriEmpleado,
       editarEmpleado,
       editarDescripcion,
       idEditarEmpleado,
       columnsempleados,
       rowsempleados,
       RegistroTipoEmpleado,
       EditarTipoEmpleado,
       EditarTipoEmpleadoMetodo,
       DeleteTipoEmpleado,
       pagination,
       loading,
       
      //MEtodo submit para guardar registro
       onSubmit(){ 
          $q.loading.show()
          api.post("/TiposEmpleados",{
             tipo: tipoEmpleado.value,
             descripcion: descriEmpleado.value
          }).then(function (respuesta){       
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              
                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,                            
                })                                 
                loading.value = true
                rowsempleados.value = [  ]
                getAreas()
                loading.value = false
                RegistroTipoEmpleado.value = false  
                tipoEmpleado.value = ""
                descriEmpleado.value = ""
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
       },
      //Metodo edit para editar los registros
        onEdit(){
          $q.loading.show()
          const idT = idEditarEmpleado.value;
          api.put("/TiposEmpleados/"+idT,{
              tipo: editarEmpleado.value,
              descripcion: editarDescripcion.value
          }).then(function (respuesta){   
            let{data,success} = respuesta.data         
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })            
              loading.value = true
              rowsempleados.value = [  ]
              getAreas()
              loading.value = false
              EditarTipoEmpleado.value = false
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
          },
      
       exportTable () {
          const content = [columnsempleados.map(col => wrapCsvValue(col.label))].concat(
          rowsempleados.value.map(row => columnsempleados.map(col => wrapCsvValue(
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
