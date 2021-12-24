const oL = () => document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
  function saveLocStorCart() { // atualizar o local Storage quando clica para remover e quando requisitar 
    const lis = document.querySelectorAll('.cart__item');
    const arrayLis = [];

    if (lis !== null && lis.length > 0) {
      for (let index = 0; index < lis.length; index += 1) {
        arrayLis.push(lis[index].innerText);
      }
      localStorage.setItem('cart', JSON.stringify(arrayLis));
    }
  }

function cartItemClickListener(event) {
  event.remove();
  saveLocStorCart();
}

function createCartItemElement({ id, title = 0, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  
  oL().appendChild(li);  

  li.addEventListener('click', (event) => {
    cartItemClickListener(event.target);
  });
  
  return li;
}

function inserirLocStorCart() {
  const jsonLoc = JSON.parse(localStorage.getItem('cart'));
  if (jsonLoc !== null) {
  for (let index = 0; index < jsonLoc.length; index += 1) {
   const criaElement = createCustomElement('li', 'cart__item', `${jsonLoc[index]}`);
   oL().appendChild(criaElement);
  }
  }
}

function requestItemSelect(id) { // Requisita o item selecionado através do id 
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resolve) => resolve.json().then((result) => {
    createCartItemElement(result);
    saveLocStorCart();
    }));
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const btnItem = section.appendChild(createCustomElement('button', 'item__add', 'Add carrinho!'));

  btnItem.addEventListener('click', () => {
    const spanId = btnItem.parentNode.firstChild.innerText;
    requestItemSelect(spanId);
  });
  
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(section);
  return section;
}

function promessa(event) {
  new Promise((resolve, reject) => {
    if (event === 'celular') {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${event}`)
      .then((resolv) => resolv.json())
      .then((result) => resolve(result.results));
    } else {
      reject(Error);
    }
  })
  .then((result) => {
    for (let index = 0; index < result.length; index += 1) {
      createProductItemElement(result[index]);
    }
  })
  .catch((erro) => console.log(erro));
}

function btn() {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    oL().innerText = '';
});
}

function loading() {
  const body = document.querySelector('body');
  body.appendChild(createCustomElement('h1', 'loading', 'loading'));
}

function endLoading() {
  const body = document.querySelector('body');
  const h1 = document.querySelector('.loading');
  body.removeChild(h1);
}

function pro() {
  endLoading();
  promessa('celular');
}

window.onload = async function () {
  await loading();
  await setTimeout(pro, 3000);
  await inserirLocStorCart();
  await btn(); 
};