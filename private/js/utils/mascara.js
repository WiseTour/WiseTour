export function aplicarMascaraCelular(numero) {
  numero = numero.replace(/\D/g, '');
  if (numero.length <= 10) {
    return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}

export function removerMascara(numero) {
  return numero.replace(/\D/g, '');
}
