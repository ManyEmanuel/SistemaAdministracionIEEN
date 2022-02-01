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
            <TemplateTipoArea/>
        </q-tab-panel>
               
        <q-tab-panel name="Empleados">
            <TemplateTipoEmpleado/>
        </q-tab-panel>

        <q-tab-panel name="Movimientos">
            <TemplateTipoMovimiento/>
        </q-tab-panel>

        <q-tab-panel name="Representantes">
          <TemplateTipoRepresentante/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
 
</template>

<script>
import { defineComponent,ref } from 'vue';
import TemplateTipoArea from '../Components/CatalogosTipos/TemplateTipoArea.vue';
import TemplateTipoEmpleado from '../Components/CatalogosTipos/TemplateTipoEmpleado.vue';
import TemplateTipoMovimiento from '../Components/CatalogosTipos/TemplateTipoMovimiento.vue';
import TemplateTipoRepresentante from '../Components/CatalogosTipos/TemplateTipoRepresentante.vue'




export default defineComponent({
  name: 'CatalogosTipos',
  components : {
      TemplateTipoArea,
      TemplateTipoEmpleado,
      TemplateTipoMovimiento,
      TemplateTipoRepresentante,
  },
  setup(){   
    return{
       tab: ref('Areas'),   
      
    }  
  }
  
})

</script>
