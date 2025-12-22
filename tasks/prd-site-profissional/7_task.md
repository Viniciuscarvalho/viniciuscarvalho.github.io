# [7.0] Polimento final (SEO/a11y/perf + docs dev local) (S)

## Objetivo
- Finalizar detalhes de qualidade: SEO, acessibilidade, consistência visual, e documentação de desenvolvimento local.

## Subtarefas
- [x] 7.1 Garantir SEO básico (title/description, 404 alinhado ao layout)
- [x] 7.2 Garantir Tailwind scanning correto (inclui JS com classes)
- [x] 7.3 Criar README com instruções de dev local (npm + bundler)

## Critérios de Sucesso
- Site com metadados corretos e 404 consistente.
- Dev local reproduzível com passos claros.

## Dependências
- 1.0–6.0 concluídas.

## Observações
- Como o deploy é via GitHub Actions, plugins Jekyll customizados são OK (não “safe mode” do Pages clássico).

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/infra/quality</domain>
<type>documentation</type>
<scope>performance</scope>
<complexity>low</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 7.0: Polimento final (SEO/a11y/perf + docs dev local)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Completar a entrega com ajustes finais e documentação para facilitar manutenção e execução local.

<requirements>
- `_config.yml` com title/description alinhados ao posicionamento.
- `tailwind.config.js` com `content` incluindo templates e JS.
- `README.md` com instruções claras para rodar localmente e como funciona o deploy.
</requirements>

## Subtarefas

- [x] 7.1 Ajustar SEO e 404 (layout consistente)
- [x] 7.2 Revisar Tailwind `content` e evitar classes sumirem em produção
- [x] 7.3 Criar README com fluxo local (npm build css + jekyll serve)

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Requisitos especiais, Riscos, Arquivos relevantes).

## Critérios de Sucesso

- Build em CI continua ok.
- Qualquer pessoa consegue rodar local com os passos do README.

## Arquivos relevantes
- `_config.yml`
- `tailwind.config.js`
- `404.html`
- `README.md`

