# ApiChatGpt

## Sobre o projeto:

- Uma api de integração com o chat gpt

## Ferramentas utilizadas:

- NodeJs, Express, OpenAi

## Passos iniciais 
  
-  Após baixar o repositório utilize um `npm i` para fazer o download de todas as dependências.
-  Após isto crie um arquivo .env conforme o exemplo.
-  Inicie o projeto com o comando `npm run dev`.

## Rotas da api:

## Rotas públicas:

### INTEGRAÇÃO CHAT GPT

| Rota                                   | Método | Descrição           |
|----------------------------------------|--------|---------------------|
| /integracaoGpt/resumirTexto            | POST   | Resumo de textos.   |
| /integracaoGpt/converterAudioParaTexto | POST   | Transcrever áudios. |
