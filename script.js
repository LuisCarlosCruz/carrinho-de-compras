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
  
  // function cartItemClickListener(event) {
    //   // coloque seu código aqui
    // }
    
// =====================================================================================================
    
function createCartItemElement({ id, title = 0, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  return li;
  // li.addEventListener('click', null);
}
// =====================================================================================================

function requestItemSelect(id) { // Requisita o item selecionado através do id 
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resolve) => resolve.json().then((result) => createCartItemElement(result)));
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
    if (event === 'computador') {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${event}`)
      .then((resolv) => resolv.json())
      .then((result) => resolve(result.results));
    } else {
      reject(Error);
    }
  })
  .then((result) => {
    // console.log(result);
    for (let index = 0; index < result.length; index += 1) {
      createProductItemElement(result[index]);
    }
  })
  .catch((erro) => console.log(erro));
}

window.onload = () => { 
  promessa('computador');
};
