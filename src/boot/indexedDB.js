
//inicializa la indexedDB y obtiene la conexion a la tabla especificada en el parametro
const getDb = async (name) => {
  return new Promise((resolve, reject) => {

    let request = window.indexedDB.open("base", 1);

    request.onerror = e => {
      console.log('Error opening db', e);
      reject('Error');
    };

    request.onsuccess = e => {
      let db = e.target.result;
      let nuevo = true;
      for(let i = 0; i<db.objectStoreNames[0].length; i++) {
        if(db.objectStoreNames[i] === name) {
          nuevo = false
        }
      }

      resolve(e.target.result);
    };

    request.onupgradeneeded = e => {
      console.log('onupgradeneeded');
      let db = e.target.result;
      // genera las tablas de la indexedDB
      db.createObjectStore("users", { autoIncrement: true, keyPath:'id' });
      db.createObjectStore("inventario", { autoIncrement: true, keyPath:'id' });
      db.createObjectStore("asignaciones", { autoIncrement: true, keyPath:'id' });
      db.createObjectStore("historial", { autoIncrement: true, keyPath:'id' });
      db.createObjectStore("solicitudes", { autoIncrement: true, keyPath:'id' });
      db.createObjectStore("pendientes", { autoIncrement: true, keyPath:'id' });

    };
  });
}

//guarda un objeto en la tabla especificada en el parametro
const addTo = async ( name, data) =>{
  let db = await getDb(name);
  let tx = db.transaction(name, 'readwrite');
  let store = tx.objectStore(name);

  store.add(data);
}

//limpia la tabla especificada en el parametro
const clearStorage = async (name) => {
  let db = await getDb(name);
  let tx = db.transaction(name, 'readwrite');
  let store = tx.objectStore(name);
  store.clear();
}

/*
* Guarda una peticion en lista de espera cuando no hay conexion a internet,
* es necesaria la ruta de la peticion para poder reenviarla cuando se vuelva a conectar,
* la informacion del body de la peticion que se quiere reenviar,
* un mensaje de error que se muestra en caso de que no se pueda reenviar la peticion,
* un mensaje de exito que se muestra en caso de que se pueda reenviar la peticion,
* el tipo de peticion que se quiere reenviar
*/
const sendToWaitList = async ( route, data, errorMessage, successMessage, type ) =>{
  let db = await getDb('pendientes');
  let tx = db.transaction('pendientes', 'readwrite');
  let store = tx.objectStore('pendientes');

  store.add({
    route: route,
    data: data,
    errorMessage: errorMessage,
    successMessage: successMessage,
    type: type
  });
}

//obtiene la lista de peticiones en la tabla especificada en el parametro
const getDataDB = async (name) =>{
  let data = []

  await new Promise(async (resolve, reject)=>{
    let dbUsers = await getDb(name)

    let trans = dbUsers.transaction([name], 'readwrite')
    let store = trans.objectStore(name);



    store.openCursor().onsuccess = e => {
      let cursor = e.target.result;
      if (cursor) {
        data.push(cursor.value)
        cursor.continue();
      }else{
        resolve("success")
      }
    };
  })

  return data;
}

export { getDb, addTo, sendToWaitList, getDataDB, clearStorage };
