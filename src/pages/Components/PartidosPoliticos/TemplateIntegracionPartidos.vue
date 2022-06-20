<template>         <!-- Aqui inicia el template con la tabla -->
  <div class="row q-pa-sm q-gutter-md">
      <div class="col-12">
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistroIntegracionMetodo()"/>
          <q-table
              title="Integración de partidos politicos"
              :rows="rowsPartidos"
              :columns="columnsPartidos"
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
              </template >
              <template v-slot:body ="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="visibility" @click="VerIntegracion(col.value)">
                    <q-tooltip>
                      Ver integracion
                    </q-tooltip>
                  </q-btn>
                  <!--
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete" @click="DeleteIntegracion(col.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarIntegracionMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>-->
                  <q-img v-else-if="col.name==='logo_Url'"
                    :src="col.value"
                    spinner-color="white"
                    style="height: 70px; max-width: 60px"
                  />
                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
      </div>
  </div>
       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroIntegracion" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de partido politico</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
            <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-select
                    filled
                    v-model="partidoId"
                    :options="itemsPartidos"
                    label="Partido Politico"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un partido politico']"
                  />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="idTipoRepresentante"
                    :options="itemsRepresentante"
                    label="Tipo de representante"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor selecciona un tipo de representante']"
                  />
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class="col">
                  <q-input
                    filled
                    v-model="nombreRepresentante"
                    label="Nombre(s)"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor escriba un nombre']"

                  />
              </div>
             <div class="col">
                  <q-input
                    filled
                    v-model="apePaterno"
                    label="Apellido Paterno"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor escriba un apellido']"
                  />
              </div>
              <div class="col">
                  <q-input
                    filled
                    v-model="apeMaterno"
                    label="Apellido Materno"

                  />
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class="col">
                  <q-input
                    filled
                    v-model="emailRepresentante"
                    label="Email del representante "
                    type="email"
                  />
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="telRepresentante"
                      label="Telefono del representante"
                      type="tel"
                    />
                </div>

            </div>
             <div class="q-gutter-sm row items-start">
              <div class="col">
                 <q-input
                  v-model="fechaInicio"
                  filled
                   type="date"
                   hint="Fecha de registro"
                    />
                </div>
                <div class="col">
                   <q-input
                      v-model="fechaFinal"
                      filled
                      type="date"
                      hint="Fecha fin del registro"
                    />
                </div>
                <div class="col"></div>
            </div>
            <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroIntegracion = false" />
              <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarIntegracion" persistent transition-show="scale" transition-hide="scale">

        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section>
              <div class="text-h6">Editar información de representante</div>
              </q-card-section>
            <q-card-section>
              <q-form
                @submit="onEdit"
                class="q-gutter-md"
            >
            <q-input v-show="false" v-model="idIntegracion" />
             <div class="q-gutter-sm row items-start">
                <div class="col">
                  <q-select
                    filled
                    v-model="partidoId"
                    :options="itemsPartidos"
                    label="Partido Politico"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor seleccione un partido politico']"
                  />
                </div>
                <div class="col">
                  <q-select
                    filled
                    v-model="idTipoRepresentante"
                    :options="itemsRepresentante"
                    label="Tipo de representante"
                     lazy-rules
                    :rules="[val => !!val || 'Por favor selecciona un tipo de representante']"
                  />
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class="col">
                  <q-input
                    filled
                    v-model="nombreRepresentante"
                    label="Nombre(s)"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor escriba un nombre']"

                  />
              </div>
             <div class="col">
                  <q-input
                    filled
                    v-model="apePaterno"
                    label="Apellido Paterno"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Por favor escriba un apellido']"
                  />
              </div>
              <div class="col">
                  <q-input
                    filled
                    v-model="apeMaterno"
                    label="Apellido Materno"

                  />
                </div>
            </div>
            <div class="q-gutter-sm row items-start">
              <div class="col">
                  <q-input
                    filled
                    v-model="emailRepresentante"
                    label="Email del representante "
                    type="email"
                  />
                </div>
                <div class="col">
                  <q-input
                      filled
                      v-model="telRepresentante"
                      label="telefono del representante"
                      type="tel"
                    />
                </div>

            </div>
             <div class="q-gutter-sm row items-start">
              <div class="col">
                 <q-input
                  v-model="fechaInicio"
                  filled
                   type="date"
                   hint="Fecha de registro"
                    />
                </div>
                <div class="col">
                   <q-input
                      v-model="fechaFinal"
                      filled
                      type="date"
                      hint="Fecha fin del registro"
                    />
                </div>
                <div class="col"></div>
            </div>
                <q-card-actions align="right">
                  <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarIntegracion = false" />
                  <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" />
                </q-card-actions>
              </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
    <q-dialog v-model="VerIntegracionByPartido" persistent transition-show="scale" transition-hide="scale">

       <q-card style="width: 900px; max-width: 80vw;">
         <div class="q-pa-md">
          <h5 class="text-center">{{Etiqueta}}</h5>
      </div>
         <q-card-section>
          <q-table
              title="Listado de integracion"
              :rows="rowsintegracion"
              :columns="columnsintegracion"
              :filter="textbuscarI"
              row-key ="id"
              color="purple-ieen"
              :loading="loadingI"
              v-model:pagination="paginationI"
              no-data-label="No se encontraron registros"
              rows-per-page-label="Registros por página"
              >
              <template v-slot:top-right>
                <q-input v-model="textbuscarI" dense label="Buscar"  class="q-pr-md">
                  <template v-slot:append>
                    <q-icon v-if="textbuscarI !== ''" name="close" @click="textbuscarI = ''" class="cursor-pointer" />
                    <q-icon v-else name="search" />
                  </template>
                </q-input>
                <q-btn flat round color="purple-ieen" icon="archive" @click="exportTable"/>
              </template >
              <template v-slot:body ="propsI">
                <q-tr :props="propsI">
                  <q-td
                    v-for="colI in propsI.cols"
                    :key="colI.name"
                    :props="propsI"
                  >


                  <q-btn v-if="colI.name==='idRepre'" flat round color="purple-ieen" icon="delete" @click="DeleteIntegracion(colI.value)">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="colI.name==='idRepre'" flat round color="purple-ieen" icon="edit" @click="EditarIntegracionMetodo(colI.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>
                  <label v-else>{{colI.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>
         </q-card-section>
          <q-card-actions align="right">
           <q-btn label="Cerrar" type="reset" color="negative"   @click="VerIntegracionByPartido = false" />
          </q-card-actions>
       </q-card>
    </q-dialog>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { exportFile, useQuasar, date} from 'quasar'
import {api} from '../../../boot/axios.js'


const columnsPartidos = [
                { name: 'nombre', align: 'center', label: 'Nombre del partido', field: 'nombre', sortable: true, },
                { name: 'siglas', align: 'center', label: 'Siglas del partido', field: 'siglas', sortable: true, },
                { name: 'logo_Url', align: 'center', label: 'Logo del partido', field: 'logo_Url', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },


            ]
const columnsintegracion=[
                { name: 'nombreRepre', align: 'center', label: 'Nombre del Representante', field: 'nombreRepre', sortable: true, },
                { name: 'tipoRepre', align: 'center', label: 'Tipo de Representante', field: 'tipoRepre', sortable: true, },
                { name: 'idRepre', align: 'center', label: 'Opciones', field: 'idRepre' },


                  ]


export default defineComponent({
  name: 'TemplateIntegracionPartidos',

  setup(){

    const $q = useQuasar()
    const partidoId = ref()

    const VerIntegracionByPartido = ref (false)
    const idTipoRepresentante = ref()
    const nombreRepresentante = ref('')
    const apePaterno = ref('')
    const apeMaterno = ref('')
    const emailRepresentante = ref('')
    const telRepresentante = ref('')
    const fotoRepresentante = ref('')
    const fechaInicio = ref('')
    const fechaFinal= ref('')
    const itemsPartidos = ref([])
    const itemsRepresentante = ref([])
    const textbuscar = ref('')
    const textbuscarI = ref('')
    const rowsPartidos = ref([])
    const rowsintegracion = ref([])
    const idIntegracion = ref("")
    const loading = ref(true)
    let Etiqueta = ref("")
    const RegistroIntegracion = ref(false)
    const EditarIntegracion = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/Partidos').then(res => {
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "nombre":reg.nombre,
                        "siglas": reg.siglas,
                        "logo_Url": reg.logo_Url
                      };
            rowsPartidos.value.push(obj)
        })
      })
      loading.value = false
    }


    getAreas()

    const Integracion = function(id){
      const getIntegracion = async () => {
        api.get('/IntegracionPartidos/ByPartido/'+id).then(res => {
          let {data} = res.data
          data.forEach(reg => {
              let obj = {
                          "idRepre":reg.id,
                          "nombreRepre":reg.nombres + ' ' + reg.apellido_Paterno + ' ' + reg.apellido_Materno,
                          "tipoRepre": reg.tipo_Representante,

                        };
              rowsintegracion.value.push(obj)
          })
        })
    }
    getIntegracion()
    }

    const RegistroIntegracionMetodo = function(){
      RegistroIntegracion.value = true
      limpiarRegistro()
      itemsPartidos.value = []
      itemsRepresentante.value = []
      api.get('/Partidos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsPartidos.value.push({
            label: item.siglas + "-" +item.nombre,
            value: item.id
          });
        })
      });
      api.get('/TiposRepresentantes').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsRepresentante.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });

    }

    // Este es el metodo para eliminar registro
    const DeleteIntegracion = function(id){
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
        message: '¿Esta seguro de eliminar este elemento de la integración?',
        persistent: true
      }).onOk(() => {
         $q.loading.show()
          api.get('/IntegracionPartidos/'+id).then(function(res) {
                let {data} = res.data
                partidoId.value = data.partido_Id
              })
          api.delete('/IntegracionPartidos/'+id).then(function (respuesta){
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowsintegracion.value = [  ]
              Integracion(partidoId.value)
              loading.value = false
              RegistroIntegracion.value = false
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
      })
    }

    //Este es el metodo para editar registro
    const EditarIntegracionMetodo = function(id){
      EditarIntegracion.value = true;
      itemsPartidos.value =[]
      itemsRepresentante.value = []
      api.get('/Partidos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsPartidos.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/TiposRepresentantes').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemsRepresentante.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });
      api.get('/IntegracionPartidos/'+id).then(function(res) {
        let {data} = res.data
      idIntegracion.value = data.id
      nombreRepresentante.value = data.nombres
      apePaterno.value = data.apellido_Paterno
      apeMaterno.value = data.apellido_Materno
      fechaInicio.value = date.formatDate(data.fecha_Inicio,'YYYY-DD-MM')
      fechaFinal.value = date.formatDate(data.fecha_Fin,'YYYY-DD-MM')
      emailRepresentante.value = data.email
      telRepresentante.value = data.telefono_1
       const filtro1 = itemsPartidos.value
            let itemp = filtro1.find(elemento => elemento.value === data.partido_Id)
            partidoId.value= itemp
         const filtro2 = itemsRepresentante.value
            let fil2 = filtro2.find(elemento => elemento.value === data.tipo_Representante_Id)
            idTipoRepresentante.value = fil2
      })
    }
    const VerIntegracion = function(id){

        rowsintegracion.value = []
         api.get('/Partidos/'+id).then(function(res) {
        let {data} = res.data
          Etiqueta.value = data.nombre
         })
         Integracion(id)
       VerIntegracionByPartido.value = true;


    }
    const limpiarRegistro = function(){
      idIntegracion.value = ""
      partidoId.value = ""
      idTipoRepresentante.value = ""
      nombreRepresentante.value = ""
      apePaterno.value = ""
      apeMaterno.value = ""
      emailRepresentante.value = ""
      telRepresentante.value = ""
      fotoRepresentante.value = ""
      fechaInicio.value = ""
      fechaFinal.value = ""
      itemsPartidos.value = ""
      itemsRepresentante.value = ""

    }
    return{

       textbuscar,
       textbuscarI,
      partidoId,
      idTipoRepresentante,
      nombreRepresentante,
      apePaterno,
      apeMaterno,
      emailRepresentante,
      telRepresentante,
      fotoRepresentante,
      fechaInicio,
      fechaFinal,
      itemsPartidos,
      itemsRepresentante,
      idIntegracion,
      columnsintegracion,
      columnsPartidos,
      RegistroIntegracionMetodo,
      rowsPartidos,
      rowsintegracion,
       RegistroIntegracion,
       EditarIntegracion,
       EditarIntegracionMetodo,
       DeleteIntegracion,
       pagination,
       loading,
       VerIntegracionByPartido,
       VerIntegracion,
       Etiqueta,



       onSubmit(){

          $q.loading.show()
          let partido = partidoId.value
          let tipoReprenante = idTipoRepresentante.value
          api.post("/IntegracionPartidos",{
            partido_Id:partido.value,
            tipo_Representante_Id: tipoReprenante.value,
            nombres: nombreRepresentante.value,
            apellido_Paterno: apePaterno.value,
            apellido_Materno:apeMaterno.value,
            email: emailRepresentante.value,
            telefono_1: telRepresentante.value,
            fecha_Inicio: fechaInicio.value,
            fecha_Fin: fechaFinal.value,
          }).then(function (respuesta){
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){

                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                loading.value = false
                RegistroIntegracion.value = false
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
          })
       },

      //Metodo edit para editar los registros
        onEdit(){
          $q.loading.show()
          let partido = partidoId.value
          let tipoReprenante = idTipoRepresentante.value

          const idT = idIntegracion.value;
          api.put("/IntegracionPartidos/"+idT,{
             partido_Id:partido.value,
            tipo_Representante_Id: tipoReprenante.value,
            nombres: nombreRepresentante.value,
            apellido_Paterno: apePaterno.value,
            apellido_Materno:apeMaterno.value,
            email: emailRepresentante.value,
            telefono_1: telRepresentante.value,
            fecha_Inicio: fechaInicio.value,
            fecha_Fin: fechaFinal.value,

          }).then(function (respuesta){
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })
              loading.value = true
              rowsintegracion.value = [  ]
              Integracion(partido.value)
              loading.value = false
              EditarIntegracion.value = false
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
          })
          },

       exportTable () {
          const content = [columnsintegracion.map(col => wrapCsvValue(col.label))].concat(
          rowsintegracion.value.map(row => columnsintegracion.map(col => wrapCsvValue(
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
