const urlObtenerUsuarios = 'http://localhost/CRUD_MySQL_PHP_JavaScript/api/obtenerUsuarios.php'
const urlAgregarUsuario = 'http://localhost/CRUD_MySQL_PHP_JavaScript/api/agregarUsuario.php'
const urlEditarUsuario = 'http://localhost/CRUD_MySQL_PHP_JavaScript/api/editarUsuario.php'
const urlBorrarUsuario = 'http://localhost/CRUD_MySQL_PHP_JavaScript/api/borrarUsuario.php'

let listaEmpleados = []

const objEmpleado = {
    idUsuario: '',
    usuario: '',
    contrasena: '',
    email: ''
}

let editando = false

const formulario = document.querySelector('#formulario')

const usuarioInput = document.querySelector('#usuario')
const contrasenaInput = document.querySelector('#contrasena')
const emailInput = document.querySelector('#email')

formulario.addEventListener('submit', validarFormulario)

function validarFormulario(e) {
    e.preventDefault()

    if([usuarioInput.value, contrasenaInput.value, emailInput.value].includes('')) {
        alert('Todos los campos son obligatorios')
        return
    }

    if(editando) {
        editarEmpleado()
        editando = false
    } else {
        objEmpleado.idUsuario = Date.now()
        objEmpleado.usuario = usuarioInput.value
        objEmpleado.contrasena = contrasenaInput.value
        objEmpleado.email = emailInput.value

        agregarEmpleado()
    }
}

async function obtenerEmpleados() {

    listaEmpleados = await fetch(urlObtenerUsuarios)
    .then(respuesta => respuesta.json())
    .then(datos => datos)
    .catch(error => console.log(error))

    mostrarEmpleados()

}
obtenerEmpleados()

function mostrarEmpleados() {

    const divEmpleados = document.querySelector('.div-empleados')

    listaEmpleados.forEach(empleado => {
        const {idUsuario, usuario, contrasena, email} = empleado

        const parrafo = document.createElement('p')
        parrafo.textContent = `${idUsuario} - ${usuario} - ${contrasena} - ${email}`
        parrafo.dataset.id = idUsuario

        const editarBoton = document.createElement('button')
        editarBoton.onclick = () => cargarEmpleado(empleado)
        editarBoton.textContent = 'Editar'
        editarBoton.classList.add('btn', 'btn-editar')
        parrafo.append(editarBoton)

        const eliminarBoton = document.createElement('button');
        eliminarBoton.onclick = () => eliminarEmpleado(idUsuario);
        eliminarBoton.textContent = 'Eliminar';
        eliminarBoton.classList.add('btn', 'btn-eliminar');
        parrafo.append(eliminarBoton);

        const hr = document.createElement('hr')

        divEmpleados.appendChild(parrafo)
        divEmpleados.appendChild(hr)

    })

}

async function agregarEmpleado() {

    const res = await fetch(urlAgregarUsuario,
        {
            method: 'POST',
            body: JSON.stringify(objEmpleado)
        })
        .then(respuesta => respuesta.json())
        .then(data => data)
        .catch(error => alert(error))

    if(res.msg === 'OK') {
        alert('Se registro exitosamente')
        limpiarHTML()
        obtenerEmpleados()

        formulario.reset()
        limpiarObjeto()
    }
}

async function editarEmpleado() {
    
    objEmpleado.usuario = usuarioInput.value
    objEmpleado.contrasena = contrasenaInput.value
    objEmpleado.email = emailInput.value

    const res = await fetch(urlEditarUsuario,
        {
            method: 'POST',
            body: JSON.stringify(objEmpleado)
        })
        .then(respuesta => respuesta.json())
        .then(data => data)
        .catch(error => alert(error))

    if(res.msg === 'OK')  {
        alert('Se actualizó correctamente')

        limpiarHTML()
        obtenerEmpleados()
        formulario.reset()

        limpiarObjeto()
    }

    formulario.querySelector('button[type="submit"]').textContent = 'Agregar';

    editando = false

}

async function eliminarEmpleado(id) {

    const res = await fetch(urlBorrarUsuario,
        {
            method: 'POST',
            body: JSON.stringify({'idUsuario': id})
        })
        .then(respuesta => respuesta.json())
        .then(data => data)
        .catch(error => alert(error))

        if(res.msg === 'OK') {
            alert('Se borró exitosamente')

            limpiarHTML()
            obtenerEmpleados()
            limpiarObjeto()
        }

}

function cargarEmpleado(empleado) {
    const {idUsuario, usuario, contrasena, email} = empleado

    usuarioInput.value = usuario
    contrasenaInput.value = contrasena
    emailInput.value = email

    objEmpleado.idUsuario = idUsuario

    formulario.querySelector('button[type="submit"').textContent = 'Actualizar'
    editando = true
}

function limpiarHTML() {
    const divEmpleados = document.querySelector('.div-empleados');
    while(divEmpleados.firstChild) {
        divEmpleados.removeChild(divEmpleados.firstChild)
    }
}

function limpiarObjeto() {
    objEmpleado.idUsuario = ''
    objEmpleado.usuario = ''
    objEmpleado.contrasena = ''
    objEmpleado.email = ''
}