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

| Rota                                                                | Método |
|---------------------------------------------------------------------|--------|
| /integracaoGPT/resumirConversasPorTexto                             | POST   |
| /integracaoGPT/converterAudioParaTexto                              | POST   |
| /integracaoGPT/converterTextoParaAudio                              | POST   |
| /integracaoGPT/converterTextoParaAudio                              | POST   |
| /integracaoGPT/criarImagem                                          | POST   |
| /integracaoGPT/gerarSugestaoDeResposta                              | POST   |
| /integracaoGPT/traduzirMensagemDeErro                               | POST   |

#### Treinamento

| Rota                                                                | Método |
|---------------------------------------------------------------------|--------|
| /integracaoGPT/treinamento/gerarEmbeddingBaseadoEmArquivoPDF        | POST   |
| /integracaoGPT/treinamento/gerarFineTunningModelBaseadoEmArquivoPDF | POST   |
