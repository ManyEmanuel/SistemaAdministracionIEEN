<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistrarArea"/>
          <q-table
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteArea(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarAreaMetodo(col.value)">
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
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'


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
    const nombreArea = ref('')
    const siglasArea = ref('')
    const emailArea = ref('')
    const extArea = ref('')
    const itemsArea = ref([])
    //---------------------------------------------------------------------------//
    //
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
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/Areas').then(res => {  
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
      })      
      loading.value = false
    }
    getAreas()

    const RegistrarArea = function(){
      RegistroTipoArea.value = true
      itemsArea.value =[]
      api.get('/TiposAreas').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsArea.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });
    }

    const EditarAreaMetodo = function(id){
      EditarTipoArea.value = true    
      
      itemsArea.value =[]
      api.get('/TiposAreas').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsArea.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });      
      api.get('/Areas/'+id).then(function(res) {  
        let {data} = res.data
            idarea.value = data.id
            nombreArea.value = data.nombre
            siglasArea.value = data.siglas
            emailArea.value = data.email
            extArea.value = data.extension
            const filtro1 = itemsArea.value
            const {label} = filtro1.find(elemento => elemento.value === data.tipo_Area_Id)
            tipoArea.value = label
            
      });  

    }
    
    // Este es el metodo para eliminar registro
    const DeleteArea = function(id){ 
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
      }).onOk(() => {
         $q.loading.show()
          api.delete('/Areas/'+id).then(function (respuesta){    
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

    const limpiarRegistro = function(){
                  idarea.value = ""
                   nombreArea.value=""
                   siglasArea.value=""
                   emailArea.value=""
                   extArea.value=""
                   tipoArea.value ="" 
    }
       
     
    return{
       // Variables de guardado y edición
       nombreArea,
       siglasArea,
       emailArea,
       extArea,
       idarea,
       tipoArea,
       itemsArea,
       textbuscar,
       editarArea,
       idEditarArea,
       columnsareas,
       rowsareas,
       RegistroTipoArea,
       EditarTipoArea,
       RegistrarArea,
       EditarTipoAreaMetodo,
       DeleteArea,
       pagination,
       loading,
       limpiarRegistro,
       EditarAreaMetodo,
      //MEtodo submit para guardar registro
       onSubmit(){ 
          $q.loading.show()
          const{value} = tipoArea.value
          console.log(value)
          api.post("/Areas",{
             tipo_Area_Id: value,
                   nombre: nombreArea.value,
                   siglas: siglasArea.value,
                   email: emailArea.value,
                   extension: extArea.value,
          }).then(function (respuesta){       
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
          })     
       },

      
      //Metodo edit para editar los registros
        onEdit(){
          $q.loading.show()
          const {value} = tipoArea.value
          let idTipo = value
          
            if(typeof idTipo === 'string'){
              const filtro1 = itemsArea.value
                const {value} = filtro1.find(elemento => elemento.label === tipoArea.value)
                idTipo = value           
            }  
          const idT = idarea.value;
          api.put("/Areas/"+idT,{
               tipo_Area_Id: idTipo,
                   nombre: nombreArea.value,
                   siglas: siglasArea.value,
                   email: emailArea.value,
                   extension: extArea.value,
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
