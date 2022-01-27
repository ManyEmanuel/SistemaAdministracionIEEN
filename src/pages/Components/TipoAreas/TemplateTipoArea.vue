<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroTipoArea = true"/>
          <q-table
              title="Tipos de Areas"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteTipoArea(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarTipoAreaMetodo(col.value)">
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
          <div class="text-h6">Registro de tipo de área</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <q-input
              filled
              v-model="tipoArea"
              label="  Titulo del nuevo tipo de area"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
            />     
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
                <q-input  v-show="false" v-model="idEditarArea" />
                <q-input
                  filled
                  v-model="editarArea"
                  label="  Nuevo nombre del tipo de área"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
                />            
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
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar, Dialog, QStepperNavigation, Notify, QStepper } from 'quasar'
import {api} from '../../../boot/axios.js'


const columnsareas = [                
                { name: 'tipo', align: 'center', label: 'Tipo Área', field: 'tipo', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
                
            ]


export default defineComponent({
  name: 'TemplateTipoArea',
  
  setup(){
    const $q = useQuasar()
    const textbuscar = ref('')
    const rowsareas = ref([])
    const tipoArea = ref("")
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
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/TiposAreas').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "tipo":reg.tipo,                 
                      };
            rowsareas.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    // Este es el metodo para eliminar registro
    const DeleteTipoArea = function(id){ 
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
          api.delete('/TiposAreas/'+id).then(function (respuesta){            
            if(respuesta.status == 200){        
              $q.notify({
                type: 'positive',
                message: 'Registro de tipo de área eliminada.',
                position: 'top-right',
                progress: true,                            
              })
            RegistroTipoArea.value = false
           
            }else{
              $q.notify({
                type: 'negative',
                message: 'Error al eliminar el tipo de área".',
                position: 'top-right',
                progress: true
              })
            }
          })   
      })
    }
  
    //Este es el metodo para editar registro
    const EditarTipoAreaMetodo = function(id){
      EditarTipoArea.value = true;
      api.get('/TiposAreas/'+id).then(function(res) {  
        let {data} = res.data

            editarArea.value = data.tipo
            idEditarArea.value = data.id 
        })
    }
       
    return{
       
       textbuscar,
       tipoArea,
       editarArea,
       idEditarArea,
       columnsareas,
       rowsareas,
       RegistroTipoArea,
       EditarTipoArea,
       EditarTipoAreaMetodo,
       DeleteTipoArea,
       pagination,
       loading,
       
      //MEtodo submit para guardar registro
       onSubmit(){ 
          api.post("/TiposAreas",{
             tipo: tipoArea.value,
          }).then(function (respuesta){            
            if(respuesta.status == 200){        
              $q.notify({
                type: 'positive',
                message: 'Tipo de área registrada.',
                position: 'top-right',
                progress: true,                            
              })
            RegistroTipoArea.value = false
  
            }else{
              $q.notify({
                type: 'negative',
                message: 'Error al registrar el tipo de área".',
                position: 'top-right',
                progress: true
              })
            }
          })     
       },
      //Metodo edit para editar los registros
        onEdit(){
          const idT = idEditarArea.value;
          api.put("/TiposAreas/"+idT,{
              tipo: editarArea.value
          }).then(function (respuesta){            
            if(respuesta.status == 200){        
              $q.notify({
                type: 'positive',
                message: 'Tipo de área editada.',
                position: 'top-right',
                progress: true,                            
              })
            EditarTipoArea.value = false
  
            }else{
              $q.notify({
                type: 'negative',
                message: 'Error al editar el tipo de área".',
                position: 'top-right',
                progress: true
              })
            }
          })     
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
