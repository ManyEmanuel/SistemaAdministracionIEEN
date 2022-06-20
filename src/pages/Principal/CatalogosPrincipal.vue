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

       <q-tab v-for="item in ListaPermisos" :key="item.id" :name="item.nombre" :label="item.label" v-show="item.acceso"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="Áreas">
            <TemplateArea/>
        </q-tab-panel>

        <q-tab-panel name="Puestos">
            <TemplatePuestos/>
        </q-tab-panel>

        <q-tab-panel name="Requisitos">
            <TemplateRequisitos/>
        </q-tab-panel>
         <q-tab-panel name="Tratamientos">
            <TemplateTratamiento/>
        </q-tab-panel>
        <q-tab-panel name="TabuladorViaticos">
            <TemplateTabuladorViatico/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>

</template>

<script>
import { defineComponent,ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import TemplateArea from '../Components/CatalogosPrincipal/TemplateArea.vue';
import TemplatePuestos from '../Components/CatalogosPrincipal/TemplatePuestos.vue';
import TemplateRequisitos from '../Components/CatalogosPrincipal/TemplateRequisitos.vue'
import TemplateTratamiento from '../Components/CatalogosPrincipal/TemplateTratamiento.vue'
import TemplateTabuladorViatico from '../Components/CatalogosPrincipal/TemplateTabuladorViatico.vue'




export default defineComponent({
  name: 'CatalogosPrincipal',
  components : {
      TemplateArea,
      TemplatePuestos,
      TemplateRequisitos,
      TemplateTratamiento,
      TemplateTabuladorViatico,
  },
  setup(){
      const $q = useQuasar();
      const store = useStore()
      const ListaPermisos = ref([])
      onBeforeMount( async() =>{
      ListaPermisos.value = store.getters['auth/CatalogosPrincipal']
     })


    return{
       tab: ref('Áreas'),
       ListaPermisos,

    }
  }

})

</script>
