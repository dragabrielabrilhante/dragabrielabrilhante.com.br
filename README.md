# LP da Dra. Gabriela Brilhante — Vercel, Google Sheets e WhatsApp

Landing page em HTML, CSS e JavaScript, com uma função de servidor na Vercel para registrar os formulários na planilha **LEADS GABI LP**. O contato continua pelo WhatsApp comercial **(14) 99889-4616**.

**A integração precisa ser ativada antes de publicar esta versão.** É necessário implantar o Google Apps Script e configurar duas variáveis na Vercel. Instalar o Google Drive no ChatGPT não concede ao site autorização permanente para escrever na planilha. Siga [o guia de ativação](integrations/google-sheets/SETUP.md).

## Fluxo do formulário

1. A pessoa informa modalidade, interesse, disponibilidade, nome, cidade e WhatsApp.
2. Na última etapa, vê a consulta de R$ 250 e o retorno de R$ 150, cobrado separadamente, e autoriza o registro para contato sobre agendamento.
3. **Salvar e revisar respostas** envia o formulário ao servidor. A próxima tela aparece somente após a confirmação de gravação na planilha.
4. **Enviar pelo WhatsApp** abre `https://wa.me/5514998894616` com todas as respostas na mensagem. A pessoa confirma o envio no aplicativo.
5. **Editar minhas respostas** mantém os campos preenchidos. Ao salvar novamente, a mesma linha é atualizada.

O lead é registrado ao concluir o formulário, mesmo que a pessoa não clique no WhatsApp. Etapas incompletas e preenchimentos sem consentimento não são registrados. Cada preenchimento usa um identificador mantido apenas durante a página aberta; recarregar a página e preencher novamente inicia outro envio.

Falhas de gravação mantêm as respostas preenchidas e permitem tentar novamente, sem exibir uma confirmação falsa. Tentativas repetidas do mesmo envio atualizam a mesma linha. As respostas não são gravadas em `localStorage` ou em cookies.

O formulário não solicita sintomas ou histórico clínico. A reserva do horário depende da confirmação pela equipe. O botão flutuante da Doctoralia oferece outra opção de agendamento.

## Vercel

O Meta Pixel `1459303026043736` está incluído em `dist/index.html` e registra o evento `PageView`. O código não envia respostas do formulário ao pixel. O aviso de privacidade informa o uso da ferramenta para medir visitas e resultados dos anúncios. A recepção dos eventos deve ser conferida em **Testar eventos**, no Gerenciador de Eventos da Meta, após a publicação.

Importe o repositório do GitHub. A configuração está no `vercel.json`:

| Configuração | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Raiz do repositório (`./`) |
| Build Command | Vazio |
| Install Command | Vazio |
| Output Directory | `dist` |
| Variáveis do servidor | `LEADS_SCRIPT_URL` e `LEADS_SCRIPT_TOKEN` |

O arquivo `api/leads.mjs` é uma Vercel Function. Não exige dependências nem `package.json`. As variáveis são lidas somente no servidor; nunca coloque o token em `dist`, no GitHub ou em uma variável pública.

Depois de alterar as variáveis, faça um novo deploy. Configure o ambiente de Preview para verificar a integração antes de ativar em Production. Sem configuração válida, a API retorna erro e o formulário permanece na última etapa.

## Arquivos

- `dist/index.html`: conteúdo, estilos, formulário e aviso de privacidade.
- `dist/app.js`: etapas, gravação confirmada e link do WhatsApp.
- `dist/assets/`: logo, foto e ícone da Doctoralia.
- `api/leads.mjs`: validação e comunicação do servidor com o Google.
- `integrations/google-sheets/Code.gs`: gravação na planilha fornecida.
- `integrations/google-sheets/appsscript.json`: manifesto do Apps Script.
- `integrations/google-sheets/SETUP.md`: autorização, implantação e verificação.
- `.env.example`: nomes das variáveis, sem credenciais.

## Limites e manutenção

A captura automática depende da Vercel e do Google Apps Script. Abrir o HTML localmente ou copiar somente `dist` para uma hospedagem estática não disponibiliza a API. Outras cópias da LP não são sincronizadas automaticamente com este repositório.

O servidor aceita apenas as opções do formulário, valida tamanho e telefone, verifica a origem das requisições do navegador e rejeita o campo de controle preenchido por robôs. O Apps Script exige um token e usa um bloqueio para evitar gravações concorrentes. Esses controles não substituem uma proteção contra spam caso ela se torne necessária.

Mantenha a planilha compartilhada apenas com a equipe autorizada. Não reutilize a implantação do Apps Script para outro formulário sem revisar as colunas e a finalidade dos dados.

## Referências oficiais

- WhatsApp: https://faq.whatsapp.com/5913398998672934/?locale=pt_BR
- Vercel Functions com Node.js: https://vercel.com/docs/functions/runtimes/node-js
- Configuração da Vercel: https://vercel.com/docs/project-configuration/vercel-json
- Apps Script web apps: https://developers.google.com/apps-script/guides/web
