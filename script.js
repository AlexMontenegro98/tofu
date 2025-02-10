let clientes = [];

document.getElementById("csvFile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) {
    alert("Por favor, selecione um arquivo CSV.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;
    processarCSV(text);
  };

  reader.onerror = function () {
    alert("Erro ao ler o arquivo.");
  };

  reader.readAsText(file);
});

function processarCSV(csvText) {
  const linhas = csvText.split("\n");
  clientes = [];

  linhas.slice(1).forEach((linha) => {
    const colunas = linha.split(",");
    if (colunas.length >= 7) {
      clientes.push({
        nome: colunas[0].trim(),
        endereco: colunas[1].trim(),
        numero: colunas[2].trim(),
        complemento: colunas[3].trim(),
        bairro: colunas[4].trim(),
        cep: colunas[5].trim(),
        telefone: colunas[6].trim(),
      });
    }
  });

  clientes.sort((a, b) => a.nome.localeCompare(b.nome));

  const nomeClienteDropdown = document.getElementById("nomeCliente");
  nomeClienteDropdown.innerHTML = '<option value="">Selecione o cliente</option>';
  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.nome;
    option.textContent = cliente.nome;
    nomeClienteDropdown.appendChild(option);
  });

  nomeClienteDropdown.disabled = false;
}

document.getElementById("nomeCliente").addEventListener("change", function () {
  const nomeCliente = this.value;
  const resultadoDiv = document.getElementById("resultado");
  const enderecoSpan = document.getElementById("endereco");
  const numeroSpan = document.getElementById("numero");
  const complementoSpan = document.getElementById("complemento");
  const bairroSpan = document.getElementById("bairro");
  const cepSpan = document.getElementById("cep");
  const telefoneSpan = document.getElementById("telefone");

  resultadoDiv.style.display = "none";
  enderecoSpan.textContent = "";
  numeroSpan.textContent = "";
  complementoSpan.textContent = "";
  bairroSpan.textContent = "";
  cepSpan.textContent = "";
  telefoneSpan.textContent = "";

  const clienteEncontrado = clientes.find((cliente) => cliente.nome === nomeCliente);

  if (clienteEncontrado) {
    enderecoSpan.textContent = clienteEncontrado.endereco;
    numeroSpan.textContent = clienteEncontrado.numero;
    complementoSpan.textContent = clienteEncontrado.complemento;
    bairroSpan.textContent = clienteEncontrado.bairro;
    cepSpan.textContent = clienteEncontrado.cep;
    const telefoneLink = `<a href="tel:+55${clienteEncontrado.telefone}">${clienteEncontrado.telefone}</a>`;
    telefoneSpan.innerHTML = telefoneLink;
    resultadoDiv.style.display = "block";
  }
});

function copiarEnderecoCompleto() {
  const endereco = document.getElementById("endereco").textContent;
  const numero = document.getElementById("numero").textContent;
  const complemento = document.getElementById("complemento").textContent;
  const bairro = document.getElementById("bairro").textContent;

  const enderecoCompleto = `${endereco}, ${numero}, ${complemento}, ${bairro}`;
  navigator.clipboard.writeText(enderecoCompleto).then(() => {
    const copySuccess = document.getElementById("copySuccess");
    copySuccess.style.display = "block";
    setTimeout(() => {
      copySuccess.style.display = "none";
    }, 2000);
  }).catch(() => {
    console.error("Falha ao copiar o endereço.");
  });
}

function abrirWhatsApp() {
    const telefone = document.getElementById('telefone').textContent;
    const numeroLimpo = telefone.replace(/\D/g, ''); // Remove non-digits
    const whatsappUrl = `https://wa.me/55${numeroLimpo}`;
    window.open(whatsappUrl, '_blank');
}

function abrirMapa() {
    const endereco = document.getElementById('endereco').textContent;
    const numero = document.getElementById('numero').textContent;
    const bairro = document.getElementById('bairro').textContent;
    const cep = document.getElementById('cep').textContent;
    
    const enderecoCompleto = `${endereco}, ${numero} - ${bairro} - ${cep}`;
    const encodedEndereco = encodeURIComponent(enderecoCompleto);
    
    // Check if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
        window.location.href = `https://maps.apple.com/maps?q=${encodedEndereco}`;
    } else {
        window.location.href = `https://maps.google.com/?q=${encodedEndereco}`;
    }
}