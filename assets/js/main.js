//funciones del template  (solo funcionares para diseno)
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }


  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})();


//funciones email JS (envio de correo por formulario contacto)


function EnviarCorreoEmailJs(event){
  try {

    emailjs.init("dVIY356ISQakdjGlc");
    event.preventDefault();


     // Envía el formulario
     emailjs.sendForm('service_vyjwvfe', 'template_rakxnvn', this)
     .then(function(response) {
         console.log('Correo enviado correctamente', response);
         // Mostrar mensaje con SweetAlert
         formularioContactos.reset();
         Swal.fire({
             icon: 'success',
             title: '¡Gracias por contactarnos!',
             text: 'Tu mensaje ha sido enviado.',
         });
     }, function(error) {
         console.log('Error al enviar el correo', error);
         // Mostrar mensaje con SweetAlert
         Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.',
         });
     });

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}
}
document.getElementById('formularioContactos').addEventListener('submit', EnviarCorreoEmailJs);


//FUNCIONES PARA PROGRAMA DE CALCULCO DE IMC, DIETAS Y  EJERCICIOS RANDOMS


//cargamos la api o json que tenemos con datos
const dietasygym = '../assets/json/dietasyejercicios.json';

async function obtenerDatosJSON() {
  try {
      const response = await fetch(dietasygym);
      const datos = await response.json();
      return datos;
  } catch (error) {
      console.error('Error al obtener datos del JSON:', error);
  }
}



// FILTRAR VISTAS
document.getElementById("features").style.display = "none";
document.getElementById("contact").style.display = "none";
document.getElementById("rutinaGenerica").style.display = "none";



//



//Ingreso de datos de IMC  y desplegar informacion en unnuevo section

function agregarDatosImc(event){

  try {

    event.preventDefault(); // Evitar que el formulario se envíe

  Swal.fire({
    title: "Estan los datos correctos?",
    showDenyButton: true,
    confirmButtonText: "Continuar",
    denyButtonText: `Volver`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {

    // Obtener valores del formulario
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let edad = document.getElementById("edad").value;
    let sexo = document.getElementById("sexo").value;
    let altura = document.getElementById("altura").value;
    let peso = document.getElementById("peso").value;
    
    let DatosPersona = {
      nombre : nombre,
      apellido : apellido,
      edad : edad,
      sexo : sexo,
      altura : altura,
      peso : peso
    }
      

    console.log("Datos del formulario:", DatosPersona);


          //desplegamos los datos para mostrar al usuario los datos ingresados
        document.getElementById("datoNombre").textContent = nombre;
        document.getElementById("datoApellido").textContent = apellido;
      


    // guardamos datos en session o localstorage, convertimos el objecto con json.stringfy  y control de vistas
    sessionStorage.setItem('DatosUsuario', JSON.stringify(DatosPersona))
    document.getElementById("about").style.display = "none";
    document.getElementById("features").style.display = "block";

    formularioIMC.reset();

    //calculamos imc  

    
    //obtengo los datos de la persona 
    let datosG = sessionStorage.getItem('DatosUsuario');
    let datos = JSON.parse(datosG);
    //llamo a la funcion y envio los datos.
    let  datosImc =  CalcularImc(datos);
    sessionStorage.setItem("imc", JSON.stringify(datosImc));
    document.getElementById("datoImc").textContent = datosImc.imc;
    document.getElementById("rangoImc").textContent = datosImc.rangoObesidad;



      Swal.fire("Datos ingresados correctamente!", "", "success");
    } else if (result.isDenied) {



      Swal.fire("Datos no guardados!", "", "info");
    }
  });


  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}
}
document.getElementById('formularioIMC').addEventListener('submit', agregarDatosImc);



//Boton ingresar nuevamente datos
function reingresarDatos(event){


  
  try {


    document.getElementById("about").style.display = "block";
    document.getElementById("features").style.display = "none";

    formularioIMC.reset();

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}
}
document.getElementById('volverIngresarDatos').addEventListener('click', reingresarDatos);

//Boton rutina dietas y gym

function direccionaraRutinaGym(event){

  try {


    document.getElementById("features").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("rutinaGenerica").style.display = "block";
    obtenerRangoImcporUsuario();

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}


      
  
}
document.getElementById('irARutinayGym').addEventListener('click', direccionaraRutinaGym);


//Boton direccion form conntacto

function direccionaraFormContacto(event){

  try {


    document.getElementById("features").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "block";

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}


      
  
}
document.getElementById('IrAformularioContacto').addEventListener('click', direccionaraFormContacto);


//boton para volver a menu

function VolverAmenuDesdeContactoForm (evento){
  try {
    
    evento.preventDefault();

    document.getElementById("features").style.display = "block";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("rutinaGenerica").style.display = "none";

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}

}
document.getElementById('BotonVolverMenu').addEventListener('click', VolverAmenuDesdeContactoForm);



function VolverAmenuRutinaGym(evento){
  try {
    
    evento.preventDefault();

    document.getElementById("features").style.display = "block";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("rutinaGenerica").style.display = "none";

    

  }
  catch (error) {
  // Manejar cualquier error que ocurra durante la ejecución
  console.error("Error al intentar agregar el dato:", error);
  alert("Se produjo un error al intentar agregar el dato.");
}

}
document.getElementById('BotonVolverMenuRu').addEventListener('click', VolverAmenuRutinaGym);





//funcion calcular imc 


function CalcularImc(datos){


  try {

    console.log(datos)
    let peso = datos.peso;
    let altura = datos.altura;
    let sexo = datos.sexo;
  
   //Convertir la altura de cm a metros
   altura = altura /100;
  
  //calculamos imc
  
  let imc = peso /(altura * altura);
  
  // determinamos el rango en que se encuenta segun el sexo.
  
  
  let rangoObesidad;
  
  if (sexo === 'hombre') {
   if (imc < 20.7) {
       rangoObesidad = "Bajo peso";
   } else if (imc >= 20.7 && imc < 26.4) {
       rangoObesidad = "Normal";
   } else if (imc >= 26.4 && imc < 27.8) {
       rangoObesidad = "Sobrepeso";
   } else if (imc >= 27.8 && imc < 31.1) {
       rangoObesidad = "Obesidad grado 1";
   } else if (imc >= 31.1 && imc < 34.9) {
       rangoObesidad = "Obesidad grado 2";
   } else {
       rangoObesidad = "Obesidad grado 3";
   }
  } else if (sexo === 'mujer') {
   if (imc < 19.1) {
       rangoObesidad = "Bajo peso";
   } else if (imc >= 19.1 && imc < 25.8) {
       rangoObesidad = "Normal";
   } else if (imc >= 25.8 && imc < 27.3) {
       rangoObesidad = "Sobrepeso";
   } else if (imc >= 27.3 && imc < 32.3) {
       rangoObesidad = "Obesidad grado 1";
   } else if (imc >= 32.3 && imc < 35.3) {
       rangoObesidad = "Obesidad grado 2";
   } else {
       rangoObesidad = "Obesidad grado 3";
   }
  }
  
     
  
  
  
  
  return {imc:  parseInt(imc,10) , rangoObesidad:rangoObesidad }

  }  catch (error) {
    // Manejar cualquier error que ocurra durante la ejecución
    console.error("Error al intentar agregar el dato:", error);
    alert("Se produjo un error al intentar agregar el dato.");
 

}

}


// funcion para obtener datos de json por datos del usuario
function obtenerRangoImcporUsuario(){

  try{
        //obtengo los datos de la persona 
    let datosG = sessionStorage.getItem('DatosUsuario');
    let datosP = JSON.parse(datosG);
    let data = sessionStorage.getItem('imc');
    const datosImc = JSON.parse(data);

    if(datosImc){
      
      const titulosRutinasDom = document.getElementById('tituloRutinaGenerica');

      titulosRutinasDom.innerHTML = `
       <div class="container" data-aos="zoom-in">
            <div class="text-center">
              <h3>Hola ${datosP.nombre} </h3>
            <p>Segun tus resultados tienes un IMC de <span>${datosImc.imc}</span> por lo cual te encuentas en un rango de 
            <span>${datosImc.rangoObesidad}</span> </p>  
            </div>
       </div>`;
        }
        obtenerDatosJSON()
  .then(datos => {

      const dietaRutina = datos.dietas.find(d => d.rango_imc === datosImc.rangoObesidad)
      const ejercicioRutina =datos.ejercicios.find(d => d.rango_imc === datosImc.rangoObesidad)
      
      if (dietaRutina && ejercicioRutina){

      const rutinaDietaDom = document.getElementById('descripcion-dieta');
      rutinaDietaDom.innerHTML = ` <i class="bi bi-emoji-smile"></i>
      <span data-purecounter-start="0" data-purecounter-end="65" data-purecounter-duration="2" class="purecounter"></span>
      <p>Para una dieta <strong>sana</strong> y <strong>controlada</strong> te recomendamos : </p>
      <p>${dietaRutina.descripcion}</p>
      <p>
      ${dietaRutina.ejemplo_diario.map(item => `<p>${item}</p>`).join('')}
       </div> `;

       const rutinaGymDom = document.getElementById('descripcion-gym');
       rutinaGymDom.innerHTML = `           <i class="bi bi-emoji-smile"></i>
                 <span data-purecounter-start="0" data-purecounter-end="65" data-purecounter-duration="2" class="purecounter"></span>
                 <p>Para mejorar tu <strong>calidad de vida </strong> y <strong>salud</strong> te recomendamos : </p>
                 <p>${ejercicioRutina.descripcion} </p>
                 <p> Cada <strong> ${ejercicioRutina.frecuencia}</strong>  con un duracion aproximada de <strong > ${ejercicioRutina.duracion} </strong> </p> 
               `;
     

    }

     
      

  }).catch(error=> console.log('Error: Al obtener datos', error))
  }
  catch (error) {
    // Manejar cualquier error que ocurra durante la ejecución
    console.error("Error al intentar agregar el dato:", error);
    alert("Se produjo un error al intentar agregar el dato.");
}



}

