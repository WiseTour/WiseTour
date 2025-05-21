document.addEventListener('DOMContentLoaded', function () {
    document.body.style.visibility = 'hidden';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.01s ease-out';

    fetch('http://localhost:3000/estado')
      .then(response => response.json())
      .then(data => {
        const estadoElement = document.getElementById('estado');
        estadoElement.textContent = data.estado || 'Não encontrado';

        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';

      })
      .catch(error => {
        console.error('Erro ao buscar estado:', error);
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
      });
  });