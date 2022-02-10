<template>
  <div class="q-pa-md">
    <h4 class="text-center">Partidos Politicos</h4><br>
  
  <q-card>
      
      <q-tabs
        v-model="tab"
        dense
        class="text-purple-ieen"
        active-color="purple-ieen-1"
        indicator-color="pink-ieen-1"
        align="justify"
      >
        <q-tab name="Partidos" label="Partidos Politicos" />
        <q-tab name="Integracion" label="Integración Partidos Politicos" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="Partidos">       
            <TemplatePartidos/>
        </q-tab-panel>             
        <q-tab-panel name="Integracion">
            <TemplateIntegracionPartidos/>
        </q-tab-panel>    
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { defineComponent,ref } from 'vue';
import TemplatePartidos from 'pages/Components/PartidosPoliticos/TemplatePartidos.vue'
import TemplateIntegracionPartidos from 'pages/Components/PartidosPoliticos/TemplateIntegracionPartidos.vue'

export default defineComponent({
  name: 'PartidosPoliticos',
  components : {
    TemplatePartidos,
    TemplateIntegracionPartidos,
  },
  setup(){   
    return{
      tab: ref('Partidos'),   
      
    }  
  }
  
})

</script>