---
layout: post
title:  "Algoritmos de Sorting, o que é isso macho?"
date:   2021-02-24 12:00:36 +0530
categories: Swift, DataStructure, Algorithm 
---

Na continuação da série de posts sobre estrutura de dados em Swift, passamos agora por algoritmos de *sorting*, *bubble sort*, *selection sort,* *insertion sort*," mas eu só vi isso na faculdade ou nem vi e também nunca me fez falta", sempre falam. Não é que você vai ficar analisando qual o mais rápido ou ficar pensando na melhor solução sempre, mas o que se adequa mais para resolver o seu problema.

Source: [Raywenderlich - data structures & algorithms in Swift](https://www.raywenderlich.com/977854-data-structures-algorithms-in-swift/lessons/7)

## **Bubble Sort**

Digamos que esse algoritmo seja uma grande comparação de valores dentro de uma lista e trocando suas posições, por exemplo, temos um array com 4 elementos, [3,9,10,4], quando fazemos a implementação do algoritmo de Bubble, basicamente o que ele faz é percorrer esse array olhando o elemento sequente, tipo o 3 vai olhar para a posição onde está o nove e fazer sua ordenação de acordo com o seu tamanho e assim sucessivamente até chegar na última posição do array. Falando em linguajar computacional Bubble Sort iria levar N-1 para percorrer nosso array, sendo o N o número de itens no mesmo. Até ai tudo bem né?

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6db0ced-827a-45a2-9d76-838b8794e259/BubblesortScreenshot.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6db0ced-827a-45a2-9d76-838b8794e259/BubblesortScreenshot.png)

## Selection Sort

Esse algoritmo é muito parecido com o Bubble sort, difere no quesito perfomance e isso acontece por causa do número de operações de troca, mas o que é isso? Eu te explico, é que no Selection Sort ele só vai trocar no final de cada passagem por nossa lista.

Temos nossa lista novamente, [9,4,10,3], ao contrário do Bubble Sort, o Selection coloca os valores mais baixos embaixo da pilha digamos assim. Ele busca o valor mais baixo não classificado e coloca lá embaixo. No final de ter feito a implementação do algoritmo teremos a lista com esse resultado, [3,4,9,10].

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0132b57f-da49-4972-b403-1acaa16268d4/SelectionSort-screenshot.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0132b57f-da49-4972-b403-1acaa16268d4/SelectionSort-screenshot.png)

## Insertion Sort

Aqui no *Insertion* ele já faz de uma maneira diferente dos outros dois, ele percorre a lista da esquerda para direita comparando os elementos e faz a troca para a esquerda até ficar em ordem crescente. Não entendeu? Nem eu!

Se tivermos o nosso array, [9,4,10,3], a primeira posição não é alterada pois não há nada a sua esquerda, em seguida ele procura o 9 e 4 onde são trocados de posição, seguindo, temos 9 e 10, eles permanecem na posição pois o 9 é menos que o 10, depois temos 10 e 3, ai eles trocam e assim seguindo até o 3 ficar na primeira posição, agora ficou um pouco mais claro não é?

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9403a385-d2d0-4f28-97b8-5d503e33a898/InsertionSort-screenshot.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9403a385-d2d0-4f28-97b8-5d503e33a898/InsertionSort-screenshot.png)

## Merge Sort

O grand finale, diria que é a união entre todos os outros algoritmos, sem contar que ele traz o conceito de dividir pra conquistar, com uma eficiência de *O(n log n),* mas o porque tô trazendo esses dados e conceitos sobre esse algoritmo? Bem, para entendermos um pouco como ele pode ser aplicado e como funciona sua implementação.

Ele pode ser segmentado em duas fases, *split* e *merge*. Primeiro ele pega aquele nosso array e divide em parte iguais, em seguida ele vai dividindo até que não consiga mais dividir deixando apenas um elemento. Assim fica muito mais fácil fazer o sort de uma coleção de um não é mesmo? O segundo passo é o step.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2a0a285c-7c1e-4620-b61f-6a905783ebd6/MergeSort.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2a0a285c-7c1e-4620-b61f-6a905783ebd6/MergeSort.png)

Basicamente o que temos no código acima foi a explicação que tentei deixar claro como é o funcionamento do algoritmo.

Vimos algumas das estruturas básicas para dar inicio aos binary search, trees e heaps, é só o começo desses estudos e revisitar esses conceitos são muito bons pois agora não temos a pressão de estudar para passar em alguma prova da faculdade e implementar ou trazer para algo do nosso dia a dia fazendo algumas equiparações na medida do possível.

Até a próxima com outros algoritmos de estudos de estrutura de dados!