<template>
          <!-- Aqui inicia el template con la tabla -->       
  <div class="row q-pa-sm q-gutter-md">     
      <div class="col-12">   
      </div>
  </div>
         
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistrarEmpleado(), limpiarRegistro()"/>
         <q-table
              title="Registro de empleados"
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
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteRequisito(col.value)"> 
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarRequisitoMetodo(col.value)">
                    <q-tooltip>
                      editar registro
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
    <q-dialog v-model="RegistroEmpleado" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de empleado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-sm"
            >
             <div class="q-pa-md">
              <q-stepper
                v-model="step"
                header-nav
                ref="stepper"
                color="purple-ieen"
                animated
              >
                <q-step
                  :name="1"
                  title="Datos personales"
                  icon="settings_accessibility"
                  :done=" step > 1"
                >
                  <div class="q-gutter-sm row items-start">
                      <div class="col">
                        <q-input
                          filled
                          v-model="nombresEmpleado"
                          label="Nombre del empleado"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del empleado']"
                        />   
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoPaterno"
                            label="Apellido paterno"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el apellido paterno']"
                          />   
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoMaterno"
                            label="Apellido materno"
                          />   
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-input 
                        v-model="fechaNacimiento" 
                        filled
                        type="date" 
                        hint="Fecha de nacimiento"
                          />
                      </div>
                      <div class="col">
                        <label>Sexo del empleado</label>
                        <div class="q-gutter-xl">
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="M" label="Mujer" color="purple-ieen-1" />
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="H" label="Hombre" color="purple-ieen-1"/>

                        </div>

                      </div>
                      <div class="col">
                        <q-file
                          filled 
                            v-model="fotoEmpleado" 
                            label="Foto del empleado" 
                            accept=".jpg, image/*"
                            @rejected="onRejected"
                          >
                          <template v-slot:prepend>
                            <q-icon name="add_photo_alternate" />
                          </template>
                        </q-file>
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="curpEmpleado"
                          label="Curp del empleado"
                          lazy-rules
                          :rules="[ val => val && val.length > 17 || 'Por favor ingresa la curp']"
                        />   
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="rfcEmpleado"
                            label="RFC del Empleado"
                            lazy-rules
                            :rules="[ val => val && val.length > 12 || 'Por favor ingresa el RFC']"
                          />   
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="emailEmpleado"
                          label="Email del empleado"                       
                          type="email"
                        />   
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="telefonoEmpleado"
                            label="Telefono del empleado"                  
                            type="tel"
                          />   
                      </div>
                      <div class="col">
                        <q-checkbox 
                          v-model="activoEmpleado" 
                          label="Activar empleado"
                          color="purple-ieen"
                          
                        />    
                      </div>  
                  </div>
                  <q-stepper-navigation align="right">
                    <q-btn @click="() => { ventana1 = true; step = 2 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>
                 

                <q-step
                  :name="2"
                  title="Datos del puesto"
                  icon="work"
                  :done="step > 2"
                >
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select 
                        filled
                        v-model="idTipoEmpleado"
                        :options="itemTipoEmp" 
                        label="Tipo de empleado" 
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un tipo de empleado']"
                  
                      />
                    </div>
                    <div class="col">
                      <q-select 
                        filled
                        v-model="idTratamiento"
                        :options="itemTratamiento" 
                        label="Tratamiento de empleado" 
                        @filter="filtroSelect"
                        
                  
                      />
                    </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select 
                        filled
                        v-model="idArea"
                        :options="itemArea" 
                        label="Área del empleado" 
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un área']"
                  
                      />
                    </div>
                    <div class="col">
                      <q-select 
                        filled
                        v-model="idPuesto"
                        :options="itemPuesto" 
                        label="Puesto a desarrollar" 
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un puesto']"
                  
                      />
                    </div>
                  </div>
                  <q-stepper-navigation align="right" class="q-gutter-sm ">                   
                    <q-btn @click="step = 1" color="negative" label="Atras" class="q-ml-sm" />
                    <q-btn @click="() => { ventana2 = true; step = 3 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="3"
                  title="Documentos Entregados"
                  icon="checklist"
                  :done="ventana3"
                >     
                  <div  class="q-gutter-sm q-gutter-y-sm row items-start" v-for=" item in itemRequisito" :key="item.value">
                    <div class="col q-pa-sm">
                      <q-file
                        filled 
                          v-model="item.value" 
                          :label="item.label" 
                          accept=".jpg,.pdf, image/*"
                          @rejected="onRejected"
                      >
                          <template v-slot:prepend>
                            <q-icon name="post_add" />
                          </template>
                      </q-file>
                    </div>
                    <div class="col"></div>
                                     
                    
                  </div>
                <q-stepper-navigation align="right" class="q-gutter-sm ">                   
                    <q-btn  @click="step = 2" color="negative" label="Atras" class="q-ml-sm" />
                     <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" @click="step = 1"/>     
                  </q-stepper-navigation>            
                </q-step>
              </q-stepper>
            </div>
          </q-form>
        </q-card-section>
         <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroEmpleado = false, step = 1" />           
          </q-card-actions>
      </q-card>
    </q-dialog> 

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarRequisito" persistent transition-show="scale" transition-hide="scale">
        
    </q-dialog>    
  
</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'


const columnsempleados = [                               
                
                { name: 'nombre', align: 'center', label: 'Nombre del Empleado', field: 'nombre', sortable: true, },
                { name: 'area', align: 'center', label: 'Área del Empleado', field: 'area', sortable: true, },
                { name: 'puesto', align: 'center', label: 'Puesto del Empleado', field: 'puesto', sortable: true, },
                { name: 'activo', align: 'center', label: 'Estatus del Empleado', field: 'activo', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },
                
            ]


export default defineComponent({
  name: 'TemplateEmpleados',
  
  setup(){
    const $q = useQuasar()
    //Variables de guardado y edición
    
    const idEmpleado = ref()
    const idArea = ref()
    const idPuesto = ref()
    const idTratamiento = ref()
    const idTipoEmpleado = ref()
    const nombresEmpleado = ref('')
    const apellidoPaterno = ref('')
    const apellidoMaterno = ref('')
    const fotoEmpleado = ref()
    const emailEmpleado = ref('')
    const fechaNacimiento = ref()
    const rfcEmpleado = ref('')
    const curpEmpleado = ref('')
    const telefonoEmpleado = ref()
    const sexoEmpleado = ref()
    const activoEmpleado = ref(false)
    //---------------------------------------------------------------------------//
    //
    const step = ref(1)
    const ventana1 = ref(false)
    const ventana2 = ref(false)
    const ventana3 = ref(false)
    const textbuscar = ref('')
    const rowsempleados = ref([])
    const itemTipoEmp = ref([])
    const itemTratamiento = ref([])
    const itemArea = ref([])
    const itemPuesto = ref([])
    const itemRequisito = ref([])
    const idEditarArea = ref("")
    const editarArea = ref("")
    const loading = ref(true)
    const RegistroEmpleado = ref(false)
    const EditarRequisito = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/Empleados').then(res => {  
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "nombre":reg.nombres +" " +reg.apellido_Paterno +" " + reg.apellido_Materno,
                        "activo":reg.activo,    
                        "area": reg.area,
                        "puesto": reg.puesto,    
                      };
            rowsempleados.value.push(obj)
        })
      })      
      loading.value = false
    }
    getAreas()

    const EditarRequisitoMetodo = function(id){
      EditarRequisito.value = true    
      api.get('/DocumentosRequeridos/'+id).then(function(res) {  
        let {data} = res.data
            idrequisito.value = data.id
            nombreRequisito.value = data.nombre
            activoRequisito.value = data.activo
      });      
    }  
    // Este es el metodo para eliminar registro
    const DeleteRequisito = function(id){ 
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
      }).onOk(() => {
         $q.loading.show()
          api.delete('/Empleados/'+id).then(function (respuesta){    
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
              RegistroEmpleado.value = false
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

    const limpiarRegistro = function(){
        idEmpleado.value = ""
        idArea.value=""
        idPuesto.value=""
        idTratamiento.value=""
        idTipoEmpleado.value=""
        nombresEmpleado.value=""
        apellidoPaterno.value="" 
        apellidoMaterno.value="" 
        fotoEmpleado.value=""
        emailEmpleado.value=""
        fechaNacimiento.value="" 
        rfcEmpleado.value=""
        curpEmpleado.value=""
        telefonoEmpleado.value=""
        sexoEmpleado.value=""
        activoEmpleado.value=false
    }

     const RegistrarEmpleado = function(){
      RegistroEmpleado.value = true
      itemArea.value =[]
      itemTipoEmp.value=[]
      itemPuesto.value=[]
      itemTratamiento.value=[]
      itemRequisito.value=[]
      api.get('/Areas').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemArea.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/TiposEmpleados').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTipoEmp.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });
      api.get('/Puestos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemPuesto.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/Tratamientos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTratamiento.value.push({
            label: item.titulo,
            value: item.id
          });
        })
      });
      api.get('/DocumentosRequeridos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemRequisito.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      console.log(itemRequisito.value)
    }
       
     
    return{

        idEmpleado,
        idArea,
        idPuesto,
        idTratamiento,
        idTipoEmpleado,
        nombresEmpleado,
        apellidoPaterno,
        apellidoMaterno, 
        fotoEmpleado,
        emailEmpleado,
        fechaNacimiento, 
        rfcEmpleado,
        curpEmpleado,
        telefonoEmpleado,
        sexoEmpleado,
        activoEmpleado,
       // Variables de guardado y edición
       step,
       ventana1,
       ventana2,
       ventana3,
       textbuscar,
       itemTipoEmp,
       itemTratamiento,
       itemArea,
       itemPuesto,
       itemRequisito,
       editarArea,
       idEditarArea,
       columnsempleados,
       rowsempleados,
       RegistroEmpleado,
       RegistrarEmpleado,
       EditarRequisito,
       DeleteRequisito,
       pagination,
       loading,
       limpiarRegistro,
       EditarRequisitoMetodo,
      //MEtodo submit para guardar registro
       onSubmit(){ 
          $q.loading.show()
          const formData = new FormData();
          formData.append("nombres", nombresEmpleado.value)
          formData.append("apellido_Paterno", apellidoPaterno.value)
          formData.append("apellido_Materno", apellidoMaterno.value)
          formData.append("foto", fotoEmpleado.value)
          formData.append("email", emailEmpleado.value)
          formData.append("fecha_nacimiento", fechaNacimiento.value)
          formData.append("rFC",rfcEmpleado.value)
          formData.append("cURP", curpEmpleado.value)
          formData.append("telefono",telefonoEmpleado.value)
          formData.append("sexo",sexoEmpleado.value)
          formData.append("activo",activoEmpleado.value)
          formData.append("area_Id",idArea.value.value)
          formData.append("puesto_Id",idPuesto.value.value)
          formData.append("tratamiento_Id",idTratamiento.value.value)
          formData.append("tipo_Empleado_Id", idTipoEmpleado.value.value)
          api.post("/Empleados",formData,{headers:{'Content-Type': 'multipart/form-data'}}).then(function (respuesta){       
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
                rowsempleados.value = [  ]
                getAreas()
                loading.value = false
                RegistroEmpleado.value = false 
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
          const idT = idrequisito.value;
          api.put("/DocumentosRequeridos/"+idT,{
                nombre: nombreRequisito.value,
                activo: activoRequisito.value,
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
              EditarRequisito.value = false
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
