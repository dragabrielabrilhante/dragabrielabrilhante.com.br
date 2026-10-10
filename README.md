# LP da Dra. Gabriela Brilhante — GitHub + Vercel

Landing page estática em HTML, CSS e JavaScript, com imagens locais e agendamento pelo WhatsApp comercial **(14) 99889-4616**.

## Como funciona o contato

1. A pessoa informa modalidade, interesse, disponibilidade, nome, cidade e WhatsApp.
2. Na última etapa, vê o valor da consulta (R$ 250) e a informação de retorno (R$ 150, cobrado separadamente), e confirma o compartilhamento dos dados.
3. “Revisar respostas” apresenta o resumo. “Editar minhas respostas” permite corrigir o preenchimento sem perder os dados.
4. “Enviar pelo WhatsApp” abre `https://wa.me/5514998894616` com todas as respostas na mensagem.
5. A pessoa revisa e confirma o envio dentro do WhatsApp. A equipe verifica a disponibilidade e orienta a confirmação do agendamento.

O botão abre uma conversa com texto preenchido; não envia mensagens automaticamente. A página não mantém um banco de dados de leads, não grava respostas no navegador e não usa uma API de mensagens. As respostas ficam na página durante o preenchimento e são incluídas na mensagem quando a pessoa escolhe continuar pelo WhatsApp.

Não solicite sintomas ou histórico clínico neste formulário. O aviso de privacidade explica o destino e o uso das informações. Preencher o formulário não garante a reserva de horário.

O botão flutuante da Doctoralia abre o perfil da médica em uma nova aba, como outra opção de agendamento.

## Publicação na Vercel

Importe este repositório do GitHub como um novo projeto. O arquivo `vercel.json` já contém a configuração:

| Configuração | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Raiz do repositório (`./`) |
| Build Command | Vazio |
| Install Command | Vazio |
| Output Directory | `dist` |
| Environment Variables | Nenhuma |

Clique em **Deploy**. Não é necessário instalar dependências ou criar `package.json`. Confirme que a pasta `dist` e o arquivo `vercel.json` estão na raiz do repositório. Não envie apenas um ZIP.

## Arquivos

- `dist/index.html`: conteúdo, estilos e formulário.
- `dist/app.js`: etapas, validação, resumo e link com a mensagem do WhatsApp.
- `dist/assets/`: logo, foto e ícone da Doctoralia.
- `vercel.json`: configuração da publicação.
- `ASSET_SOURCES.md`: origem do ícone externo.
- `.gitignore`: exclusões de arquivos locais; a pasta `dist` deve ser versionada.

## Validação e manutenção

A sintaxe do JavaScript, as referências locais e a remoção dos avisos de demonstração foram conferidas. O fluxo de validação, montagem da mensagem, número de destino, edição de respostas e codificação de acentos e caracteres especiais foi verificado com dados fictícios, sem enviar mensagens reais.

Depois do deploy, confira a página no computador e no celular e abra o WhatsApp para revisar a mensagem. Não foi realizado um deploy na conta da Vercel nem uma confirmação de entrega pelo WhatsApp nesta revisão.

Para alterar o destino, atualize `whatsappNumber` em `dist/app.js`, o contato exibido na página e este documento. Para atualizar a LP, faça um novo commit na branch conectada à Vercel. Outras cópias da página não são sincronizadas automaticamente com este repositório.

## Referências oficiais

- WhatsApp: https://faq.whatsapp.com/5913398998672934/?locale=pt_BR
- Build na Vercel: https://vercel.com/docs/builds/configure-a-build
- `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json
