function calcularPrecio(precioUnitario, cantidad) {
  const total = precioUnitario * cantidad;
  return total;
}

console.log(calcularPrecio(5, 2));
console.log(calcularPrecio(3, 4));
console.log(calcularPrecio(7, 1));

function puedeReservar(cantidad) {
  if (cantidad <= 2) {
    return true;
  } else {
    return false;
  }
}

if (puedeReservar(2)) {
  console.log("Reserva confirmada");
} else {
  console.log("Lo siento, máximo 2 tazas por persona");
}

// una función parecida, generada por AI
function puedeReservar(cantidad) {
  return cantidad <= 2;
}

function puedeReservar(cantidad, tazasReservadasHoy) {
  return cantidad <= 2 && tazasReservadasHoy + cantidad <= 50;
}

console.log(puedeReservar(2, 47)); // true
console.log(puedeReservar(2, 49)); // false
console.log(puedeReservar(3, 40)); // false