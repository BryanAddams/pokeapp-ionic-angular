# PokeApp - Pokédex Ionic Angular

Olá! Este é meu projeto de Pokédex desenvolvido com Ionic + Angular, utilizando a [PokeAPI](https://pokeapi.co/) como fonte de dados.  
O objetivo foi criar uma experiência agradável e responsiva para listar Pokémons, visualizar detalhes, marcar favoritos e navegar entre eles.

## Sobre minha abordagem

1. Optei por Angular standalone components para deixar o código mais limpo e modular.
2. O consumo da API é feito via HttpClient, com injeção de dependência para facilitar testes e manutenção.
3. Na tela principal, exibo nome, imagem e número dos Pokémons, além de permitir favoritar e acessar detalhes facilmente.
4. A tela de detalhes traz informações completas, incluindo imagens normal/shiny (frente e costas), e o usuário pode favoritar ou desfavoritar o Pokémon.
5. Os favoritos são salvos em memória e atualizados em tempo real na lista.
6. O layout é totalmente responsivo, funcionando bem em diferentes tamanhos e orientações de tela.
7. Procurei manter commits frequentes e mensagens claras, seguindo boas práticas de versionamento.
8. O código segue o padrão Angular, com separação de responsabilidades e uso de RxJS para reatividade.
9. Aproveitei os componentes do Ionic para garantir uma experiência mobile nativa e fluida.
10. O projeto está pronto para receber testes unitários e documentação técnica, caso necessário.

## Como rodar o projeto

```bash
npm install
ionic serve
```

---

Fique à vontade para explorar o código!  
Se quiser ver o app em funcionamento, basta rodar os comandos acima.  
Qualquer dúvida ou sugestão, estou à disposição.

Obrigado por avaliar meu projeto! 🚀
