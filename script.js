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

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton, .pizzaInfo--addButton').forEach((item) => {
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

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});