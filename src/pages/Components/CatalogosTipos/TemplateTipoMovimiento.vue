<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroTipoMovimiento = true"/>
          <q-table
              title="Tipos de Movimiento"
              :rows="rowsmovimientos"
              :columns="columnsmovimientos"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteTipoMovimiento(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarTipoMovimientoMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>                 
                  <label v-else-if="col.name === 'naturaleza' && col.value ==='A'"> Alta</label>
                  <label v-else-if="col.name === 'naturaleza' && col.value ==='B'"> Baja</label>
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
      </div>
  </div>
       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroTipoMovimiento" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de tipo de movimiento</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <q-input
              filled
              v-model="tipoMovimiento"
              label="  Titulo del nuevo tipo de movimiento"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
            />    
            <label>¿Que naturaleza tiene este movimiento?</label><br>
            
            <q-radio v-model="naturalezaMovimiento" val="A" label="Alta" color="purple-ieen"/>
            <q-radio v-model="naturalezaMovimiento" val="B" label="Baja" color="purple-ieen"/>
            
            <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTipoMovimiento = false" />
              <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />        
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog> 

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTipoMovimiento" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Editar tipo de movimiento</div>
              </q-card-section>
            <q-card-section>
              <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
                <q-input  v-show="false" v-model="idEditarMovimiento" />
                <q-input
                  filled
                  v-model="editarMovimiento"
                  label="  Nuevo nombre del tipo de movimiento"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
                />   
                <label>¿Que naturaleza tiene este movimiento?</label><br>            
                <q-radio v-model="editarNaturaleza" val="A" label="Alta" color="purple-ieen"/>
                <q-radio v-model="editarNaturaleza" val="B" label="Baja" color="purple-ieen"/>  
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTipoMovimiento = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />             
                </q-card-actions>
              </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>    

</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar } from 'quasar'
import {api} from '../../../boot/axios.js'


const columnsmovimientos = [                
                { name: 'tipo', align: 'center', label: 'Tipo de movimiento', field: 'tipo', sortable: true, },
                { name: 'naturaleza', align: 'center', label: 'Naturaleza del movimiento', field: 'naturaleza', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
                
            ]


export default defineComponent({
  name: 'TemplateTipoMovimiento',
  
  setup(){
    const $q = useQuasar()
    const textbuscar = ref('')
    const rowsmovimientos = ref([])
    const tipoMovimiento = ref("")
    const naturalezaMovimiento = ref("")
    const idEditarMovimiento = ref("")
    const editarMovimiento = ref("")
    const editarNaturaleza = ref("")
    const loading = ref(true)
    const RegistroTipoMovimiento = ref(false)
    const EditarTipoMovimiento = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/TiposMovimientos').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "tipo":reg.tipo, 
                        "naturaleza": reg.naturaleza                
                      };
            rowsmovimientos.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    // Este es el metodo para eliminar registro
    const DeleteTipoMovimiento = function(id){ 
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
          api.delete('/TiposMovimientos/'+id).then(function (respuesta){    
            let{data,success} = respuesta.data        
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })
            
              loading.value = true
              rowsmovimientos.value = [  ]
              getAreas()
              loading.value = false
              RegistroTipoMovimiento.value = false
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
    const EditarTipoMovimientoMetodo = function(id){
      EditarTipoMovimiento.value = true;
      api.get('/TiposMovimientos/'+id).then(function(res) {  
        let {data} = res.data
            editarMovimiento.value = data.tipo
            editarNaturaleza.value = data.naturaleza
            idEditarMovimiento.value = data.id 
        })
    }
       
    return{
       
       textbuscar,
       tipoMovimiento,
       naturalezaMovimiento,
       editarMovimiento,
       editarNaturaleza,
       idEditarMovimiento,
       columnsmovimientos,
       rowsmovimientos,
       RegistroTipoMovimiento,
       EditarTipoMovimiento,
       EditarTipoMovimientoMetodo,
       DeleteTipoMovimiento,
       pagination,
       loading,
       
      //MEtodo submit para guardar registro
       onSubmit(){ 
          $q.loading.show()
          api.post("/TiposMovimientos",{
             tipo: tipoMovimiento.value,
             naturaleza: naturalezaMovimiento.value
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
                rowsmovimientos.value = [  ]
                getAreas()
                loading.value = false
                RegistroTipoMovimiento.value = false  
                tipoMovimiento.value =""
                naturalezaMovimiento.value = ""
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
          const idT = idEditarMovimiento.value;
          api.put("/TiposMovimientos/"+idT,{
              tipo: editarMovimiento.value,
              naturaleza: editarNaturaleza.value
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
              rowsmovimientos.value = [  ]
              getAreas()
              loading.value = false
              EditarTipoMovimiento.value = false
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
          const content = [columnsmovimientos.map(col => wrapCsvValue(col.label))].concat(
          rowsmovimientos.value.map(row => columnsmovimientos.map(col => wrapCsvValue(
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
