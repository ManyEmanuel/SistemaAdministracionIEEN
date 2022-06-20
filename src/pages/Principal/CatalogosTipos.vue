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
        <q-tab v-for="item in ListaPermisos" :key="item.id" :name="item.nombre" :label="item.label" v-show="item.acceso"/>

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="TiposAreas">
            <TemplateTipoArea/>
        </q-tab-panel>

        <q-tab-panel name="TiposEmpleados">
            <TemplateTipoEmpleado/>
        </q-tab-panel>

        <q-tab-panel name="TiposMovimientos">
            <TemplateTipoMovimiento/>
        </q-tab-panel>

        <q-tab-panel name="TiposRepresentantes">
          <TemplateTipoRepresentante/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>

</template>

<script>
import { defineComponent,ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
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
    const $q = useQuasar();
      const store = useStore()
      const ListaPermisos = ref([])
      onBeforeMount( async() =>{
      ListaPermisos.value = store.getters['auth/CatalogosTipos']
     })
    return{
       tab: ref('TiposAreas'),
       ListaPermisos

    }
  }

})

</script>
