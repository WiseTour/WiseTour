let mesesAnosPaisesBanco;

fetch(`/grafico/perfil-estimado-turista/meses-anos-paises`)
  .then((res) => {
    if (!res.ok) throw new Error("Erro ao buscar meses e anos");
    return res.json();
  })
  .then((data) => {
    if (!data || !Array.isArray(data.mesesAnosPaises)) {
      throw new Error("Formato inválido da resposta");
    }

    mesesAnosPaisesBanco = data.mesesAnosPaises.map((item) => ({
      ...item,
      pais: item.pais?.toUpperCase(), // padroniza para evitar re-render
    }));

    const selectMes = document.getElementById("mes");
    const selectAno = document.getElementById("ano");
    const selectPais = document.getElementById("pais");

    const nomesMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    preencherMeses();
    preencherAnos();
    preencherPaises();

    selectMes.addEventListener("change", atualizarFiltros);
    selectAno.addEventListener("change", atualizarFiltros);
    selectPais.addEventListener("change", atualizarFiltros);

    function atualizarFiltros() {
      const mesSelecionado = parseInt(selectMes.value);
      const anoSelecionado = parseInt(selectAno.value);
      const paisSelecionado = parseInt(selectPais.value);

      const filtro = {
        mes: isNaN(mesSelecionado) ? null : mesSelecionado,
        ano: isNaN(anoSelecionado) ? null : anoSelecionado,
        pais: isNaN(paisSelecionado) ? null : paisSelecionado,
      };

      preencherMeses(filtro);
      preencherAnos(filtro);
      preencherPaises(filtro);
    }

    function preencherMeses(filtro = {}) {
      const mesesFiltrados = mesesAnosPaisesBanco
        .filter(
          (item) =>
            (filtro.ano == null || item.ano === filtro.ano) &&
            (filtro.pais == null || item.id_pais === filtro.pais)
        )
        .map((item) => item.mes);

      const mesesUnicos = Array.from(new Set(mesesFiltrados)).sort((a, b) => a - b);

      const novasOpcoes = [
        { value: "", label: "MÊS:" },
        ...mesesUnicos.map((mes) => ({
          value: `${mes}`,
          label: nomesMeses[mes - 1] || `Mês ${mes}`,
        })),
      ];

      atualizarSelect(selectMes, novasOpcoes);
    }

    function preencherAnos(filtro = {}) {
      const anosFiltrados = mesesAnosPaisesBanco
        .filter(
          (item) =>
            (filtro.mes == null || item.mes === filtro.mes) &&
            (filtro.pais == null || item.id_pais === filtro.pais)
        )
        .map((item) => item.ano);

      const anosUnicos = Array.from(new Set(anosFiltrados)).sort((a, b) => b - a);

      const novasOpcoes = [
        { value: "", label: "ANO:" },
        ...anosUnicos.map((ano) => ({
          value: `${ano}`,
          label: `${ano}`,
        })),
      ];

      atualizarSelect(selectAno, novasOpcoes);
    }

    function preencherPaises(filtro = {}) {
      const paisesFiltrados = mesesAnosPaisesBanco
        .filter(
          (item) =>
            (filtro.mes == null || item.mes === filtro.mes) &&
            (filtro.ano == null || item.ano === filtro.ano)
        )
        .filter((item) => item.id_pais && item.pais);

      const paisesUnicosMap = new Map();
      for (const item of paisesFiltrados) {
        if (!paisesUnicosMap.has(item.id_pais)) {
          paisesUnicosMap.set(item.id_pais, item.pais);
        }
      }

      const paisesOrdenados = Array.from(paisesUnicosMap.entries()).sort(
        (a, b) => a[1].localeCompare(b[1], "pt", { sensitivity: "base" })
      );

      const novasOpcoes = [
        { value: "", label: "PAÍS:" },
        ...paisesOrdenados.map(([id, nome]) => ({
          value: `${id}`,
          label: nome.toUpperCase(),
        })),
      ];

      atualizarSelect(selectPais, novasOpcoes);
    }

    function atualizarSelect(select, novasOpcoes) {
      // Salva o valor atual selecionado
      const valorAtual = select.value;
      
      // Verifica se precisa atualizar comparando as opções
      const precisaAtualizar = select.options.length !== novasOpcoes.length ||
        Array.from(select.options).some((opt, i) => {
          const opcaoAtual = novasOpcoes[i];
          if (!opcaoAtual) return true;
          
          return opt.value !== opcaoAtual.value || 
                 opt.textContent.trim() !== opcaoAtual.label.trim();
        });

      if (precisaAtualizar) {
        // Limpa as opções existentes
        select.innerHTML = "";
        
        // Adiciona as novas opções
        novasOpcoes.forEach(({ value, label }) => {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = label;
          select.appendChild(opt);
        });

        // Tenta restaurar o valor selecionado se ainda existir
        const valorExiste = novasOpcoes.some(opcao => opcao.value === valorAtual);
        if (valorExiste && valorAtual !== "") {
          select.value = valorAtual;
        } else {
          // Se o valor não existe mais, seleciona a primeira opção (placeholder)
          select.selectedIndex = 0;
        }
        
        console.log(`Select ${select.id} atualizado com ${novasOpcoes.length} opções`);
      } else {
        console.log(`Select ${select.id} não precisou ser atualizado`);
      }
    }
  })
  .catch((err) => {
    console.error("Erro:", err);
    alert("Não foi possível carregar os meses, anos e países.");
  });