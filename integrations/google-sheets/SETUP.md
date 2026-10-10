# Ativar o registro de leads

Esta configuração conecta a LP da Vercel à planilha fornecida:

https://docs.google.com/spreadsheets/d/1zT4Pa3XVwi1CBw_CgH8xknfD4DsxHMD67F5vKt7-EGU/edit

O código usa exclusivamente esse ID de planilha. A implantação e a autorização do Google ainda precisam ser feitas por uma conta com acesso de edição. A conexão do Google Drive com o ChatGPT não substitui essa autorização do aplicativo.

## 1. Conferir a planilha

Preserve as sete colunas já existentes, na primeira linha de uma única aba:

| Coluna | Cabeçalho | Campo |
| --- | --- | --- |
| A | Como prefere ser atendida(o) | Modalidade |
| B | O que você procura hoje | Interesse |
| C | Quando gostaria de agendar | Disponibilidade |
| D | Período de preferência | Período |
| E | Nome | Nome |
| F | Cidade e estado | Cidade |
| G | WhatsApp com DDD | Telefone |
| H | Recebido em | Data e hora |
| I | ID do envio | Identificador usado para evitar duplicação |

O script identifica a aba pelos sete primeiros cabeçalhos, ignorando acentos, maiúsculas e pontuação. Se houver nenhuma ou mais de uma aba correspondente, não grava dados. H e I precisam estar vazias ou já ter os dois cabeçalhos acima; o script recusa outro conteúdo nessas colunas.

Em **Compartilhar**, mantenha o acesso limitado à equipe que cuida dos agendamentos. O site não precisa de acesso público à planilha.

## 2. Criar o Apps Script

1. Abra a planilha com a conta responsável e escolha **Extensões → Apps Script**. Nome sugerido para o projeto: **Leads LP — Dra. Gabriela**.
2. Substitua o conteúdo de `Code.gs` pelo arquivo `Code.gs` desta pasta.
3. Em **Configurações do projeto**, habilite a exibição do arquivo de manifesto `appsscript.json`. Substitua seu conteúdo pelo manifesto desta pasta e salve.
4. No editor, selecione a função `configureLeadCapture` e execute uma vez.
5. Revise e autorize a permissão solicitada pelo Google. O escopo permite acesso a planilhas da conta; este código abre somente a planilha especificada acima. O Google pode exigir revisão da autorização de um aplicativo próprio ainda não verificado.
6. Confirme que H e I receberam seus cabeçalhos. A execução também cria o token nas propriedades do projeto, sem escrever o token na planilha ou nos logs.

Não use uma conta sem acesso de edição à planilha. Não publique o token em mensagens, capturas de tela ou no repositório.

## 3. Implantar o aplicativo da web

1. No Apps Script, escolha **Implantar → Nova implantação → Aplicativo da Web**.
2. Configure **Executar como: você**, usando a conta com acesso à planilha.
3. Configure o acesso para **Qualquer pessoa**, pois a função da Vercel chama esse endpoint sem sessão do Google. O token no servidor é obrigatório para gravar; o endpoint não permite consultar os leads.
4. Implante e copie a URL terminada em `/exec`. A URL de desenvolvimento `/dev` não serve para a produção.

Se a organização impedir esse tipo de implantação, pare nesta etapa: será necessário um método de autenticação aprovado pela organização. Não altere políticas de conta para contornar o bloqueio.

## 4. Configurar a Vercel

No projeto da LP, abra **Settings → Environment Variables** e adicione:

| Nome | Valor |
| --- | --- |
| `LEADS_SCRIPT_URL` | URL da implantação, `https://script.google.com/macros/s/…/exec` |
| `LEADS_SCRIPT_TOKEN` | Valor da propriedade de mesmo nome em Configurações do projeto do Apps Script |

Marque `LEADS_SCRIPT_TOKEN` como sensível e mantenha-o apenas no servidor. Não use prefixos públicos como `NEXT_PUBLIC_` ou `VITE_`. `.env.example` contém apenas os nomes e deve continuar sem valores.

Configure primeiro **Preview** e faça um novo deploy da branch da integração. Depois da verificação abaixo, configure **Production** e publique a versão verificada. Alterar uma variável exige um novo deploy para ter efeito.

## 5. Verificar antes de publicar

1. Abra a URL de Preview da Vercel e conclua o formulário com um contato fictício claramente identificado, com autorização de registro.
2. Confirme que surgiu exatamente uma linha, com as sete respostas nas colunas corretas, a data em H e um identificador em I.
3. Escolha **Editar minhas respostas**, corrija o nome e salve novamente. Confirme que a mesma linha foi atualizada e a data original foi preservada.
4. Abra **Enviar pelo WhatsApp** e confira o destino `(14) 99889-4616` e o texto preenchido. Não é necessário enviar a mensagem para verificar.
5. Exclua a linha fictícia pela planilha depois da conferência.
6. Verifique também em um celular. Somente depois desta gravação real confirmada, ative a versão em produção.

Uma resposta de sucesso exige confirmação do Google após gravar. Se ocorrer erro, as respostas continuam no formulário e o mesmo identificador é usado na tentativa seguinte. Não altere a implementação para tratar uma requisição `no-cors` como uma gravação confirmada.

## Atualizações e solução de erros

- **Não foi possível registrar:** confira as variáveis do ambiente da implantação, o acesso da conta à planilha e os cabeçalhos. O navegador não recebe detalhes internos ou credenciais.
- **Novo código no Apps Script:** crie uma nova versão da implantação existente para manter a URL `/exec`. Apenas salvar o editor não atualiza a versão publicada.
- **Troca de token:** gere e configure um novo valor em Propriedades do projeto e na Vercel, depois faça um novo deploy. Não remova a exigência de token.
- **Mudança de colunas:** preserve A:I ou adapte explicitamente o código. Não exclua a coluna I se quiser manter a proteção contra duplicação.
- **Ordenar leads:** ordene linhas completas de A:I, para manter respostas, data e identificador juntos.
