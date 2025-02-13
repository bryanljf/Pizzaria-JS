let cart = [];
let modalKey = 0;
let modalQt = 1;
const c = (e) => document.querySelector(e);
const cs = (e) => document.querySelectorAll(e);

// forEach -> Callback para aplicar uma função para cada item de um array (Não cria cópia do array)
// Map -> Evolução do forEach, porém cria um outro array para aplicar a função

// Listagem das pizzas do arquivo JSON
pizzaJson.forEach((item, index) => {
    // Clona o modelo de pizza
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    // Seta atributo de index em cada item criado;
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); // Não recarregar a página
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // Pega o index do modelo mais próximo onde houve o evento do clique, garantido que seja o objeto clicado pela pessoa e em qualquer lugar (imagem, nome, desc ou +)
        modalQt = 1;
        modalKey = key;      

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
                    if(sizeIndex === 2) {
                        size.classList.add('selected');
                    }
                    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
    
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 150);
    });

    c('.pizza-area').append( pizzaItem );
});

// Eventos do modal
const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=> {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt === 1){
        return;
    }else {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

cs('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '-' + size;

    let key = cart.findIndex((i) => i.identifier === identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }
    else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }   

    closeModal();
    updateCart();

});

// Eventos do carrinho
const updateCart = () => {
    let subtotal = 0;
    let discount = 0;
    let total = 0;

    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} ${sizeIdentifer(cart[i].size)}`;
            cartItem.querySelector('.cart--item--qtarea .cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt === 1){
                    cart.splice(i, 1);
                }   
                else {
                    cart[i].qt--;
                }
                
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });;

            c('.cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        c('.big span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

const sizeIdentifer = (size) => {
    switch(size){
        case 0:
            return '(P)'
        case 1:
            return '(M)'
        case 2:
            return '(G)';
    }
}

c('.menu-openner').addEventListener('click', () => 
    cart.length > 0 ? c('aside').style.left = '0' : null);

c('.menu-closer').addEventListener('click', () => 
    c('aside').style.left = '100vw');
