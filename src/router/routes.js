
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
     // { path: '', component: () => import('pages/Index.vue') },
     // { path: 'Componentes', name:'botones', component: () => import('pages/Components/Botones.vue') },
     // { path: 'Colores',name:'colores', component: () => import('pages/Components/Colores.vue') },
      { path: '', name:'CatalogosTipos',component: () => import('src/pages/Principal/CatalogosTipos.vue') },
      { path: '', name:'TemplateTipoArea',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoArea.vue') },
      { path: '', name:'TemplateTipoEmpleado',component: () => import('src/pages/Components/CatalogosTipos/TemplateTipoEmpleado.vue') },

     // { path: '', name:'ejemplo2', component: () => import('pages/Ejemplo2.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
