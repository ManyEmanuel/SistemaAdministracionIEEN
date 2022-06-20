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
        <q-tab v-for="item in ListaPermisos" :key="item.id" :name="item.nombre" :label="item.label" v-show="item.acceso"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="text-right">
        //Registro de tipo de area//
        <q-tab-panel name="RegistroEmpleado">
            <TemplateEmpleados/>
        </q-tab-panel>
        <!--<q-tab-panel name="Contratos">
            <TemplateContratos/>
        </q-tab-panel>-->
        <q-tab-panel name="EncargadoArea">
          <TemplateResponsables/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { defineComponent,ref,onBeforeMount,watch } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';
import TemplateEmpleados from 'pages/Components/Empleados/TemplateEmpleados.vue';
import TemplateResponsables from 'pages/Components/Empleados/TemplateResponsables.vue';
//import TemplateContratos from 'pages/Components/Empleados/TemplateContratos.vue';


export default defineComponent({
  name: 'Empleados',
  components : {
      TemplateEmpleados,
      TemplateResponsables,
      //TemplateContratos
  },
  setup(){
    const $q = useQuasar();
      const store = useStore()
      const ListaPermisos = ref([])
      onBeforeMount( async() =>{
      ListaPermisos.value = store.getters['auth/Empleados']
     })
    return{
        tab: ref('RegistroEmpleado'),
        ListaPermisos,


    }
  }

})

</script>
