<template>
          <!-- Aqui inicia el template con la tabla -->
  <div class="row q-pa-sm q-gutter-md">
      <div class="col-12">
        <q-btn v-show="PRegistrar" class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistrarTabulador"/>
          <q-table
              v-show="PLeer"
              title="Tabulador de viaticos"
              :rows="rowstabulador"
              :columns="columnstabulador"
              :filter="textbuscar"
              row-key ="id"
              color="purple-ieen"
              :loading="loading"
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
              </template >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body ="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                  <q-btn v-if="col.name==='id'" v-show="PEliminar" flat round color="purple-ieen" icon="delete" @click="DeleteTabulador(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" v-show="PActualizar" flat round color="purple-ieen" icon="edit" @click="EditarTabuladorMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>
                   <q-btn v-if="col.name==='id'" v-show="PLeer" flat round color="purple-ieen" icon="visibility" @click="VerTabulador(col.value)">
                    <q-tooltip>
                      Ver tabulador
                    </q-tooltip>
                  </q-btn>
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
      </div>
  </div>
       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroTipoTabulador" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de tabulador de viatico</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-sm"
            >
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-select
                    filled
                    v-model="tipoEmpleado"
                    :options="itemsTabulador"
                    label="Tipo de empleado"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor selecciona un tipo de empleado']"
                  />
                </div>
                <div class="col"></div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de 30 a 100 km de distancia</q-badge>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer30100"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per30100"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de mas de 100 km de distancia</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer100"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per100"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes a Bahia de Banderas</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerBahia"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perBahia"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes fuera del estado</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerFuera"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perFuera"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val.length > 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <q-card-actions align="right">
                <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroTipoTabulador = false" />
                <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
              </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarTipoTabulador" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Editar tipo de área</div>
          </q-card-section>
          <q-card-section>
            <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
              <q-input  v-show="false" v-model="idTabulador" />
               <div class="q-gutter-sm column items-center">
                <div class="col">
                  <h4 class="q-ma-xs">{{tipoEmpleado}}</h4>
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de 30 a 100 km de distancia</q-badge>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer30100"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per30100"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de mas de 100 km de distancia</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer100"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per100"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes a Bahia de Banderas</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerBahia"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perBahia"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes fuera del estado</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerFuera"
                    label="Viatico sin pernoctar"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perFuera"
                    label="Viatico pernoctando"
                    lazy-rules
                    type="number" prefix="$"
                    :rules="[ val => val && val >= 0 || 'Por favor ingresa una cantidad']"
                  />
                </div>
              </div>
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarTipoTabulador = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
                </q-card-actions>
              </q-form>
          </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="VerTipoTabulador" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Ver tabulador de viatico</div>
          </q-card-section>
          <q-card-section>
            <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
              <q-input  v-show="false" v-model="idTabulador" />
               <div class="q-gutter-sm column items-center">
                <div class="col">
                  <h4 class="q-ma-xs">{{tipoEmpleado}}</h4>
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de 30 a 100 km de distancia</q-badge>
              </div>
              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer30100"
                    label="Viatico sin pernoctar"
                    readonly
                    prefix="$"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per30100"
                    label="Viatico pernoctando"
                    readonly
                    prefix="$"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes de mas de 100 km de distancia</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPer100"
                    label="Viatico sin pernoctar"
                    readonly
                    prefix="$"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="per100"
                    label="Viatico pernoctando"
                    readonly
                    prefix="$"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes a Bahia de Banderas</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerBahia"
                    label="Viatico sin pernoctar"
                    readonly
                    prefix="$"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perBahia"
                    label="Viatico pernoctando"
                    readonly
                    prefix="$"
                  />
                </div>
              </div>
              <div class="q-gutter-sm">
                <q-badge class="q-pa-sm" transparent color=pink-ieen-3 text-color="white" style="font-size:120%">Viaticos para viajes fuera del estado</q-badge>
              </div>

              <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-input
                    filled
                    v-model="sinPerFuera"
                    label="Viatico sin pernoctar"
                    readonly
                    prefix="$"
                  />
                </div>
                <div class="col">
                   <q-input
                    filled
                    v-model="perFuera"
                    label="Viatico pernoctando"
                    readonly
                    prefix="$"

                  />
                </div>
              </div>
                <q-card-actions align="right">
                  <q-btn label="Cerrar" type="reset" color="negative"   @click="VerTipoTabulador = false" />
                </q-card-actions>
              </q-form>
          </q-card-section>
        </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref,onBeforeMount } from 'vue';
import { exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';

const columnstabulador = [


                { name: 'tipo_Empleado', align: 'center', label: 'Tipo de Empleado', field: 'tipo_Empleado', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplateTabuladorViatico',

  setup(){
    const $q = useQuasar()
    const store = useStore()
    const capturaIdTipoArea = ref([])
    //Variables de guardado y edición
    const idTabulador = ref('')
    const tipoEmpleado = ref()
    const itemsTabulador = ref([])
    const sinPer30100 = ref('')
    const per30100 = ref('')
    const sinPer100 = ref('')
    const per100 = ref('')
    const sinPerBahia = ref('')
    const perBahia = ref('')
    const sinPerFuera = ref('')
    const perFuera = ref('')

    //---------------------------------------------------------------------------//
    //
    const PRegistrar = ref(false)
    const PActualizar = ref(false)
    const PEliminar = ref(false)
    const PLeer = ref(false)
    const ListaPermiso = ref([])
    const textbuscar = ref('')
    const rowstabulador = ref([])
    const idEditarArea = ref("")
    const editarArea = ref("")
    const loading = ref(true)
    const RegistroTipoTabulador = ref(false)
    const EditarTipoTabulador = ref(false)
    const VerTipoTabulador = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla

    onBeforeMount (async() =>{
         const Lista= store.getters['auth/PermisosObtenidos']
         const filtro = Lista.find(elemento => elemento.nombre === "TabuladorViaticos")
         ListaPermiso.value= filtro
         console.log("Este es el listado de los permisos de este modulo", ListaPermiso.value)
         const {registrar,actualizar,eliminar,leer} = ListaPermiso.value
         PRegistrar.value = registrar
         PActualizar.value = actualizar
         PEliminar.value = eliminar
         PLeer.value = leer
         console.log("Este es el registro",registrar)
    })

    const getAreas = async () => {
      loading.value = true
      const res = await api.get('/TabuladoresViaticos',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
              "id":reg.id,
              "tipo_Empleado":reg.tipo_Empleado,
                      };
            rowstabulador.value.push(obj)
        })
      loading.value = false
    }
    getAreas()

    const RegistrarTabulador = async() =>{
      limpiarRegistro()
      RegistroTipoTabulador.value = true
      itemsTabulador.value =[]
      const respuesta = await api.get('/TiposEmpleados/GetLista',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsTabulador.value.push({
            label: item.text,
            value: item.value
          });
        })
    }

    const EditarTabuladorMetodo = async(id) =>{
      EditarTipoTabulador.value = true
      itemsTabulador.value =[]
      const respuesta = await api.get('/TiposEmpleados',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let datos = respuesta.data.data;
        datos.forEach((item)=>{
          itemsTabulador.value.push({
            label: item.tipo,
            value: item.id
          });
        })

      const res = await api.get('/TabuladoresViaticos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        idTabulador.value = data.id
        sinPer30100.value = data.sin_Pernoctar_30_100
        per30100.value = data.pernoctado_30_100
        sinPer100.value = data.sin_Pernoctar_100
        per100.value = data.pernoctado_100
        sinPerBahia.value = data.sin_Pernoctar_BDB
        perBahia.value = data.pernoctadd_BDB
        sinPerFuera.value = data.sin_Pernoctar_FDE
        perFuera.value = data.pernoctado_FDE
        const filtro1 = itemsTabulador.value
        const { label} = filtro1.find(elemento => elemento.value === data.tipo_Empleado_Id)
        tipoEmpleado.value = label
    }

      const VerTabulador = async(id) =>{
      VerTipoTabulador.value = true
      itemsTabulador.value =[]
      const respuesta = await api.get('/TiposEmpleados',{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let datos = respuesta.data.data;
        datos.forEach((item)=>{
          itemsTabulador.value.push({
            label: item.tipo,
            value: item.id
          });
        })

      const res = await api.get('/TabuladoresViaticos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
        let {data} = res.data
        idTabulador.value = data.id
        sinPer30100.value = data.sin_Pernoctar_30_100
        per30100.value = data.pernoctado_30_100
        sinPer100.value = data.sin_Pernoctar_100
        per100.value = data.pernoctado_100
        sinPerBahia.value = data.sin_Pernoctar_BDB
        perBahia.value = data.pernoctadd_BDB
        sinPerFuera.value = data.sin_Pernoctar_FDE
        perFuera.value = data.pernoctado_FDE
        const filtro1 = itemsTabulador.value
        const { label} = filtro1.find(elemento => elemento.value === data.tipo_Empleado_Id)
        tipoEmpleado.value = label
    }

    // Este es el metodo para eliminar registro
    const DeleteTabulador = async(id) =>{
      $q.dialog({
        title: 'Eliminar registro',
        icon: 'Warning',
        ok:{
          color: 'positive',
          label: 'Aceptar'
        },
        cancel:{
          color: 'negative',
          label: 'Cancelar'
        },
        message: '¿Esta seguro de eliminar este tabulador?',
        persistent: true
      }).onOk(async () => {
         $q.loading.show()
          const respuesta = await api.delete('/TabuladoresViaticos/'+id,{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowstabulador.value = [  ]
              getAreas()
              loading.value = false
              RegistroTipoTabulador.value = false
               $q.loading.hide()

            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
               $q.loading.hide()
            }
      })
    }

    //Este es el metodo para editar registr

    const limpiarRegistro = async() =>{
      idTabulador.value = ""
      sinPer30100.value=""
      per30100.value=""
      sinPer100.value=""
      per100.value=""
      sinPerBahia.value=""
      perBahia.value=""
      sinPerFuera.value=""
      perFuera.value=""
      tipoEmpleado.value =""
    }


    return{
       // Variables de guardado y edición
       sinPer30100,
       per30100,
       sinPer100,
       per100,
       sinPerBahia,
       perBahia,
       sinPerFuera,
       perFuera,
       idTabulador,
       tipoEmpleado,
       itemsTabulador,
       textbuscar,
       columnstabulador,
       rowstabulador,
       RegistroTipoTabulador,
       EditarTipoTabulador,
       VerTabulador,
       RegistrarTabulador,
       DeleteTabulador,
       pagination,
       loading,
       limpiarRegistro,
       EditarTabuladorMetodo,
       VerTipoTabulador,
       PRegistrar,
        PActualizar,
        PEliminar,
        PLeer,
        ListaPermiso,

      //MEtodo submit para guardar registro
       onSubmit(){
          $q.loading.show()
          const{value} = tipoEmpleado.value
          console.log(value)
          const respuesta = api.post("/TabuladoresViaticos",{
             tipo_Empleado_Id: value,
                   sin_Pernoctar_30_100: sinPer30100.value,
                   pernoctado_30_100: per30100.value,
                   sin_Pernoctar_100: sinPer100.value,
                   pernoctado_100: per100.value,
                   sin_Pernoctar_BDB: sinPerBahia.value,
                   pernoctadd_BDB: perBahia.value,
                   sin_Pernoctar_FDE: sinPerFuera.value,
                   pernoctado_FDE: perFuera.value,
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            console.log(respuesta)
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){

                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                rowstabulador.value = [  ]
                getAreas()
                loading.value = false
                RegistroTipoTabulador.value = false
                limpiarRegistro()
              $q.loading.hide()

            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
             $q.loading.hide()
            }

       },


      //Metodo edit para editar los registros
        onEdit(){
          $q.loading.show()

          const idT = idTabulador.value;
          const respuesta = api.put("/TabuladoresViaticos/"+idT,{
            tipo_Empleado_Id: 0,
            sin_Pernoctar_30_100: sinPer30100.value,
            pernoctado_30_100: per30100.value,
            sin_Pernoctar_100: sinPer100.value,
            pernoctado_100: per100.value,
            sin_Pernoctar_BDB: sinPerBahia.value,
            pernoctadd_BDB: perBahia.value,
            sin_Pernoctar_FDE: sinPerFuera.value,
            pernoctado_FDE: perFuera.value,
          },{headers:{'Authorization': 'Bearer'+' '+ $q.localStorage.getItem("token")}})
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })
              loading.value = true
              rowstabulador.value = [  ]
              getAreas()
              loading.value = false
              EditarTipoTabulador.value = false
              limpiarRegistro()
             $q.loading.hide()
            }else{
              $q.notify({
                type: 'negative',
                message: data,
                position: 'top-right',
                progress: true
              })
               $q.loading.hide()
            }

          },

       exportTable () {
          const content = [columnstabulador.map(col => wrapCsvValue(col.label))].concat(
          rowstabulador.value.map(row => columnstabulador.map(col => wrapCsvValue(
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
