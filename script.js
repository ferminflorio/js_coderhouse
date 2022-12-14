const lista = document.getElementById("myList");
const tMain = document.getElementById("tMain");
const proxGuitarElement = document.querySelector("#prox");
const totalCartElement = document.querySelector(".carritoTotalFinal");
let nuevosLanzamientos = [];
let carrito = [];
let userEmail;

checkCompras();

function checkCompras() {
	console.log(carrito);
	const ultiCompra = JSON.parse(localStorage.getItem("carrito"));
	if (ultiCompra) {
		carrito = ultiCompra;
		console.log(carrito.length);
		console.log(carrito);
	}
	if (carrito.length > 0) {
		renderizarCompras();
	}

	presentarGuitarras();
}

function presentarGuitarras() {
	for (const guitarra of guitarras) {
		lista.innerHTML += `<li class="col-sm-3 list-group-item">
        <h3> ID: ${guitarra.id} </h3>
        <img src= ${guitarra.img} width="100" height="100">
        <p class="fst-italic fw-bolder"> Marca: ${guitarra.marca}</p>
        <p class="fw-bolder"> $ ${guitarra.precio} </p>
        <button class='btn btn-success' id='btn ${guitarra.id}'>COMPRAR</button>
        
        </li>`;
	}

	guitarras.forEach((guitarra) => {
		document
			.getElementById(`btn ${guitarra.id}`)
			.addEventListener("click", function () {
				agregarAlCarrito(guitarra);
			});
	});
}

function agregarAlCarrito(guitarraNueva) {
	carrito.push(guitarraNueva);
	console.log(carrito);
	Swal.fire(
		"Guitarra " + guitarraNueva.marca,
		"Agregada al carrito!",
		"success"
	);

	localStorage.setItem("carrito", JSON.stringify(carrito));
	renderizarCompras();
}

function renderizarCompras() {
	let sumaTotal = 0;
	tMain.innerHTML = "";
	carrito.forEach((guitarraNueva) => {
		tMain.innerHTML += `
		<tr>
			<td>${guitarraNueva.id}</td>
			<td>${guitarraNueva.marca}</td>
			<td>${guitarraNueva.precio}</td>
		</tr>`;
		sumaTotal += Number(guitarraNueva.precio);
	});
	updateTotalShop(sumaTotal);
}

function updateTotalShop(sumaTotal) {
	totalCartElement.innerHTML = sumaTotal;
}

let btnBorrar = document.getElementById("btnBorrar");

btnBorrar.onclick = () => {
	localStorage.removeItem("carrito");
	Swal.fire({
		icon: "warning",
		text: "Carrito vacio!",
	});
	vaciarCarrito();
};

function vaciarCarrito() {
	tMain.innerHTML = "";
	carrito = [];
	totalCartElement.innerHTML = "";
}

let btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

btnFinalizarCompra.onclick = () => {
	if (tMain.childNodes.length <= 0) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "El carrito esta vacio!",
		});

		return;
	}

	localStorage.removeItem("carrito");
	getFormValues();
};

async function getFormValues() {
	const { value: formValues } = await Swal.fire({
		title: "Completa datos de facturación:",
		html:
			'<input id="swal-input1" class="swal2-input"  placeholder="nombre completo">' +
			'<input id="swal-input2" class="swal2-input" placeholder="email" type="email">' +
			'<input id="swal-input3" class="swal2-input"  placeholder="direccion">',
		focusConfirm: false,
		preConfirm: () => {
			userEmail = document.getElementById("swal-input2").value;
		},
	});

	if (formValues) {
		Swal.fire(`Te estaremos contactando a ${userEmail}`);
		console.log(carrito);
		const ordenDeCompra = { user: userEmail, orden: carrito };
		sessionStorage.setItem(
			"orden de compra",
			JSON.stringify(ordenDeCompra)
		);
		vaciarCarrito();
	}
}

document.getElementById("btnProx").onclick = () => {
	proxGuitar();
};

function proxGuitar() {
	const proxGuitarURL = "/proximos.json";

	if (nuevosLanzamientos.length <= 0) {
		console.log(nuevosLanzamientos);
		fetch(proxGuitarURL)
			.then((response) => response.json())
			.then((data) => {
				nuevosLanzamientos = data.proximamente;
				for (const lanzamiento of nuevosLanzamientos) {
					proxGuitarElement.innerHTML += `
				<h5>${lanzamiento.marca}</h5>
				<p>${lanzamiento.tipo}</p>
				`;
				}
			});
	} else {
		proxGuitarElement.classList.toggle("isHidden");
	}
}

function activeDark() {
	document.body.classList.toggle("darkMode");
}

let darkBoton = document.getElementById("darkMode");
darkBoton.addEventListener("click", activeDark);
