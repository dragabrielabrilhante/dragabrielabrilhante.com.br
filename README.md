# LP da Dra. Gabriela Brilhante — GitHub + Vercel

Landing page estática em HTML, CSS e JavaScript, com imagens locais e agendamento pelo WhatsApp comercial **(14) 99889-4616**.

## Como funciona o contato

1. A apresentação inicial e o formulário não destacam preços. Uma seção própria, após os benefícios do atendimento, apresenta o investimento no cuidado. Os valores da consulta (R$ 250) e do retorno (R$ 150, cobrado separadamente), com Pix ou cartão, ficam no bloco expansível “Valores e formas de pagamento”.
2. Há um formulário em uma única tela: primeiro nome e modalidade, ambos opcionais.
3. “Continuar no WhatsApp” abre a conversa comercial com os campos preenchidos na mensagem. Não há etapa intermediária de revisão, e o texto não afirma que a pessoa viu ou aceitou um preço.
4. Também há um botão para conversar diretamente, sem preencher campos.
5. A pessoa revisa e confirma o envio no WhatsApp. A equipe combina horários, orienta o pagamento e confirma o agendamento.

Cidade, telefone, interesse e disponibilidade são tratados na conversa. Não há perguntas sobre sintomas ou histórico clínico no site. Os links não enviam mensagens automaticamente, não reservam horários e não confirmam pagamento.

As respostas ficam apenas na página durante o preenchimento, sem gravação em cadastro ou no navegador. O fluxo de registro em Google Sheets continua separado desta versão e não foi ativado.

O botão flutuante da Doctoralia permanece como alternativa de agendamento.

## Publicação na Vercel

O Meta Pixel `1459303026043736` está incluído em `dist/index.html` e registra o evento `PageView`. O código não envia respostas do formulário ao pixel. O aviso de privacidade informa o uso da ferramenta para medir visitas e resultados dos anúncios. A recepção dos eventos deve ser conferida em **Testar eventos**, no Gerenciador de Eventos da Meta, após a publicação.

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
