// aula 05paoJson
// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de paes na modal
let quantPaes = 1

let cart = [] // carrinho
// /aula 05

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.paoWindowArea').style.opacity = 0 // transparente
    seleciona('.paoWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.paoWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.paoWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.paoWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.paoInfo--cancelButton, .paoInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasPaes = (paoItem, item, index) => {
    // aula 05
    // setar um atributo para identificar qual elemento foi clicado
	paoItem.setAttribute('data-key', index)
    paoItem.querySelector('.pao-item--img img').src = item.img
    paoItem.querySelector('.pao-item--price').innerHTML = formatoReal(item.price[2])
    paoItem.querySelector('.pao-item--name').innerHTML = item.name
    paoItem.querySelector('.pao-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.paoBig img').src = item.img
    seleciona('.paoInfo h1').innerHTML = item.name
    seleciona('.paoInfo--desc').innerHTML = item.description
    seleciona('.paoInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

// aula 05
const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .pao-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pao-item').getAttribute('data-key')
    console.log('Pao clicada ' + key)
    console.log(padariaJson[key])

    // garantir que a quantidade inicial de paes é 1
    quantPaes = 1

    // Para manter a informação de qual pao foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.paoInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.paoInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = padariaJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.paoInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.paoInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.paoInfo--actualPrice').innerHTML = formatoReal(padariaJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.paoInfo--qtmais').addEventListener('click', () => {
        quantPaes++
        seleciona('.paoInfo--qt').innerHTML = quantPaes
    })

    seleciona('.paoInfo--qtmenos').addEventListener('click', () => {
        if(quantPaes > 1) {
            quantPaes--
            seleciona('.paoInfo--qt').innerHTML = quantPaes	
        }
    })
}
// /aula 05

// aula 06
const adicionarNoCarrinho = () => {
    seleciona('.paoInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual pao? pegue o modalKey para usar padariaJson[modalKey]
    	console.log("Pao " + modalKey)
    	// tamanho
	    let size = seleciona('.paoInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantPaes)
        // preco
        let price = seleciona('.paoInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = padariaJson[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPaes
        } else {
            // adicionar objeto pao no carrinho
            let pao = {
                identificador,
                id: padariaJson[modalKey].id,
                size, // size: size
                qt: quantPaes,
                price: parseFloat(price) // price: price
            }
            cart.push(pao)
            console.log(pao)
            console.log('Sub total R$ ' + (pao.qt * pao.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let paoItem = padariaJson.find( (item) => item.id == cart[i].id )
			console.log(paoItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let paoSizeName = cart[i].size

			let paoName = `${paoItem.name} (${paoSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = paoItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = paoName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

// /aula 06

// MAPEAR padariaJson para gerar lista de paes
padariaJson.map((item, index ) => {
    //console.log(item)
    let paoItem = document.querySelector('.models .pao-item').cloneNode(true)
    //console.log(paoItem)
    //document.querySelector('.pao-area').append(paoItem)
    seleciona('.pao-area').append(paoItem)

    // preencher os dados de cada pao
    preencheDadosDasPaes(paoItem, item, index)
    
    // pao clicada
    paoItem.querySelector('.pao-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na pao')

        // aula 05
        let chave = pegarKey(e)
        // /aula 05

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // aula 05
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.paoInfo--qt').innerHTML = quantPaes

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        // /aula 05

    })

    botoesFechar()

}) // fim do MAPEAR padariaJson para gerar lista de paes

// aula 05
// mudar quantidade com os botoes + e -
mudarQuantidade()
// /aula 05

// aula 06
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
// /aula 06
