<template>
  <div class="q-pa-md">
    <h4 class="text-center">Catálogos Principales</h4><br>
   
    <q-card>
      
      <q-tabs
        v-model="tab"
        dense
        class="text-purple-ieen"
        active-color="purple-ieen-1"
        indicator-color="pink-ieen-1"
        align="justify"
      >
        <q-tab name="Areas" label="Areas" />
        <q-tab name="Puestos" label="Puestos" />
        <q-tab name="Requisitos" label="Requisitos" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="Areas">       
            <TemplateArea/>
        </q-tab-panel>
               
        <q-tab-panel name="Puestos">
            <TemplatePuestos/>
        </q-tab-panel>

        <q-tab-panel name="Requisitos">
            <TemplateRequisitos/>
        </q-tab-panel>       
      </q-tab-panels>
    </q-card>
  </div>
 
</template>

<script>
import { defineComponent,ref } from 'vue';
import TemplateArea from '../Components/CatalogosPrincipal/TemplateArea.vue';
import TemplatePuestos from '../Components/CatalogosPrincipal/TemplatePuestos.vue';
import TemplateTipoMovimiento from '../Components/CatalogosTipos/TemplateTipoMovimiento.vue';
import TemplateRequisitos from '../Components/CatalogosPrincipal/TemplateRequisitos.vue'




export default defineComponent({
  name: 'CatalogosPrincipal',
  components : {
      TemplateArea,
      TemplatePuestos,
      TemplateRequisitos,
  },
  setup(){   
    return{
       tab: ref('Areas'),   
      
    }  
  }
  
})

</script>
