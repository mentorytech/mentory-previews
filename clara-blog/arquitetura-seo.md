# Arquitetura SEO — Clara do Vale

## Limite editorial e evidência

**100 fontes, não 100 artigos prometidos.** O inventário verificado contém 100 IDs únicos: 64 lives arquivadas e 36 vídeos, sem Shorts. Há uma transcrição recuperada e um rascunho; os outros 99 dependem de desbloqueio de transcrição. O CSV contém **100 registros de dados mais cabeçalho**. Ângulos, intenções e agrupamentos são propostas de metadados, não conclusões sobre os vídeos nem pesquisa de demanda.

ICP: mulheres empreendedoras construindo marca pessoal e atuação premium. Não importar o ICP empresarial de Ed. Motivação genérica só entra com conexão substantiva comprovada com esse público; pode permanecer fonte de apoio, sem URL própria. Não há publicação, alteração de preview ou alteração de produção nesta entrega.

## Estrutura proposta

| Categoria editorial | Função | Fontes candidatas a abrir a avaliação (rank) |
|---|---|---|
| Posicionamento e marca pessoal | Diferenciação, percepção de valor e visibilidade | 2, 13, 21, 39 |
| Comunicação e autoridade | Expressão profissional, presença e comunicação na venda | 3, 10, 30, 48 |
| Vendas premium | Oferta, decisão, negociação e apresentação do investimento | 8, 17, 42, 63 |
| Autoconfiança e execução | Decisões, projetos e execução; sem diagnóstico clínico | 33, 38, 87, 89 |
| Ambiência e networking | Relações e ambientes profissionais | 6, 27, 28, 85 |
| Bastidores e casos | Relatos contextualizados, com evidências e limites | 9, 16, 59, 75 |

São seis categorias, não seis páginas já existentes. Mapear para taxonomias WordPress antes de criar slugs; reaproveitar categorias equivalentes. Categoria só indexável quando tiver introdução útil, curadoria e conteúdo aprovado suficiente para atender uma intenção própria. Não criar seis arquivos vazios, nem um hub concorrendo com um post para a mesma intenção.

- **Home do blog:** preservar `https://claradovale.com.br/blog/`; H1 editorial único, apresentação de Clara/escopo verificada, navegação pelos temas, conteúdos selecionados e cards com título, resumo fiel, data do artigo e leitura calculada do texto final. Paginação rastreável; cada página de listagem com canonical próprio quando indexável, nunca canonical indiscriminado para a primeira página.
- **Posts:** preservar a estrutura de URLs já usada, inclusive posts fora de `/blog/`; H1 único, abertura que responda à intenção, seções substanciais, fontes com timestamps quando disponíveis, autoria/revisão reais, CTA aprovado e contextual. Não copiar duração do vídeo como tempo de leitura.
- **Breadcrumbs:** Blog → categoria principal → artigo, usando apenas URLs reais e navegáveis. `BreadcrumbList` deve reproduzir o caminho visível. Cada post recebe uma categoria principal; evitar taxonomia multiplicada por sinônimos.
- **TOC:** gerar âncoras estáveis a partir de H2/H3 existentes, apenas quando a extensão justificar. Testar teclado, foco e contraste. Não inventar seções só para preencher sumário.
- **Base visual/técnica:** corrigir ausência de metadescrição e template básico apontados no diagnóstico existente; revalidar H1 no HTML e DOM. Contraste anteriormente registrado em 1,604 requer correção e nova medição, não declaração antecipada de conformidade. Preview deve permanecer fora do índice.

## Consolidação antes da redação

1. Recuperar transcrição íntegra, vincular trechos a cada ID, validar metadados e separar fala atribuível de interpretação editorial.
2. Comparar fontes por pergunta atendida e contribuição própria; comparar também o conteúdo integral dos posts antigos. Títulos semelhantes são alerta, não prova de duplicação.
3. Se repetirem a intenção, escrever **um** guia/dossiê com múltiplas fontes; manter todos os 100 registros na rastreabilidade. Separar satélites apenas quando houver intenção e conteúdo substancialmente distintos. Não definir uma quantidade final de artigos antes dessa revisão.
4. Lives de aquecimento ranks 69–74: `RYrpy3zkKN0`, `ynIJspvhb94`, `ps9q8bzcX1Y`, `DoH97Ho2RWY`, `iKMw966NJlc`, `BgKCKNCpVDo`. Candidatas a um dossiê; comparar também ranks 16 e 76. Aulas ranks 50–52 são candidatas a guia conjunto, sem presumir progressão pela numeração.
5. Anos 2025/2026 e referências a 2027 são contexto da fonte. Não atualizar o ano de uma previsão mecanicamente. Datas divergentes entre título e publicação estão marcadas no CSV. Renda, multiplicadores e prazos não viram promessa SEO; cases requerem prova, período e atribuição. Quantidade de dicas também depende da transcrição.
6. Rank 1 tem aparente divergência entre título comercial e descrição sobre relações/ambiente: confirmar antes de fixar cluster. Rank 9 já tem `../articles/U6FkcmYk5Yw.json`, mas continua rascunho sem revisão humana. Não sobrescrever esse artigo com a proposta desta planilha.

## Links internos: destinos reais e ligações planejadas

Os seis destinos abaixo foram extraídos de `../security/http/public-blog.body`. **Presença no HTML salvo não comprova HTTP 200 atual, indexação ou qualidade.** Validar destino, canonical e conteúdo antes de inserir. Âncoras abaixo são propostas; os slugs históricos permanecem literais.

| Destino existente no HTML | Âncora proposta e conexão editorial |
|---|---|
| https://claradovale.com.br/o-que-diferencia-um-cliente-comum-de-um-cliente-premium/ | “perfil do público premium”; avaliar conexão contextual com ranks 8, 54 e 63 |
| https://claradovale.com.br/como-atrair-clientes-ricos-sem-precisar-correr-atras-de-ninguem/ | “atração de público para ofertas premium”; revisar promessas do legado antes de conectar ranks 12, 39 e 54 |
| https://claradovale.com.br/por-que-mulheres-devem-se-posicionar-como-premium-no-digital/ | “posicionamento premium no digital”; avaliar conexão com ranks 2, 21 e 80 |
| https://claradovale.com.br/elementor-22692/ | Candidato a sobreposição com o post anterior; suspender novos links até comparar conteúdo e histórico, sem escolher vencedor pelo slug |
| https://claradovale.com.br/como-ter-um-negocio-de-sucesso-atraves-da-sofisticacao/ | “sofisticação e percepção de marca”; avaliar conexão com ranks 9, 21 e 82 |
| https://claradovale.com.br/empresaria-beauty-ja-faturou-mais-de-500k-apos-marca-irresistivel/ | “relato de uma empresária do setor beauty”; conectar a casos somente após comprovar alegação e relevância, sem presumir ser a pessoa do rank 75 |

Após aprovação: Blog ↔ categorias aptas; categoria ↔ seus posts; cada post → guia central e apenas aprofundamentos complementares pertinentes, com links recíprocos úteis. Não linkar a 100 páginas ainda inexistentes. Os ranks acima identificam **fontes do plano**, não URLs publicadas. O rascunho tem slug proposto `marca-premium-repertorio-decisoes`, mas nenhuma URL dele está declarada disponível.

## Canonical e preservação do legado

Inventariar URLs, IDs WordPress, status, canonicals e histórico de desempenho antes da migração. Preservar old slugs, mesmo imperfeitos, por padrão. Não renomear `elementor-22692` automaticamente. Se a comparação comprovar duplicação, selecionar a URL final com evidência editorial e histórico disponível; só então aprovar 301 individual para destino equivalente, atualizar links e sitemap e conferir leitura pública. Canonical autorreferente em páginas únicas; canonical cruzado não é correção para conteúdo fraco. Nunca redirecionar tudo para `/blog/` nem mudar canonical em produção nesta etapa.

## Dados estruturados e idiomas

- `BlogPosting` apenas no artigo final: título, descrição, imagem com direito de uso, autor real, URL/canonical, publisher e datas reais da publicação/alteração do **artigo**. Não usar data do vídeo como `datePublished`, nem backdating. Não inventar biografia, credencial, avaliação ou revisão.
- `VideoObject` somente se o vídeo correspondente estiver incorporado e disponível na página: nome, descrição, thumbnail, duração e data verificados por ID; conferir campos no inventário e reprodução. Respeitar precisão da data e não inventar horário/fuso. Não declarar `contentUrl` de arquivo direto que não existe, estatísticas de visualização ou capítulos não conferidos. Um artigo com múltiplas fontes não implica embed nem schema de todos os vídeos.
- Validar JSON-LD, correspondência com conteúdo visível e elegibilidade; schema não garante rich result.
- Definir idioma real `pt-BR`. **Não emitir hreflang** sem versões equivalentes publicadas, URLs confirmadas e referências recíprocas; Madri/Espanha no vídeo não cria tradução espanhola.

## SEO de laboratório versus Search Console

**Laboratório/QA técnico:** HTTP e redirecionamentos, robots, sitemap, canonical, title, metadescrição, H1, links, renderização, contraste, mobile, performance sintética e validação de schema. Score de plugin ou Lighthouse não mede tráfego, indexação real nem posição. 403 intermitente impede afirmar estado público definitivo; repetir verificação autorizada, sem presumir bloqueio do Googlebot.

**Search Console:** inspeção de URL, indexação reportada e desempenho real (consultas/páginas, cliques, impressões, CTR e posição). Não há exportação fornecida: métricas, canibalização medida e resultados orgânicos estão **não avaliados**, não zerados. Após disponibilização, comparar períodos equivalentes; usar consulta × página para testar sobreposição. Sitemap não prova indexação. Não prometer volume, dificuldade, tráfego ou 100 artigos indexáveis.

**Gate final:** transcrição → consolidação e revisão humana → links/legado → QA em ambiente de teste → autorização → publicação → verificação pública e Search Console. Esta entrega encerra apenas o planejamento das fontes; nenhum gate posterior é dado como concluído.
