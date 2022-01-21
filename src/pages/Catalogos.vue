<template>
  <div class="q-pa-md">
    <h4 class="text-center">Catálogos de Tipos</h4>
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

      <q-tab-panels v-model="tab" animated>
        
        <q-tab-panel name="Areas">
          <div class="row q-pa-sm q-gutter-md">
                    <div class="col-12">                     
                        <q-table
                            title="Tipos de Areas"
                            :rows="rowsareas"
                            :columns="columnsareas"
                            :filter="textB"
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
  </div>
  
</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar,QStepperNavigation, Notify, QStepper } from 'quasar'


const columnsareas = [
                { name: 'name', field: rows2 => rows2.name ,format: val => `${val}`,align: 'left', label: 'Columna 1', field: 'Columna1', sortable: true },
                { name: 'Columna25', align: 'left', label: 'Columna 2', field: 'A', sortable: true, },
                { name: 'Columna35', align: 'left', label: 'Columna 3', field: 'Columna3' },
                { name: 'Columna4', align: 'left', label: 'Columna 4', field: 'Columna4' },
                
            ]
 const rowsareas=[
            {
                Columna1: "Registro1",
                Columna2: "Hola columna2",
                Columna3: "Hola columna3",
                Columna4: "Hola columna4"
            },
             {
                Columna1: "Registro2",
                Columna2: "Hola columna2",
                Columna3: "Hola columna3",
                Columna4: "Hola columna4"
            },
             {
                Columna1: "Registro3",
                Columna2: "Hola columna2",
                Columna3: "Hola columna3",
                Columna4: "Hola columna4"
            },
             {
                Columna1: "Registro4",
                Columna2: "Hola columna2",
                Columna3: "Hola columna3",
                Columna4: "Hola columna4"
            },
            
        ]

export default defineComponent({
  name: 'Catalogos',
  
  setup(){
    const textbuscar = ref('')
    return{
       tab: ref('Areas'),
       textbuscar,
       columnsareas,
       rowsareas,
       exportTable () {
          const content = [columns.map(col => wrapCsvValue(col.label))].concat(
          rows.map(row => columns.map(col => wrapCsvValue(
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
              icon: 'warning'
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
  }
  
})
</script>
