<template>
  <div class="q-pa-md">
    <h4 class="text-center">Catálogos de Tipos</h4><br>
   
    <q-card>
      
      <q-tabs
        v-model="tab"
        dense
        class="text-purple-ieen"
        active-color="purple-ieen-1"
        indicator-color="pink-ieen-1"
        align="justify"
      >
        <q-tab name="Areas" label="Tipos Areas" />
        <q-tab name="Empleados" label="Tipos Empleados" />
        <q-tab name="Movimientos" label="Tipos Movimientos" />
        <q-tab name="Representantes" label="Tipos Representantes" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="Areas">         
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
                      </template>
                  </q-table>
              </div>
          </div>
        </q-tab-panel>
        


        //----------------------------------------------------------------------------------------------------------------------------------------//
        <q-tab-panel name="Empleados">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>


        <q-tab-panel name="Movimientos">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="Representantes">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-dialog v-model="RegistroTipoArea" persistent transition-show="scale" transition-hide="scale">
       <q-card class=" text-black" style="width: 300px">
      <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="tipoArea"
        label="  Titulo del nuevo tipo de area"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingresa un titulo']"
      />

      
      <div>
        <q-btn label="Guardar" type="submit" color="positive"/>
        <q-btn label="Cancelar" type="reset" color="negative"  class="q-ml-sm" @click="RegistroTipoArea = false" />
      </div>
    </q-form>
       </q-card>
    </q-dialog> 

  </div>
 
</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar, Dialog, QStepperNavigation, Notify, QStepper } from 'quasar'
import {api} from '../boot/axios.js'


const columnsareas = [                
                { name: 'tipo', align: 'center', label: 'Tipo Área', field: 'tipo', sortable: true, },
                { name: 'Opciones', align: 'center', label: 'Opciones', field: 'Opciones' },
                
                
            ]


export default defineComponent({
  name: 'Catalogos',
  
  setup(){
    const $q = useQuasar()
    const textbuscar = ref('')
    const rowsareas = ref([])
    const rowsT = ref([])
    const tipoArea = ref("")
    
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
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
    }
    getAreas()
     
    return{
       tab: ref('Areas'),   
       textbuscar,
       tipoArea,
       RegistroTipoArea: ref(false),
       columnsareas,
       pagination,
       rowsareas,

       onSubmit(){
          api.post("/TiposAreas",{
             tipo: tipoArea.value,
          }).then(function (respuesta){
            let data = respuesta.code;
            if(data == 200){
              RegistroTipoArea.value =false;
              $q.notify({
                type: 'positive',
                message: 'Tipo de área registrada".',
                position: 'top-right',
                progress: true,                
              })
              
            }else{
              $q.notify({
                type: 'negative',
                message: 'Error al registrar el tipo de área".',
                position: 'top-right',
                progress: true
              })
            }
          })  
          getAreas()      
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
