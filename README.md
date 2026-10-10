# LP da Dra. Gabriela Brilhante — GitHub + Vercel

Pacote preparado em 10/10/2026, a partir da versão mais recente da landing page.

Site estático em HTML, CSS e JavaScript. As imagens e os ícones estão incluídos. O CSS está dentro de `dist/index.html`.

## Estado do formulário

**O formulário é uma demonstração: não envia, não salva e não recebe leads.**
As respostas são usadas somente para exibir o resumo durante o preenchimento.
Não há servidor, banco de dados, envio por e-mail ou integração com WhatsApp neste pacote.
Os avisos de teste continuam visíveis na página.

O botão flutuante da Doctoralia abre o perfil real da médica em uma nova aba. Ele não transmite as respostas do formulário.

Para usar a LP na captação real, será necessário definir e conectar o destino das solicitações. A publicação na Vercel, por si só, não ativa o recebimento de leads.

## 1. Publicar os arquivos no GitHub

1. Extraia o arquivo ZIP.
2. Crie um repositório no GitHub ou abra o repositório que usará para esta LP.
3. Envie **o conteúdo da pasta `lp-gabriela-vercel`** para a raiz do repositório.
4. Confirme que `vercel.json`, `README.md` e a pasta `dist` aparecem lado a lado na raiz.
5. Confirme o envio com um commit.

Não envie apenas o ZIP: a Vercel precisa dos arquivos extraídos. Mantenha a pasta `dist` e os nomes dos arquivos, inclusive letras maiúsculas e minúsculas.

## 2. Importar na Vercel

Na Vercel, crie um novo projeto e importe esse repositório do GitHub.

| Configuração | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Raiz do repositório (`./`) |
| Build Command | Vazio: sem build |
| Install Command | Vazio: sem instalação |
| Output Directory | `dist` |
| Environment Variables | Nenhuma |

O arquivo `vercel.json` já declara o framework, a pasta de saída e os comandos vazios. Se houver configurações antigas no projeto da Vercel, confira os campos acima antes de publicar.

Clique em **Deploy**. Não é necessário escolher React, Next.js ou Vite. Também não é necessário criar um `package.json`, instalar Node.js no seu computador ou executar `npm install`.

## Arquivos incluídos

| Arquivo | Função |
| --- | --- |
| `vercel.json` | Configura a Vercel para servir o conteúdo de `dist` |
| `dist/index.html` | Página, textos, formulário e estilos |
| `dist/app.js` | Etapas do formulário, validação e botão da Doctoralia |
| `dist/assets/logo-gabriela-brilhante.png` | Logo da médica |
| `dist/assets/foto-dra-gabriela.jpg` | Foto de apresentação |
| `dist/assets/doctoralia-icon.png` | Ícone da Doctoralia |
| `ASSET_SOURCES.md` | Origem do ícone externo |
| `.gitignore` | Exclusões de arquivos locais do Git |

## Conferência após o deploy

- Abra a URL fornecida pela Vercel e confira a página no computador e no celular.
- Percorra as quatro etapas usando dados fictícios.
- Na última etapa, confira a consulta de R$ 250 e a informação de retorno de R$ 150, cobrado separadamente.
- Abra e feche o botão da Doctoralia. O link deve abrir o perfil em uma nova aba.
- Se aparecer 404 na página inicial, confira `Root Directory = ./` e `Output Directory = dist`, com `vercel.json` na raiz.
- Se faltar uma imagem, confira se todos os arquivos de `dist/assets` foram enviados com os nomes preservados.

Este pacote foi revisado quanto à configuração e às referências locais. Não foi feito um deploy na sua conta da Vercel.

## Atualizações futuras

Edite os arquivos no GitHub e faça um novo commit na branch conectada à Vercel. Atualizações feitas em outra cópia da página não são sincronizadas automaticamente com esse repositório.

## Referências oficiais

- Configuração de build: https://vercel.com/docs/builds/configure-a-build
- Configuração do `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json
