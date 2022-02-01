<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroTipoRepresentante = true"/>
          <q-table
              title="Tipos de Representantes"
              :rows="rowsrepresentante"
              :columns="columnsrepresentantes"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteTipoRepresentante(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarTipoRepresentanteMetodo(col.value)">
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
    <q-dialog v-model="RegistroTipoRepresentante" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de tipo de representantes</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <q-input
              filled
              v-model="tipoRepresentante"
              label="  Titulo del nuevo tipo de representante"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
            />  
            <q-input
              filled
              v-model="prioridadRepresentante"
              type="number"
              label="  Prioridad del representante"
              lazy-rules
              :rules="[ val => val && val > 0 || 'Por favor agrega un número valido']"
            />    
            
            
            <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTipoRepresentante = false" />
              <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />        
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog> 

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTipoRepresentante" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Editar tipo de movimiento</div>
              </q-card-section>
            <q-card-section>
              <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
                <q-input  v-show="false" v-model="idEditarRepresentante" />
                <q-input
                  filled
                  v-model="editarRepresentante"
                  label="  Nuevo nombre del tipo de representante"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
                />   
                <q-input
                  filled
                  v-model="editarPrioridad"
                  type="number"
                  label="  Prioridad del representante"
                  lazy-rules
                  :rules="[ val => val && val > 0 || 'Por favor agrega un número valido']"
                />    
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTipoRepresentante = false" />
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


const columnsrepresentantes = [                
                { name: 'tipo', align: 'center', label: 'Tipo de representante', field: 'tipo', sortable: true, },
                { name: 'prioridad', align: 'center', label: 'Prioridad del representante', field: 'prioridad', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
                
            ]


export default defineComponent({
  name: 'TemplateTipoRepresentante',
  
  setup(){
    const $q = useQuasar()
    const textbuscar = ref('')
    const rowsrepresentante = ref([])
    const tipoRepresentante = ref("")
    const prioridadRepresentante = ref(0)
    const idEditarRepresentante = ref("")
    const editarRepresentante = ref("")
    const editarPrioridad = ref("")
    const loading = ref(true)
    const RegistroTipoRepresentante = ref(false)
    const EditarTipoRepresentante = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/TiposRepresentantes').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "tipo":reg.tipo, 
                        "prioridad": reg.prioridad                
                      };
            rowsrepresentante.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    // Este es el metodo para eliminar registro
    const DeleteTipoRepresentante = function(id){ 
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
          api.delete('/TiposRepresentantes/'+id).then(function (respuesta){    
            let{data,success} = respuesta.data        
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })
            
              loading.value = true
              rowsrepresentante.value = [  ]
              getAreas()
              loading.value = false
              RegistroTipoRepresentante.value = false
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
    const EditarTipoRepresentanteMetodo = function(id){
      EditarTipoRepresentante.value = true;
      api.get('/TiposRepresentantes/'+id).then(function(res) {  
        let {data} = res.data
            editarRepresentante.value = data.tipo
            editarPrioridad.value = data.prioridad
            idEditarRepresentante.value = data.id 
        })
    }
       
    return{
       
       textbuscar,
       tipoRepresentante,
       prioridadRepresentante,
       editarRepresentante,
       editarPrioridad,
       idEditarRepresentante,
       columnsrepresentantes,
       rowsrepresentante,
       RegistroTipoRepresentante,
       EditarTipoRepresentante,
       EditarTipoRepresentanteMetodo,
       DeleteTipoRepresentante,
       pagination,
       loading,
       
      //MEtodo submit para guardar registro
       onSubmit(){ 
          $q.loading.show()
          api.post("/TiposRepresentantes",{
             tipo: tipoRepresentante.value,
             prioridad: prioridadRepresentante.value
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
                rowsrepresentante.value = [  ]
                getAreas()
                loading.value = false
                RegistroTipoRepresentante.value = false  
                tipoRepresentante.value =""
                prioridadRepresentante.value = 0
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
          const idT = idEditarRepresentante.value;
          api.put("/TiposRepresentantes/"+idT,{
              tipo: editarRepresentante.value,
              prioridad: editarPrioridad.value
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
              rowsrepresentante.value = [  ]
              getAreas()
              loading.value = false
              EditarTipoRepresentante.value = false
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
          const content = [columnsrepresentantes.map(col => wrapCsvValue(col.label))].concat(
          rowsrepresentante.value.map(row => columnsrepresentantes.map(col => wrapCsvValue(
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
