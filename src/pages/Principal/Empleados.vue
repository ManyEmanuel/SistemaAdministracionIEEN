<template>
  <div class="q-pa-md">
    <h4 class="text-center">Empleados</h4><br>
  
  <q-card>
      
      <q-tabs
        v-model="tab"
        dense
        class="text-purple-ieen"
        active-color="purple-ieen-1"
        indicator-color="pink-ieen-1"
        align="justify"
      >
        <q-tab name="Empleados" label="Registro Empleados" />
        <q-tab name="Contratos" label="Contratos Empleados" />
         <q-tab name="Jefes" label="Encargados de área" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="Empleados">       
            <TemplateEmpleados/>
        </q-tab-panel>             
        <q-tab-panel name="Integracion">
          
        </q-tab-panel>  
        <q-tab-panel name="Jefes">
          
        </q-tab-panel>    
      </q-tab-panels>
    </q-card>
  </div>

</template>

<script>
import { defineComponent,ref } from 'vue';
import TemplateEmpleados from 'pages/Components/Empleados/TemplateEmpleados.vue';
export default defineComponent({
  name: 'Empleados',
  components : {
      TemplateEmpleados
  },
  setup(){   
    return{
        tab: ref('Empleados')
     
      
    }  
  }
  
})

</script>