<template>
          <!-- Aqui inicia el template con la tabla -->
        <q-btn class="q-ma-sm" color="purple-ieen" icon-right="add_circle_outline" label="Agregar nuevo" @click="RegistrarEmpleado(), limpiarRegistro()"/>
         <q-table
              title="Registro de empleados"
              :rows="rowscontratos"
              :columns="columnscontratos"
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
              <template v-slot:body ="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="delete">
                    <q-tooltip>
                      Borrar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="col.name==='id'" flat round color="purple-ieen" icon="edit" @click="EditarRequisitoMetodo(col.value)">
                    <q-tooltip>
                      editar registro
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-else-if="col.name==='documento'" :href="(col.value)" target="_blank" flat round color="purple-ieen" icon="delete">
                      <q-tooltip>
                       ver documento
                    </q-tooltip>
                  </q-btn>
                  <label v-else-if="col.name === 'activo' && col.value ===true"> Activo</label>
                  <label v-else-if="col.name === 'activo' && col.value ===false"> Baja</label>

                  <label v-else>{{col.value}}</label>
                  </q-td>
                </q-tr>
              </template>
          </q-table>

       <!-- Dialog para el registro de  tipo de area -->
    <q-dialog v-model="RegistroEmpleado" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Registro de empleado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-sm"
            >
             <div class="q-pa-md">
              <q-stepper
                v-model="step"
                header-nav
                ref="stepper"
                color="purple-ieen"
                animated
              >
                <q-step
                  :name="1"
                  title="Datos personales"
                  icon="settings_accessibility"
                  :done=" step > 1"
                >
                  <div class="q-gutter-sm row items-start">
                      <div class="col">
                        <q-input
                          filled
                          v-model="nombresEmpleado"
                          label="Nombre del empleado"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del empleado']"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoPaterno"
                            label="Apellido paterno"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el apellido paterno']"
                          />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoMaterno"
                            label="Apellido materno"
                          />
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-input
                        v-model="fechaNacimiento"
                        filled
                        type="date"
                        hint="Fecha de nacimiento"
                          />
                      </div>
                      <div class="col">
                        <label>Sexo del empleado</label>
                        <div class="q-gutter-xl">
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="M" label="Mujer" color="purple-ieen-1" />
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="H" label="Hombre" color="purple-ieen-1"/>

                        </div>

                      </div>
                      <div class="col">
                        <q-file
                          filled
                            v-model="fotoEmpleado"
                            label="Foto del empleado"
                            accept=".jpg, image/*"
                            @rejected="onRejected"
                            @change="pruebaImagen"
                          >
                          <template v-slot:append>
                            <q-icon name="add_photo_alternate" />
                          </template>
                        </q-file>
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="curpEmpleado"
                          label="Curp del empleado"
                          lazy-rules
                          :rules="[ val => val && val.length > 17 || 'Por favor ingresa la curp']"
                          maxlength="18"
                          counter
                          onkeyup="javascript:this.value=this.value.toUpperCase()"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="rfcEmpleado"
                            label="RFC del Empleado"
                            lazy-rules
                            :rules="[ val => val && val.length > 12 || 'Por favor ingresa el RFC']"
                            maxlength="13"
                            counter
                            onkeyup="javascript:this.value=this.value.toUpperCase()"
                          />
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="emailEmpleado"
                          label="Email del empleado"
                          type="email"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="telefonoEmpleado"
                            label="Telefono del empleado"
                            type="tel"
                          />
                      </div>
                      <div class="col">
                        <q-checkbox
                          v-model="activoEmpleado"
                          label="Activar empleado"
                          color="purple-ieen"

                        />
                      </div>
                  </div>
                  <q-stepper-navigation align="right">
                    <q-btn @click="() => { ventana1 = true; step = 2 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>


                <q-step
                  :name="2"
                  title="Datos del puesto"
                  icon="work"
                  :done="step > 2"
                >
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select
                        filled
                        v-model="idTipoEmpleado"
                        :options="itemTipoEmp"
                        label="Tipo de empleado"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un tipo de empleado']"

                      />
                    </div>
                    <div class="col">
                      <q-select
                        filled
                        v-model="idTratamiento"
                        :options="itemTratamiento"
                        label="Tratamiento de empleado"
                        @filter="filtroSelect"


                      />
                    </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select
                        filled
                        v-model="idArea"
                        :options="itemArea"
                        label="Área del empleado"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un área']"

                      />
                    </div>
                    <div class="col">
                      <q-select
                        filled
                        v-model="idPuesto"
                        :options="itemPuesto"
                        label="Puesto a desarrollar"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un puesto']"

                      />
                    </div>
                  </div>
                  <q-stepper-navigation align="right" class="q-gutter-sm ">
                    <q-btn @click="step = 1" color="negative" label="Atras" class="q-ml-sm" />
                    <q-btn @click="() => { ventana2 = true; step = 3 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="3"
                  title="Documentos Entregados"
                  icon="checklist"
                  :done="ventana3"
                >
                  <div  class="q-gutter-sm q-gutter-y-sm row items-start" v-for=" item in itemRequisito" :key="item.value">
                    <div class="col q-pa-sm">
                      <q-file
                        filled
                          v-model="nameModelo[item.index]"
                          :label="item.label"
                          accept=".jpg,.pdf, image/*"
                          @rejected="onRejected"

                      >
                          <template v-slot:append>
                            <q-icon name="post_add" />
                          </template>
                      </q-file>
                    </div>
                    <div class="col"></div>


                  </div>
                <q-stepper-navigation align="right" class="q-gutter-sm ">
                    <q-btn  @click="step = 2" color="negative" label="Atras" class="q-ml-sm" />
                     <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" @click="step = 1"/>
                  </q-stepper-navigation>
                </q-step>
              </q-stepper>
            </div>
          </q-form>
        </q-card-section>
         <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="RegistroEmpleado = false, step = 1" />
          </q-card-actions>
      </q-card>
    </q-dialog>

       <!-- Dilog pata la edición del tipo de area -->
    <q-dialog v-model="EditarRequisito" persistent transition-show="scale" transition-hide="scale">
        <q-card style="width: 1200px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Editar información de empleado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onEdit"
            class="q-gutter-sm"
            >
            <q-input v-show="false" v-model="idEmpleado" />
             <div class="q-pa-md">
              <q-stepper
                v-model="step"
                header-nav
                ref="stepper"
                color="purple-ieen"
                animated
              >
                <q-step
                  :name="1"
                  title="Datos personales"
                  icon="settings_accessibility"
                  :done=" step > 1"
                >
                  <div class="q-gutter-sm row items-start">
                      <div class="col">
                        <q-input
                          filled
                          v-model="nombresEmpleado"
                          label="Nombre del empleado"
                          lazy-rules
                          :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre del empleado']"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoPaterno"
                            label="Apellido paterno"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Por favor ingresa el apellido paterno']"
                          />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="apellidoMaterno"
                            label="Apellido materno"
                          />
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-input
                        v-model="fechaNacimiento"
                        filled
                        type="date"
                        hint="Fecha de nacimiento"
                          />
                      </div>
                      <div class="col">
                        <label>Sexo del empleado</label>
                        <div class="q-gutter-xl">
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="M" label="Mujer" color="purple-ieen-1" />
                          <q-radio v-model="sexoEmpleado" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="H" label="Hombre" color="purple-ieen-1"/>

                        </div>

                      </div>
                      <div class="col">
                        <q-file
                          filled
                            v-model="fotoEmpleado"
                            label="Cambiar foto del empleado"
                            accept=".jpg, image/*"
                            @rejected="onRejected"
                          >
                          <template v-slot:append>
                            <q-icon name="add_photo_alternate" />
                          </template>
                        </q-file>

                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="curpEmpleado"
                          label="Curp del empleado"
                          lazy-rules
                          @input="v => { curpEmpleado = v.toUpperCase() }"
                          :rules="[ val => val && val.length > 17 || 'Por favor ingresa la curp']"
                          maxlength="18"
                          counter
                          onkeyup="javascript:this.value=this.value.toUpperCase()"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="rfcEmpleado"
                            label="RFC del Empleado"
                            @input="v => { rfcEmpleado = v.toUpperCase() }"
                            lazy-rules
                            :rules="[ val => val && val.length > 12 || 'Por favor ingresa el RFC']"
                            maxlength="13"
                            counter
                            onkeyup="javascript:this.value=this.value.toUpperCase()"
                          />
                      </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                   <div class="col">
                        <q-input
                          filled
                          v-model="emailEmpleado"
                          label="Email del empleado"
                          type="email"
                        />
                      </div>
                      <div class="col">
                        <q-input
                            filled
                            v-model="telefonoEmpleado"
                            label="Telefono del empleado"
                            type="tel"
                          />
                      </div>
                      <div class="col">
                        <q-checkbox
                          v-model="activoEmpleado"
                          label="Activar empleado"
                          color="purple-ieen"

                        />
                      </div>
                  </div>
                  <q-stepper-navigation align="right">
                    <q-btn @click="() => { ventana1 = true; step = 2 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>


                <q-step
                  :name="2"
                  title="Datos del puesto"
                  icon="work"
                  :done="step > 2"
                >
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select
                        filled
                        v-model="idTipoEmpleado"
                        :options="itemTipoEmp"
                        label="Tipo de empleado"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un tipo de empleado']"

                      />
                    </div>
                    <div class="col">
                      <q-select
                        filled
                        v-model="idTratamiento"
                        :options="itemTratamiento"
                        label="Tratamiento de empleado"
                        @filter="filtroSelect"


                      />
                    </div>
                  </div>
                  <div class="q-gutter-sm row items-start">
                    <div class="col">
                      <q-select
                        filled
                        v-model="idArea"
                        :options="itemArea"
                        label="Área del empleado"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un área']"

                      />
                    </div>
                    <div class="col">
                      <q-select
                        filled
                        v-model="idPuesto"
                        :options="itemPuesto"
                        label="Puesto a desarrollar"
                        @filter="filtroSelect"
                        lazy-rules
                        :rules="[val => !!val || 'Por favor selecciona un puesto']"

                      />
                    </div>
                  </div>
                  <q-stepper-navigation align="right" class="q-gutter-sm ">
                    <q-btn @click="step = 1" color="negative" label="Atras" class="q-ml-sm" />
                    <q-btn @click="() => { ventana2 = true; step = 3 }" color="positive" label="Siguiente" />
                  </q-stepper-navigation>
                </q-step>
                <q-step
                  :name="3"
                  title="Documentos faltantes a entregar"
                  icon="checklist"
                  :done="ventana3"
                >
                  <div  class="q-gutter-sm q-gutter-y-sm row items-start" v-for=" item in itemRequisito" :key="item.value">
                    <div class="col q-pa-sm">
                      <q-file
                        filled
                          v-model="nameModelo[item.index]"
                          :label="item.label"
                          accept=".jpg,.pdf, image/*"
                          @rejected="onRejected"
                      >
                          <template v-slot:append>
                            <q-icon name="post_add" />
                          </template>
                          <template v-slot:after>
                             <q-badge v-if="item.status === 1" align="middle" color="positive">Entregado</q-badge>
                             <q-badge v-else align="middle" color="negative">Pendiente</q-badge>
                          </template>

                      </q-file>

                    </div>
                    <div class="col"></div>


                  </div>
                <q-stepper-navigation align="right" class="q-gutter-sm ">
                    <q-btn  @click="step = 2" color="negative" label="Atras" class="q-ml-sm" />
                     <q-btn label="Guardar" type="submit" color="positive" class="q-ml-sm" @click="step = 1"/>
                  </q-stepper-navigation>
                </q-step>
              </q-stepper>
            </div>
          </q-form>
        </q-card-section>
         <q-card-actions align="right">
              <q-btn label="Cancelar" type="reset" color="negative"   @click="EditarRequisito = false, step = 1" />
          </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script>
import { defineComponent,ref } from 'vue';
import { date, exportFile, useQuasar} from 'quasar'
import {api} from '../../../boot/axios.js'
import { useStore } from 'vuex';


const columnscontratos = [

                { name: 'empleado', align: 'center', label: 'Nombre del Empleado', field: 'empleado', sortable: true, },
                { name: 'fecha', align: 'center', label: 'Fecha inicio del Contrato', field: 'fecha', sortable: true, },
                { name: 'documento', align: 'center', label: 'Documento del Contrato', field: 'documento', sortable: true, },
                { name: 'idEmpleado', align: 'center', field: 'idEmpleado', sortable: true, },
                { name: 'id', align: 'center', label: 'Opciones', field: 'id' },

            ]


export default defineComponent({
  name: 'TemplateContratos',

  setup(){
    const $q = useQuasar()
    const store = useStore()
    //Variables de guardado y edición

    const idEmpleado = ref()
    const idArea = ref()
    const idPuesto = ref()
    const idTratamiento = ref()
    const idTipoEmpleado = ref()
    const nombresEmpleado = ref('')
    const apellidoPaterno = ref('')
    const apellidoMaterno = ref('')
    const fotoEmpleado = ref()
    const emailEmpleado = ref('')
    const fechaNacimiento = ref()
    const rfcEmpleado = ref('')
    const curpEmpleado = ref('')
    const telefonoEmpleado = ref()
    const sexoEmpleado = ref()
    const activoEmpleado = ref(false)
    //---------------------------------------------------------------------------//
    //
    const step = ref(1)
    const ventana1 = ref(false)
    const ventana2 = ref(false)
    const ventana3 = ref(false)
    const textbuscar = ref('')
    const rowscontratos = ref([])
    const nameModelo = ref([])
    const itemTipoEmp = ref([])
    const itemTratamiento = ref([])
    const itemArea = ref([])
    const itemPuesto = ref([])
    const itemRequisito = ref([])
    const idEditarArea = ref("")
    const editarArea = ref("")
    const loading = ref(true)
    const RegistroEmpleado = ref(false)
    const EditarRequisito = ref(false)
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        sortBy: 'name',
        descending: false,
        }
    )
    // Este es el metodo para listar en tabla
    const getAreas = async () => {
      api.get('/Contratos').then(res => {
        let {data} = res.data
        data.forEach(reg => {
            let obj = {
                        "id":reg.id,
                        "empleado":reg.empleado,
                        "fecha": reg.fecha_Inicio,
                        "documento": reg.documento_URL,
                        "idEmpleado": reg.empleado_Id,
                      };
            rowscontratos.value.push(obj)
        })
      })
      loading.value = false
    }
    getAreas()

    const EditarRequisitoMetodo = function(id){
      EditarRequisito.value = true
      itemArea.value =[]
      itemTipoEmp.value=[]
      itemPuesto.value=[]
      itemTratamiento.value=[]
      itemRequisito.value=[]
      nameModelo.value=[]
      api.get('/Areas').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemArea.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/TiposEmpleados').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTipoEmp.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });
      api.get('/Puestos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemPuesto.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/Tratamientos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTratamiento.value.push({
            label: item.titulo,
            value: item.id
          });
        })
      });
      var Entregados = ([]);
      api.get('/DocumentosEmpleados/ByEmpleado/'+id).then(function(respuesta){
        let {data} = respuesta.data;
          data.forEach((item)=>{
             Entregados.push({
            value: item.requisito_Id,
            id: item.id,
          });
          })
        });
      console.log(Entregados)
      api.get('/DocumentosRequeridos').then(function(respuesta){
        let{data} = respuesta.data;
        var index = 0;
        data.forEach((item)=>{
          var conteo = Entregados.find(elemento => elemento.value === item.id)
          if(conteo === undefined){
            itemRequisito.value.push({
              label: item.nombre,
              value: item.id,
              index: index,
              status: 0,
            });
            let fracc = item.nombre.split(' ')
            nameModelo.value.push({
              value: fracc[0],
              id: 0
            });

          }
          else{
            itemRequisito.value.push({
              label: item.nombre,
              value: item.id,
              index: index,
              status: 1,
            });
            let fracc = item.nombre.split(' ')
            nameModelo.value.push({
              value: fracc[0],
              id: conteo.id
            });

          }
          index++
          console.log(nameModelo.value)
        })
      });
      api.get('/Empleados/'+id).then(function(res) {
        let {data} = res.data
          idEmpleado.value = data.id
          nombresEmpleado.value = data.nombres
          apellidoPaterno.value = data.apellido_Paterno
          apellidoMaterno.value = data.apellido_Materno
          emailEmpleado.value = data.email
          fotoEmpleado.value = data.foto_URL
          console.log(fotoEmpleado.value)
          fechaNacimiento.value= date.formatDate(data.fecha_Nacimiento,'YYYY-MM-DD')
          rfcEmpleado.value= data.rfc
          curpEmpleado.value= data.curp
          telefonoEmpleado.value= data.telefono
          sexoEmpleado.value = data.sexo
          activoEmpleado.value= data.activo
          const filtro1 = itemArea.value
          let itemp1 = filtro1.find(elemento => elemento.value === data.area_Id)
          idArea.value= itemp1
          const filtro2 = itemTipoEmp.value
          let itemp2 = filtro2.find(elemento => elemento.value === data.tipo_Empleado_Id)
          idTipoEmpleado.value = itemp2
          const filtro3 = itemPuesto.value
          let itemp3 = filtro3.find(elemento => elemento.value === data.puesto_Id)
          idPuesto.value = itemp3
          const filtro4 = itemTratamiento.value
          let itemp4 = filtro4.find(elemento => elemento.value === data.tratamiento_Id)
          idTratamiento.value = itemp4
      });
    }
    // Este es el metodo para eliminar registro
    const DeleteRequisito = function(id){
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
        message: '¿Esta seguro de eliminar este requisito?',
        persistent: true
      }).onOk(() => {
         $q.loading.show()
          api.delete('/Empleados/'+id).then(function (respuesta){
            let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
              var Entregados = ([]);
              api.get('/DocumentosEmpleados/ByEmpleado/'+id).then(function(respuesta){
                let {data} = respuesta.data;
                  data.forEach((item)=>{
                    Entregados.push({
                    value: item.id,
                  });
                  })
                });
                for(var i = 0 ; i< Entregados.length ; i++){
                  api.delete('/DocumentosEmpleados/'+Entregados[i])
                 }
              $q.notify({
                type: 'positive',
                message: data,
                position: 'top-right',
                progress: true,
              })

              loading.value = true
              rowscontratos.value = [  ]
              getAreas()
              loading.value = false
              RegistroEmpleado.value = false
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

    const limpiarRegistro = function(){
        idEmpleado.value = ""
        idArea.value=""
        idPuesto.value=""
        idTratamiento.value=""
        idTipoEmpleado.value=""
        nombresEmpleado.value=""
        apellidoPaterno.value=""
        apellidoMaterno.value=""
        fotoEmpleado.value=""
        emailEmpleado.value=""
        fechaNacimiento.value=""
        rfcEmpleado.value=""
        curpEmpleado.value=""
        telefonoEmpleado.value=""
        sexoEmpleado.value=""
        activoEmpleado.value=false
    }

     const RegistrarEmpleado = function(){
      RegistroEmpleado.value = true
      itemArea.value =[]
      itemTipoEmp.value=[]
      itemPuesto.value=[]
      itemTratamiento.value=[]
      itemRequisito.value=[]
      nameModelo.value=[]
      api.get('/Areas').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemArea.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/TiposEmpleados').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTipoEmp.value.push({
            label: item.tipo,
            value: item.id
          });
        })
      });
      api.get('/Puestos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemPuesto.value.push({
            label: item.nombre,
            value: item.id
          });
        })
      });
      api.get('/Tratamientos').then(function(respuesta){
        let{data} = respuesta.data;
        data.forEach((item)=>{
          itemTratamiento.value.push({
            label: item.titulo,
            value: item.id
          });
        })
      });
      api.get('/DocumentosRequeridos').then(function(respuesta){
        let{data} = respuesta.data;
        var index = 0;
        data.forEach((item)=>{
          itemRequisito.value.push({
            label: item.nombre,
            value: item.id,
            index: index,

          });
          let fracc = item.nombre.split(' ')
          nameModelo.value.push({
            value: fracc[0]
          });
          index++
        })

      });
      console.log(itemRequisito.value, nameModelo.value)
    }


    return{

        idEmpleado,
        idArea,
        idPuesto,
        idTratamiento,
        idTipoEmpleado,
        nombresEmpleado,
        apellidoPaterno,
        apellidoMaterno,
        fotoEmpleado,
        emailEmpleado,
        fechaNacimiento,
        rfcEmpleado,
        curpEmpleado,
        telefonoEmpleado,
        sexoEmpleado,
        activoEmpleado,
       // Variables de guardado y edición
       step,
       ventana1,
       ventana2,
       ventana3,
       textbuscar,
       nameModelo,
       itemTipoEmp,
       itemTratamiento,
       itemArea,
       itemPuesto,
       itemRequisito,
       editarArea,
       idEditarArea,
       columnscontratos,
       rowscontratos,
       RegistroEmpleado,
       RegistrarEmpleado,
       EditarRequisito,
       DeleteRequisito,
       pagination,
       loading,
       limpiarRegistro,
       EditarRequisitoMetodo,
      //MEtodo submit para guardar registro
       onSubmit(){
          $q.loading.show()
          const formData = new FormData();

          formData.append("nombres", nombresEmpleado.value)
          formData.append("apellido_Paterno", apellidoPaterno.value)
          formData.append("apellido_Materno", apellidoMaterno.value)
          formData.append("foto", fotoEmpleado.value)
          formData.append("email", emailEmpleado.value)
          formData.append("fecha_nacimiento", fechaNacimiento.value)
          formData.append("rFC",rfcEmpleado.value)
          formData.append("cURP", curpEmpleado.value)
          formData.append("telefono",telefonoEmpleado.value)
          formData.append("sexo",sexoEmpleado.value)
          formData.append("activo",activoEmpleado.value)
          formData.append("area_Id",idArea.value.value)
          formData.append("puesto_Id",idPuesto.value.value)
          formData.append("tratamiento_Id",idTratamiento.value.value)
          formData.append("tipo_Empleado_Id", idTipoEmpleado.value.value)
          api.post("/Empleados",formData,{headers:{'Content-Type': 'multipart/form-data'}}).then(function (respuesta){
            console.log(respuesta)
              let{data,success,id} = respuesta.data
            if(respuesta.status == 200 && success == true){
               var num = itemRequisito.value
                 for(var i = 0 ; i< num.length ; i++){
                  var {label, value} = num[i]
                  if(nameModelo.value[i].type != undefined){
                     const DocData = new FormData();
                    DocData.append("requisito_Id", value)
                    DocData.append("empleado_Id",id)
                    DocData.append("titulo",label)
                    DocData.append("documento",nameModelo.value[i])
                    console.log(DocData)
                      api.post("/DocumentosEmpleados",DocData,{headers:{'Content-Type':'multipart/form-data'}})
                  }
                 }
                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                rowscontratos.value = [  ]
                getAreas()
                loading.value = false
                RegistroEmpleado.value = false
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
          const idT = idEmpleado.value;
          var Entregados = ([]);
          api.get('/DocumentosEmpleados/ByEmpleado/'+idT).then(function(respuesta){
            let {data} = respuesta.data;
              data.forEach((item)=>{
                Entregados.push({
                value: item.requisito_Id,
                id: item.id,
              });
              })
            });
            console.log(Entregados)
         const formData = new FormData();
          formData.append("nombres", nombresEmpleado.value)
          formData.append("apellido_Paterno", apellidoPaterno.value)
          formData.append("apellido_Materno", apellidoMaterno.value)
          formData.append("foto", fotoEmpleado.value)
          formData.append("email", emailEmpleado.value)
          formData.append("fecha_nacimiento", fechaNacimiento.value)
          formData.append("rFC",rfcEmpleado.value)
          formData.append("cURP", curpEmpleado.value)
          formData.append("telefono",telefonoEmpleado.value)
          formData.append("sexo",sexoEmpleado.value)
          formData.append("activo",activoEmpleado.value)
          formData.append("area_Id",idArea.value.value)
          formData.append("puesto_Id",idPuesto.value.value)
          formData.append("tratamiento_Id",idTratamiento.value.value)
          formData.append("tipo_Empleado_Id", idTipoEmpleado.value.value)
          api.put("/Empleados/"+idT,formData,{headers:{'Content-Type': 'multipart/form-data'}}).then(function (respuesta){
            console.log(respuesta)
              let{data,success} = respuesta.data
            if(respuesta.status == 200 && success == true){
               var num = itemRequisito.value
                 for(var i = 0 ; i< num.length ; i++){
                  var {label, value} = num[i]
                  if(nameModelo.value[i].type != undefined){
                     const DocData = new FormData();
                    DocData.append("requisito_Id", value)
                    DocData.append("empleado_Id",idT)
                    DocData.append("titulo",label)
                    DocData.append("documento",nameModelo.value[i])
                    var conteo = Entregados.find(elemento => elemento.value === value)
                    console.log(conteo)
                     if(conteo === undefined){
                       api.post("/DocumentosEmpleados",DocData,{headers:{'Content-Type': 'multipart/form-data'}})
                       console.log("esto fue una insercion")
                     }
                     else
                     {
                       api.put("/DocumentosEmpleados/"+conteo.id,DocData,{headers:{'Content-Type': 'multipart/form-data'}})
                       console.log("Esto fue una edición")
                     }

                  }
                 }
                $q.notify({
                  type: 'positive',
                  message: data,
                  position: 'top-right',
                  progress: true,
                })
                loading.value = true
                rowscontratos.value = [  ]
                getAreas()
                loading.value = false
                EditarRequisito.value = false
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
          const content = [columnscontratos.map(col => wrapCsvValue(col.label))].concat(
          rowscontratos.value.map(row => columnscontratos.map(col => wrapCsvValue(
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
