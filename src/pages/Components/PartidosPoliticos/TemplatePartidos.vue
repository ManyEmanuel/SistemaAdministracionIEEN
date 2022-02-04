<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroPartido = true,limpiarRegistro()"/>
          <q-table
              title="Tipos de Empleado"
              :rows="rowspartidos"
              :columns="columnspartidos"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeletePartido(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarPartidoMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>
                  <q-img v-else-if="col.name==='logo_Url'"
                    :src="col.value"
                    spinner-color="white"
                    style="height: 70px; max-width: 60px"
                  />
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
      </div>
  </div>
       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroPartido" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de partido politico</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombrePartido"
                    label="Nombre del partido politico"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del partido']"
                  />   
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="siglasPartido"
                      label="Siglas del partido politico"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Por favor ingresa las siglas']"
                    />   
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class ="col">
                <q-file
                 filled 
                  v-model="logoPartido" 
                  label="Logo del partido" 
                  accept=".jpg, image/*"
                  @rejected="onRejected"
                >
                  <template v-slot:prepend>
                    <q-icon name="add_photo_alternate" />
                  </template>
                </q-file>
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model="pantoneF"
                  class="my-input"
                  label="Pantone de fondo"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-color v-model="pantoneF" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                 <q-input
                  filled
                  v-model="pantoneL"
                  class="my-input"
                  label="Pantone de letra"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-color v-model="pantoneL" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-gutter-sm row items-start">
             <div class="col">
                  <q-input
                    filled
                    v-model="emailPartido"
                    label="Email del partido"
                    type="email"
                  />   
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="telPartido"
                      label="telefono del partido"
                      type="tel"
                    />   
                </div>
            </div>
            
            
            <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroPartido = false" />
              <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />        
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog> 

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarPartido" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Editar partido politico</div>
              </q-card-section>
            <q-card-section>
              <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
            <q-input v-show="false" v-model="idPartido" />
                <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="nombrePartido"
                    label="Nombre del partido politico"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del partido']"
                  />   
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="siglasPartido"
                      label="Siglas del partido politico"
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Por favor ingresa las siglas']"
                    />   
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class="col">
                <q-file
                 filled 
                  v-model="logoPartido" 
                  label="Logo del partido" 
                  accept=".jpg, image/*"
                  @rejected="onRejected"
                >
                  <template v-slot:prepend>
                    <q-icon name="add_photo_alternate" />
                  </template>
                </q-file>
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model="pantoneF"
                  class="my-input"
                  label="Pantone de fondo"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-color v-model="pantoneF" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col">
                 <q-input
                  filled
                  v-model="pantoneL"
                  class="my-input"
                  label="Pantone de letra"
                >
                  <template v-slot:append>
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-color v-model="pantoneL" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="q-gutter-sm row items-start">
             <div class="col">
                  <q-input
                    filled
                    v-model="emailPartido"
                    label="Email del partido"
                    type="email"
                  />   
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="telPartido"
                      label="telefono del partido"
                      type="tel"
                    />   
                </div>
            </div>
        
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarPartido = false" />
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


const columnspartidos = [                
                { name: 'nombre', align: 'center', label: 'Nombre del partido', field: 'nombre', sortable: true, },
                { name: 'siglas', align: 'center', label: 'Siglas del partido', field: 'siglas', sortable: true, },
                { name: 'logo_Url', align: 'center', label: 'Logo del partido', field: 'logo_Url', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
                
            ]


export default defineComponent({
  name: 'TemplatePartidos',
  
  setup(){
    
    const $q = useQuasar()
    const nombrePartido = ref("")
    const siglasPartido = ref("")
    const logoPartido = ref()
    const emailPartido = ref("")
    const telPartido = ref("")
    const pantoneF = ref("")
    const pantoneL = ref("")
    const textbuscar = ref('')
    const rowspartidos = ref([])
    const idPartido = ref("")
    const editarEmpleado = ref("")
    const editarDescripcion = ref("")
    const getImage= ref()
    const loading = ref(true)
    const RegistroPartido = ref(false)
    const EditarPartido = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/Partidos').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "nombre":reg.nombre, 
                        "siglas": reg.siglas,
                        "logo_Url": reg.logo_Url                
                      };
            rowspartidos.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    // Este es el metodo para eliminar registro
    const DeletePartido = function(id){ 
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
          api.delete('/Partidos/'+id).then(function (respuesta){    
            let{data,success} = respuesta.data        
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })
            
              loading.value = true
              rowspartidos.value = [  ]
              getAreas()
              loading.value = false
              RegistroPartido.value = false
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
    const EditarPartidoMetodo = function(id){
      EditarPartido.value = true;
      api.get('/Partidos/'+id).then(function(res) {  
        let {data} = res.data
            idPartido.value = data.id
            nombrePartido.value = data.nombre
            siglasPartido.value = data.siglas 
            logoPartido.value = data.logo_Url
            pantoneF.value = data.pantone_Fondo
            pantoneL.value = data.pantone_Letra
            emailPartido.value = data.email
            telPartido.value = data.telefono

        })
    }
    const limpiarRegistro = function(){
            idPartido.value = ""
            nombrePartido.value = ""
            siglasPartido.value = "" 
            logoPartido.value = ""
            pantoneF.value = ""
            pantoneL.value = ""
            emailPartido.value = ""
            telPartido.value = ""

    }
    return{
       
       textbuscar,
       nombrePartido,
       siglasPartido,
       logoPartido,
       emailPartido,
       telPartido,
       pantoneF,
       pantoneL,
       editarEmpleado,
       editarDescripcion,
       idPartido,
       columnspartidos,
       rowspartidos,
       RegistroPartido,
       EditarPartido,
       EditarPartidoMetodo,
       DeletePartido,
       pagination,
       loading,
       getImage,
       
      
             
       onSubmit(){ 
          
          $q.loading.show()
          const formData = new FormData();
          formData.append("nombre", nombrePartido.value)
          formData.append("siglas", siglasPartido.value)
          formData.append("logo",logoPartido.value)
          formData.append("pantone_Fondo", pantoneF.value)
          formData.append("pantone_Letra", pantoneL.value)
          formData.append("email", emailPartido.value)
          formData.append("telefono", telPartido.value)
          api.post("/Partidos",formData,{headers:{'Content-Type': 'multipart/form-data'}}).then(function (respuesta){       
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              
                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,                            
                })                                 
                loading.value = true
                rowspartidos.value = [  ]
                getAreas()
                loading.value = false
                RegistroPartido.value = false  
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
          const formData = new FormData();
          formData.append("nombre", nombrePartido.value)
          formData.append("siglas", siglasPartido.value)
          formData.append("logo",logoPartido.value)
          formData.append("pantone_Fondo", pantoneF.value)
          formData.append("pantone_Letra", pantoneL.value)
          formData.append("email", emailPartido.value)
          formData.append("telefono", telPartido.value)
          const idT = idPartido.value;
          api.put("/Partidos/"+idT,formData,{headers:{'Content-Type': 'multipart/form-data'}}).then(function (respuesta){   
            let{data,success} = respuesta.data         
            if(respuesta.status == 200 && success == true){        
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,                            
              })            
              loading.value = true
              rowspartidos.value = [  ]
              getAreas()
              loading.value = false
              EditarPartido.value = false
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
          const content = [columnspartidos.map(col => wrapCsvValue(col.label))].concat(
          rowspartidos.value.map(row => columnspartidos.map(col => wrapCsvValue(
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
