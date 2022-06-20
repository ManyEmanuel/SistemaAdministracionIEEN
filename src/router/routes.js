
const routes = [
  {
    path: '/',
    name: "",
    component: () => import('layouts/MainLayout.vue'),
    children: [
     // { path: '', component: () => import('pages/Index.vue') },
     // { path: 'Componentes', name:'botones', component: () => import('pages/Components/Botones.vue') },
      { path: '', name:'PageIndex',component: () => import('src/pages/Index.vue') },
     // { Catalogos de tipos
      { path: '', name:'CatalogosTipos',component: () => import('src/pages/Principal/CatalogosTipos.vue') },
      //{ path: '', name:'TemplateTipoArea',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoArea.vue') },
      //{ path: '', name:'TemplateTipoEmpleado',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoEmpleado.vue') },
      //{ path: '', name:'TemplateTipoMovimiento',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoMovimiento.vue') },
      //{ path: '', name:'TemplateTipoRepresentante',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoRepresentante.vue') },

    // Catalogos Principales
    { path: '', name:'CatalogosPrincipal',component: () => import('src/pages/Principal/CatalogosPrincipal.vue') },
    //{ path: '', name:'TemplateArea',component: () => import('src/pages/Components/CatalogosPrincipal/TemplateArea.vue') },
    //{ path: '', name:'TemplatePuestos',component: () => import('src/pages/Components/CatalogosPrincipal/TemplatePuestos.vue') },
    //{ path: '', name:'TemplateRequisitos',component: () => import('src/pages/Components/CatalogosPrincipal/TemplateRequisitos.vue') },
    //{ path: '', name:'TemplateTratamiento',component: () => import('src/pages/Components/CatalogosPrincipal/TemplateTratamiento.vue') },
    //{ path: '', name:'TemplateTabuladorViatico',component: () => import('src/pages/Components/CatalogosPrincipal/TemplateTabuladorViatico.vue') },

    // Catalogos Partidos Politicos
    //{ path:'', name:'PartidosPoliticos',component: () => import('src/pages/Principal/PartidosPoliticos.vue') },
    //{ path:'', name:'TemplatePartidos,', component:() => import('src/pages/Components/PartidosPoliticos/TemplatePartidos.vue')},
    //{ path:'', name:'TemplateIntegracionPartidos,', component:() => import('src/pages/Components/PartidosPoliticos/TemplateIntegracionPartidos.vue')},

    //Empleados
    { path:'', name:'Empleados', component:() => import('src/pages/Principal/Empleados.vue')},
    //{ path:'', name:'TemplateEmpleados', component:() => import('src/pages/Components/Empleados/TemplateEmpleados.vue')},
    //{ path:'', name:'TemplateResponsables', component:() => import('src/pages/Components/Empleados/TemplateResponsables.vue')},
    //{ path:'', name:'TemplateContratos', component:() => import('src/pages/Components/Empleados/TemplateContratos.vue')},
    // { path: '', name:'ejemplo2', component: () => import('pages/Ejemplo2.vue') }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
