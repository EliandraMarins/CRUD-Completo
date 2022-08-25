"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};
// 1.CRUD, create, read, update, delete

//CRUD - Delete

const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};

//CRUD - Update
const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

//CRUD - Read
const readClient = () => getLocalStorage();

//CRUD - Create
//Le o que tem no BD (localStorage), tranforma em JSON e armazena em uma variavel chamada dbCliente e caso estiver vazio, retorna vazio.
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];

//Envia o novo cliente pro banco pelo localStorage.setItem com a chave e o valor transformado em string
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

//1-Aciona a funcao getLocalStorage()
//2-Adiciona o novo client que veio por parametro ao BD
//3-Aciona a funcao setLocalStorage()
const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};



//2.Interacao com o Layout

//Validacao: Se os campos estao todos preenchidos
const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

//Limpar os campos: Pega todos os campos com o queryselectorAll, para cada field, pega o valor dele ,passa de um por um e limpa o valor (iguala a vazio)

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

//Verifica se todos os campos estao preenchidos e depois constroi o JSON com os dados que foram digitados no formulario e chama a funcao create client com os dados do cliente

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value
    };
    const index = document.getElementById("nome").dataset.index
    if(index == 'new'){
    createClient(client);
    updateTable()
    closeModal();
  }else{
    updateClient(index, client)
    updateTable();
    closeModal();
  }
  }
};

const cancelClient = () => {
  closeModal()
}

//3.Mostrando os dados dos clientes na pagina

//Seleciona a tableClient e dentro do tbody adiciona um filho, que eh o new Row.

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">editar</button>
        <button type="button" class="button red" id="delete-${index}">excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

//Chama esse metodo toda vez que a pagina carrega: Ele le os dados do local storage e preenche a tabela na pagina. Para os dados nao serem duplicados, da um clearTable

const updateTable = () => {
  const dbClient = readClient();
  clearTable()
  //Pega cada cliente do localStorage e vai interagir com cada elemento do array de clientes criado uma linha
  dbClient.forEach(createRow);
};

//4.Deletando e editando os clientes

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('celular').value = client.celular
  document.getElementById('cidade').value = client.cidade
  document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

//A acao so acontece se clicar onde tem o tipo button.
//Usa a desestruturacao pra separar o elemento do index
const editDelete = (event) => {
  if (event.target.type == 'button'){

    const [action, index] = event.target.id.split('-')

    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(
        `Deseja realmente excluir o(a) cliente ${client.nome}?`
      );
      if (response) {
        deleteClient(index);
        updateTable();
      }
    }
  }
}


updateTable();


//Eventos
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document.getElementById("cancelar").addEventListener("click", cancelClient);

//Captura o evento no pai dele, pois nao sabemos quantos vao ser criados
document.querySelector('#tableClient>tbody').addEventListener("click", editDelete);