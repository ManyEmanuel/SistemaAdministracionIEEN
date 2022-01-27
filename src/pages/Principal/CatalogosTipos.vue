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
import TemplateTipoArea from '../Components/CatalogosTipos/TemplateTipoArea.vue';
import TemplateTipoEmpleado from '../Components/CatalogosTipos/TemplateTipoEmpleado.vue';




export default defineComponent({
  name: 'Catalogos',
  components : {
      TemplateTipoArea,
      TemplateTipoEmpleado,
  },
  setup(){   
    return{
       tab: ref('Areas'),   
      
    }  
  }
  
})

</script>
