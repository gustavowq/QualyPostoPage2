import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  getWhatsAppUrl,
  SITE_CONFIG
} from './site.config';

interface ReceivingStep {
  title: string;
  label: string;
  heading: string;
  text: string;
}

// Estruturas dos dados exibidos nas demonstrações da página.
interface DashboardRecord {
  unit: string;
  type: 'Recebimentos' | 'Checklists';
  subject: string;
  status: 'Conforme' | 'Atenção';
  detail: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <a class="skip-link" href="#conteudo">
      Pular para o conteúdo
    </a>

    <header class="header">
      <nav class="container nav" aria-label="Navegação principal">
        <a
          class="brand-link"
          href="#inicio"
          aria-label="QualyPosto, início"
          (click)="menuOpened.set(false)"
        >
          <img
            class="brand-logo"
            src="assets/qualyposto-logo.png"
            alt="QualyPosto"
            width="1000"
            height="270"
          >
        </a>

        <div
          class="nav-links"
          id="navigation"
          [class.is-open]="menuOpened()"
        >
          <details class="nav-dropdown">
            <summary>
              Solu&ccedil;&atilde;o
            </summary>

            <div class="nav-dropdown-menu">
              <a href="#checklist" (click)="closeMenu()">Checklist</a>
              <a href="#recebimento" (click)="closeMenu()">Recebimento</a>
            </div>
          </details>

          <a href="#solucao" (click)="closeMenu()">Solução</a>
          <a href="#checklist" (click)="closeMenu()">Checklist</a>
          <a href="#gerencial" (click)="closeMenu()">Gerencial</a>
          <a href="#planos" (click)="closeMenu()">Planos</a>
          <a href="#beneficios" (click)="closeMenu()">Benefícios</a>
        </div>

        <div class="nav-actions">
          <button
            class="button button-small nav-contact"
            type="button"
            (click)="openContact($event)"
        >
          Conhecer a solução
          <span aria-hidden="true">↗</span>
        </button>

          <button
            class="button button-small nav-sistema"
            type="button"
          >
          Acessar o sistema
          <span aria-hidden="true">↗</span>
          </button>
        </div>

        <button
          class="menu-toggle"
          type="button"
          aria-controls="navigation"
          [attr.aria-expanded]="menuOpened()"
          [attr.aria-label]="
            menuOpened() ? 'Fechar menu' : 'Abrir menu'
          "
          (click)="menuOpened.set(!menuOpened())"
        >
          <span>{{ menuOpened() ? 'Fechar' : 'Menu' }}</span>
          <span aria-hidden="true">
            {{ menuOpened() ? '×' : '☰' }}
          </span>
        </button>
      </nav>
    </header>

    <main id="conteudo">
      <!-- HERO: apresenta a proposta principal do QualyPosto. -->
      <section
        class="hero dark"
        id="inicio"
        aria-labelledby="hero-title"
      >
        <div class="hero-glow" aria-hidden="true"></div>

        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow hero-enter">
              <span class="line"></span>
              CONTROLE QUE VAI ALÉM DO POSTO
            </p>

            <h1 id="hero-title" class="hero-enter">
              Evite multas<br>
              <span>Da ANP e INMETRO.</span><br>

            </h1>

            <p class="hero-description hero-enter">
              Recebimentos, conformidade e gestão em uma solução
              criada exclusivamente para postos de combustíveis.
            </p>

            <div class="hero-enter">
              <button
                class="button"
                type="button"
                (click)="openContact($event)"
              >
                <svg
                  class="whatsapp-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.247-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 7.021 2.91 9.825 9.825 0 0 1 2.9 7.01c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.3-1.652a11.867 11.867 0 0 0 5.693 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.484-8.415Z"
                  />
                </svg>
                Quero conhecer o QualyPosto
                <span class="button-arrow" aria-hidden="true">↗</span>
              </button>

              <p class="hero-micro">
                Desenvolvido pela <strong>Indicemor.</strong>
              </p>
            </div>
          </div>

          <div class="hero-art">
            <img
              class="hero-background"
              src="assets/ecosystem.png?v=439253c9"
              alt=""
              width="1872"
              height="941"
              fetchpriority="high"
            >



            <span class="mock-caption">
              Visualização ilustrativa do ecossistema
            </span>
          </div>
        </div>

        <div class="container hero-bottom">
          <span>ESPECIALIZADO NO SETOR DE COMBUSTÍVEIS</span>

          <a href="#solucao">
            Conheça o ecossistema
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <!-- PROBLEMA: destaca as dificuldades da operação sem controle centralizado. -->
      <section class="section problem">
        <div class="container split">
          <div>
            <p class="eyebrow">
              O QUE VOCÊ NÃO VÊ TAMBÉM IMPORTA
            </p>

            <h2>
              Seu posto não para.<br>
              <span class="muted">As dúvidas também não?</span>
            </h2>

            <p class="body-copy">
              Quando a informação fica no papel, em conversas ou na
              memória da equipe, acompanhar a operação vira um
              trabalho à parte.
            </p>
          </div>

          <div class="question-list">
            @for (
              question of questions;
              track question;
              let index = $index
            ) {
              <div class="question reveal">
                <span class="index">0{{ index + 1 }}</span>
                <p>{{ question }}</p>
                <span class="question-mark" aria-hidden="true">?</span>
              </div>
            }
          </div>
        </div>

        <div class="container transition-statement">
          <p>
            Controle começa quando o que acontece no posto<br>
            <strong>deixa de ficar apenas no posto.</strong>
          </p>

          <span class="blue-rule" aria-hidden="true"></span>
        </div>
      </section>

      <!-- ECOSSISTEMA: apresenta os dois modulos centrais da solucao. -->
      <section class="section ecosystem" id="solucao">
        <div class="container">
          <div class="section-head ecosystem-heading">
            <div>
              <p class="eyebrow">
                DOIS M&Oacute;DULOS. UM S&Oacute; ECOSSISTEMA.
              </p>

              <h2>
                Recebimento e checklist.<br>
                Do campo &agrave; decis&atilde;o.
              </h2>
            </div>

            <p>
              Processos guiados no posto, evid&ecirc;ncias organizadas
              e uma vis&atilde;o gerencial que transforma cada registro
              em controle operacional.
            </p>
          </div>

          <div class="ecosystem-card-grid">
            <a class="ecosystem-card ecosystem-card--receiving" href="#recebimento">
              <div class="ecosystem-card-top">
                <span class="ecosystem-card-number">01</span>
                <span class="ecosystem-card-link">
                  Explorar m&oacute;dulo
                  <span aria-hidden="true">&#8599;</span>
                </span>
              </div>

              <div class="ecosystem-card-heading">
                <span class="ecosystem-card-icon" aria-hidden="true">REC</span>
                <div>
                  <p class="micro-label">QUALYPOSTO RECEBIMENTO</p>
                  <h3>Recebimento</h3>
                </div>
              </div>

              <p class="ecosystem-card-summary">
                Padronize a confer&ecirc;ncia da entrega, documente a
                qualidade do combust&iacute;vel e mantenha todo o
                hist&oacute;rico pronto para consulta.
              </p>

              <ul class="ecosystem-feature-list">
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Verifica&ccedil;&atilde;o de lacre automatizada</strong>
                    <span>Oriente a confer&ecirc;ncia e registre diverg&ecirc;ncias antes da descarga.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Evid&ecirc;ncias por fotos e v&iacute;deos</strong>
                    <span>Centralize as m&iacute;dias vinculadas ao recebimento e preserve a rastreabilidade.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Vis&atilde;o gerencial web</strong>
                    <span>Acompanhe status, resultados e hist&oacute;rico por unidade ou por toda a rede.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Registro de amostra-testemunha</strong>
                    <span>Documente identifica&ccedil;&atilde;o, armazenamento e v&iacute;nculo com cada entrega.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>RAQ digital automatizado</strong>
                    <span>Gere o registro de an&aacute;lise da qualidade com dados preenchidos automaticamente.</span>
                  </div>
                </li>
              </ul>
            </a>

            <a class="ecosystem-card ecosystem-card--checklist" href="#checklist">
              <div class="ecosystem-card-top">
                <span class="ecosystem-card-number">02</span>
                <span class="ecosystem-card-link">
                  Explorar m&oacute;dulo
                  <span aria-hidden="true">&#8599;</span>
                </span>
              </div>

              <div class="ecosystem-card-heading">
                <span class="ecosystem-card-icon" aria-hidden="true">CHK</span>
                <div>
                  <p class="micro-label">QUALYPOSTO CHECKLIST</p>
                  <h3>Checklist</h3>
                </div>
              </div>

              <p class="ecosystem-card-summary">
                Estruture inspe&ccedil;&otilde;es, conduza a equipe durante
                a execu&ccedil;&atilde;o e acompanhe a conformidade em um
                painel central.
              </p>

              <ul class="ecosystem-feature-list">
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>M&oacute;dulo mobile para coleta</strong>
                    <span>Registre respostas, observa&ccedil;&otilde;es e evid&ecirc;ncias diretamente no posto.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>M&oacute;dulo gerencial web</strong>
                    <span>Crie modelos, distribua checklists, acompanhe a execu&ccedil;&atilde;o e compare unidades em um painel.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Relat&oacute;rio de conformidade</strong>
                    <span>Consolide itens conformes, n&atilde;o conformidades, evid&ecirc;ncias e respons&aacute;veis.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Tutorial automatizado de preenchimento</strong>
                    <span>Guie o operador, reduza d&uacute;vidas e padronize a execu&ccedil;&atilde;o de cada rotina.</span>
                  </div>
                </li>
                <li>
                  <span class="ecosystem-feature-dot" aria-hidden="true"></span>
                  <div>
                    <strong>Categoriza&ccedil;&atilde;o regulat&oacute;ria</strong>
                    <span>Organize perguntas por &oacute;rg&atilde;o, norma e frente de fiscaliza&ccedil;&atilde;o aplic&aacute;vel.</span>
                  </div>
                </li>
              </ul>
            </a>
          </div>

          <p class="ecosystem-included">
            <span aria-hidden="true">&#10003;</span>
            Dois m&oacute;dulos integrados.
            <strong>O Gerencial Web conecta opera&ccedil;&atilde;o, evid&ecirc;ncias e decis&atilde;o.</strong>
          </p>
        </div>
      </section>

      <!-- RECEBIMENTO: demonstra as etapas de análise do combustível. -->
      <section
        class="section fuel dark"
        id="recebimento"
      >
        <div class="fuel-backdrop" aria-hidden="true">
          <img
            src="assets/station.webp"
            alt=""
            width="1672"
            height="941"
            loading="lazy"
          >
        </div>

        <div class="container fuel-content">
          <div class="split fuel-heading">
            <div>
              <p class="eyebrow">
                01 / RECEBIMENTO DE COMBUSTÍVEL
              </p>

              <h2>
                Do caminhão ao tanque,<br>
                <span class="blue-text">cada detalhe importa.</span>
              </h2>
            </div>

            <p class="body-copy">
              Receber combustível exige mais do que conferir a
              entrega. Transforme os dados coletados em uma análise
              operacional de conformidade.
            </p>
          </div>

          <div class="receiving-demo">
            <div
              class="receiving-tabs"
              role="tablist"
              aria-label="Etapas do recebimento"
            >
              @for (
                step of receivingSteps;
                track step.title;
                let index = $index
              ) {
                <button
                  role="tab"
                  type="button"
                  [id]="'receiving-tab-' + index"
                  [attr.aria-selected]="receivingStep() === index"
                  [attr.tabindex]="receivingStep() === index ? 0 : -1"
                  [class.active]="receivingStep() === index"
                  (click)="receivingStep.set(index)"
                  (keydown)="navigateReceivingTabs($event, index)"
                >
                  <span>0{{ index + 1 }}</span>
                  {{ step.title }}
                  <span aria-hidden="true">↗</span>
                </button>
              }
            </div>

            <div
              class="receiving-panel"
              role="tabpanel"
              tabindex="0"
              [attr.aria-labelledby]="
                'receiving-tab-' + receivingStep()
              "
            >
              <div class="demo-toolbar">
                <span>QualyPosto / Recebimento</span>
                <span class="demo-label">TELA REAL DO APLICATIVO</span>
              </div>

              <div class="receiving-panel-grid">
                <div class="receipt-content">
                  <p class="micro-label">
                    {{ receivingSteps[receivingStep()].label }}
                  </p>

                  <h3>
                    {{ receivingSteps[receivingStep()].heading }}
                  </h3>

                  <p>
                    {{ receivingSteps[receivingStep()].text }}
                  </p>

                  <div class="analysis-results">
                    <div class="status-line good">
                      <span>✓</span>

                      <div>
                        <strong>Conforme</strong>
                        <p>Dados dentro das regras aplicáveis.</p>
                      </div>
                    </div>

                    <div class="status-line attention">
                      <span>!</span>

                      <div>
                        <strong>Não conforme</strong>
                        <p>Identifique o que precisa de atenção.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <figure class="real-mobile-showcase receiving-capture">
                  <img
                    src="assets/recebimento-mobile.png"
                    alt="Tela real de recebimento e análise de combustível do aplicativo QualyPosto"
                    width="473"
                    height="766"
                    loading="lazy"
                  >

                  <figcaption>
                    Interface real do aplicativo
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          <div class="fuel-foot">
            <span>
              NF-e
              <i>→</i>
              Informações
              <i>→</i>
              Recebimento
              <i>→</i>
              Análise
            </span>

            <p>
              Mais rastreabilidade desde a chegada do combustível.
            </p>
          </div>
        </div>
      </section>

      <!-- CHECKLIST: apresenta verificações personalizadas e evidências. -->
      <section class="section checklist" id="checklist">
        <div class="container split checklist-grid">
          <div class="checklist-visual">
            <div class="checklist-app">
              <img
                class="checklist-real-image"
                src="assets/checklist-mobile.png"
                alt="Tela real do QualyPosto Checklist exibindo itens, evidências e observação"
                width="425"
                height="861"
                loading="lazy"
              >
            </div>

            <div class="floating-note">
              <span class="note-icon" aria-hidden="true">✓</span>

              <div>
                <strong>Mais do que uma resposta.</strong>
                <span>Um registro com evidência.</span>
              </div>
            </div>
          </div>

          <div>
            <p class="eyebrow">
              02 / QUALYPOSTO CHECKLIST
            </p>

            <h2>
              Conformidade<br>
              que deixa<br>
              <span class="blue-text">evidências.</span>
            </h2>

            <p class="body-copy">
              Saiba o que foi verificado, quais itens precisam de
              atenção e quais registros sustentam cada resposta.
            </p>

            <div class="personalization">
              <h3>Seu processo. Seu checklist.</h3>

              <p>
                Escolha perguntas, adapte os itens e adicione novas
                verificações à realidade do seu posto.
              </p>
            </div>

            <div class="area-tags">
              @for (area of checklistAreas; track area) {
                <span>{{ area }}</span>
              }
            </div>

            <p class="small-note">
              Uma rotina de acompanhamento que pode ser atualizada
              em cada item.
            </p>
          </div>
        </div>
      </section>

      <!-- EVIDÊNCIAS: mostra os registros que comprovam a execução. -->
      <section class="section evidence">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">O REGISTRO FALA POR SI</p>

              <h2>
                Não apenas marque.<br>
                Mostre o que aconteceu.
              </h2>
            </div>

            <p>
              Fotos, vídeos e observações ligados ao processo.
              Mais contexto para acompanhar e mais rastreabilidade
              para consultar.
            </p>
          </div>

          <figure class="evidence-image">
            <img
              src="assets/station.webp"
              alt="Posto usado como exemplo de registro operacional"
              width="1672"
              height="941"
              loading="lazy"
            >

            <div class="evidence-image-top">
              <span class="evidence-badge">
                EVIDÊNCIA FOTOGRÁFICA
              </span>
            </div>

            <figcaption>
              <div>
                <span>DATA</span>
                <strong>11/09/2026</strong>
              </div>

              <div>
                <span>HORÁRIO</span>
                <strong>18:42</strong>
              </div>

              <div>
                <span>LOCALIZAÇÃO</span>
                <strong>Unidade ilustrativa</strong>
              </div>

              <span class="sample-label">
                Registro demonstrativo
              </span>
            </figcaption>
          </figure>

          <div class="evidence-foot">
            <p>
              As fotografias podem incluir
              <strong>data, hora e localização.</strong>
            </p>

            <span>FOTOS + VÍDEOS + OBSERVAÇÕES</span>
          </div>
        </div>
      </section>

      <!-- GERENCIAL: simula filtros e consultas do painel web. -->
      <section
        class="section dashboard-section dark"
        id="gerencial"
      >
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">03 / GERENCIAL WEB</p>

              <h2>
                O funcionário executa.<br>
                <span class="blue-text">Você acompanha.</span>
              </h2>
            </div>

            <p>
              Veja o todo. Consulte cada unidade. Recebimentos,
              checklists e evidências organizados para você saber
              o que acontece, mesmo de longe.
            </p>
          </div>

          <div class="dashboard-shell">
            <aside class="dashboard-side">
              <div class="dash-brand">◉</div>

              <span class="side-active">
                ▦ <span>Visão geral</span>
              </span>

              <span>▤ <span>Recebimentos</span></span>
              <span>☑ <span>Checklists</span></span>
              <span>⌖ <span>Unidades</span></span>

              <div class="sidebar-bottom">
                QUALYPOSTO
                <span>GERENCIAL</span>
              </div>
            </aside>

            <div class="dashboard-main">
              <div class="dashboard-top">
                <div>
                  <p>GERENCIAL WEB</p>
                  <h3>Visão da operação</h3>
                </div>

                <label class="unit-select">
                  <span>Unidade</span>

                  <select
                    [value]="selectedUnit()"
                    (change)="changeUnit($event)"
                  >
                    @for (unit of units; track unit) {
                      <option [value]="unit">{{ unit }}</option>
                    }
                  </select>
                </label>
              </div>

              <div class="dash-overview">
                <div>
                  <span>Recebimentos</span>
                  <strong>
                    Operação registrada
                    <i>↗</i>
                  </strong>
                </div>

                <div>
                  <span>Checklists</span>
                  <strong>
                    Conformidade em foco
                    <i>✓</i>
                  </strong>
                </div>

                <div>
                  <span>Unidades</span>
                  <strong>
                    {{
                      selectedUnit() === 'Todas as unidades'
                        ? 'Visão centralizada'
                        : selectedUnit()
                    }}
                    <i>⌖</i>
                  </strong>
                </div>
              </div>

              <div
                class="dash-tabs"
                aria-label="Tipo de registro"
              >
                @for (tab of dashboardTabs; track tab) {
                  <button
                    type="button"
                    [class.active]="selectedDashboardTab() === tab"
                    [attr.aria-pressed]="
                      selectedDashboardTab() === tab
                    "
                    (click)="changeDashboardTab(tab)"
                  >
                    {{ tab }}
                  </button>
                }
              </div>

              <div class="table-scroll">
                <table>
                  <caption class="sr-only">
                    Registros demonstrativos filtrados por unidade
                  </caption>

                  <thead>
                    <tr>
                      <th>Unidade</th>
                      <th>Processo</th>
                      <th>Status</th>
                      <th>
                        <span class="sr-only">Consultar</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (
                      record of filteredDashboardRecords();
                      track record.unit + record.subject
                    ) {
                      <tr>
                        <td>{{ record.unit }}</td>
                        <td>{{ record.subject }}</td>

                        <td>
                          <span
                            class="status"
                            [class.good]="record.status === 'Conforme'"
                            [class.attention]="
                              record.status === 'Atenção'
                            "
                          >
                            {{ record.status }}
                          </span>
                        </td>

                        <td>
                          <button
                            class="row-open"
                            type="button"
                            [attr.aria-expanded]="
                              expandedRecord() === record
                            "
                            [attr.aria-label]="
                              'Consultar ' +
                              record.subject +
                              ' de ' +
                              record.unit
                            "
                            (click)="toggleRecord(record)"
                          >
                            {{
                              expandedRecord() === record
                                ? '−'
                                : '↗'
                            }}
                          </button>
                        </td>
                      </tr>

                      @if (expandedRecord() === record) {
                        <tr class="detail-row">
                          <td colspan="4">
                            <strong>
                              {{ record.type }} / {{ record.unit }}
                            </strong>

                            <p>{{ record.detail }}</p>

                            <span>
                              Exemplo ilustrativo de consulta
                              individual.
                            </span>
                          </td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>

              <div class="dashboard-disclaimer">
                <span>
                  Interface demonstrativa · unidades e registros
                  fictícios
                </span>

                <span>
                  Selecione uma unidade para explorar
                  <i>↑</i>
                </span>
              </div>
            </div>
          </div>

          <div class="dashboard-route">
            <span>VISÃO GERAL</span>
            <i>→</i>
            <span>UNIDADE</span>
            <i>→</i>
            <span>PROCESSO</span>
            <i>→</i>
            <span>EVIDÊNCIA</span>
          </div>
        </div>
      </section>

      <!-- REDE: representa a visão centralizada de várias unidades. -->
      <section class="section network dark">
        <div class="container split">
          <div>
            <p class="eyebrow">
              DO PRIMEIRO POSTO À REDE INTEIRA
            </p>

            <h2>
              Mais unidades.<br>
              A mesma visão<br>
              <span class="blue-text">centralizada.</span>
            </h2>

            <p class="body-copy">
              Acompanhe a operação de forma geral ou entre nos
              detalhes de cada posto, sem perder o contexto.
            </p>
          </div>

          <div
            class="network-diagram"
            aria-label="Unidades conectadas ao Gerencial"
          >
            <svg
              class="network-lines"
              viewBox="0 0 560 320"
              aria-hidden="true"
            >
              <path
                d="M80 65C80 160 280 80 280 160
                   M480 65C480 160 280 80 280 160
                   M80 255C80 160 280 240 280 160
                   M480 255C480 160 280 240 280 160"
              />
            </svg>

            @for (
              unit of networkUnits;
              track unit;
              let index = $index
            ) {
              <button
                type="button"
                class="network-node"
                [class]="'network-node node-' + index"
                [class.selected]="selectedNetworkUnit() === index"
                [attr.aria-pressed]="
                  selectedNetworkUnit() === index
                "
                (click)="selectedNetworkUnit.set(index)"
              >
                <span aria-hidden="true">⌖</span>
                {{ unit }}
              </button>
            }

            <div class="network-center">
              <span class="blue-text">◉</span>
              <strong>QualyPosto</strong>
              <span>GERENCIAL</span>
            </div>

            <p class="network-description">
              {{ networkUnits[selectedNetworkUnit()] }} ·
              registros e evidências na visão individual
            </p>

            <p class="network-caption">
              Unidades ilustrativas
            </p>
          </div>
        </div>
      </section>

      <!-- FLUXO: explica como os dados saem da operação e chegam à gestão. -->
      <section class="section workflow">
        <div class="container">
          <p class="eyebrow">DO CAMPO À DECISÃO</p>

          <h2>
            Uma operação.<br>
            Um caminho claro até você.
          </h2>

          <div class="workflow-track">
            @for (
              step of workflowSteps;
              track step.title;
              let index = $index
            ) {
              <div class="workflow-step">
                <span class="workflow-point">
                  0{{ index + 1 }}
                </span>

                <span class="micro-label">{{ step.label }}</span>

                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </div>
            }
          </div>

          <div class="workflow-summary">
            <strong>
              Campo → Registro → Validação → Conformidade →
              Dados → Gestão
            </strong>

            <p>
              A equipe registra. O QualyPosto organiza.
              Você acompanha.
            </p>
          </div>
        </div>
      </section>

      <!-- BENEFÍCIOS: lista os ganhos práticos para o gestor. -->
      <section
        class="section benefits"
        id="beneficios"
      >
        <div class="container split">
          <div class="benefits-intro">
            <p class="eyebrow">
              O QUE MUDA NA SUA ROTINA
            </p>

            <h2>
              Menos incerteza.<br>
              Mais domínio<br>
              da operação.
            </h2>

            <p class="body-copy">
              Controle é conseguir responder às perguntas certas
              com informação à mão.
            </p>
          </div>

          <div class="benefit-list">
            @for (
              benefit of benefits;
              track benefit.title;
              let index = $index
            ) {
              <article>
                <span class="index">0{{ index + 1 }}</span>

                <div>
                  <h3>{{ benefit.title }}</h3>
                  <p>{{ benefit.text }}</p>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- PLANOS: apresenta os modulos individuais e a solução completa. -->
      <section class="section pricing" id="planos" aria-labelledby="pricing-title">
        <div class="pricing-orbit pricing-orbit--one" aria-hidden="true"></div>
        <div class="pricing-orbit pricing-orbit--two" aria-hidden="true"></div>
        <div class="container pricing-container">
          <div class="pricing-heading">
            <div>
              <p class="eyebrow">ESCOLHA O NÍVEL DE CONTROLE</p>
              <h2 id="pricing-title">Comece por um modulo.<br><span>Ou conecte toda a operação.</span></h2>
            </div>
            <p>Tecnologia especializada para transformar rotinas criticas do posto em processos rastreaveis, padronizados e faceis de acompanhar.</p>
          </div>

          <div class="pricing-grid">
            <article class="price-card price-card--receiving">
              <div class="price-card-topline">
                <span class="price-card-code">01 / REC</span>
                <span class="price-card-status">MODULO INDIVIDUAL</span>
              </div>
              <div class="price-card-icon" aria-hidden="true"><span>REC</span><i></i></div>
              <p class="micro-label">QUALYPOSTO</p>
              <h3>Recebimento</h3>
              <p class="price-card-description">Segurança e rastreabilidade da chegada do caminho ate a liberação do combustivel.</p>
              <ul class="price-feature-list">
                <li><span aria-hidden="true"></span> Recebimento automatizado do combustível</li>
                <li><span aria-hidden="true"></span> Identificação automática dos produtos na nota fiscal</li>
                <li><span aria-hidden="true"></span> Controle dos tanques de combustíveis</li>
                <li><span aria-hidden="true"></span> Direcionamento dos combustíveis para os tanques registrados</li>
                <li><span aria-hidden="true"></span> Análise dos combustíveis a poucos cliques</li>
                <li><span aria-hidden="true"></span> Geração automatizada do RAQ digital</li>
                <li><span aria-hidden="true"></span> Controle do recebimento e guarda das amostras testemunhas</li>
                <li><span aria-hidden="true"></span> Controle gerencial via Web</li>
                <li><span aria-hidden="true"></span> Identificação do posto por mapa de geolocalização</li>
                <li><span aria-hidden="true"></span> Identificação do tanque de descarga por combustível</li>
                <li><span aria-hidden="true"></span> Registro de guarda de amostra testemunha</li>
                <li><span aria-hidden="true"></span> Conexão amostra testemunha, tanque e nota fiscal</li>
                <li><span aria-hidden="true"></span> Identificação de eventos por posto e data</li>
                <li><span aria-hidden="true"></span> Impressão do RAQ</li>
                <li><span aria-hidden="true"></span> Controle histórico dos recebimentos de combustíveis</li>
              </ul>
              <div class="price-card-footer">
                <div class="price-value"><span>Investimento</span><strong><sup>R$</sup> 450<small>/mês</small></strong></div>
                <button class="price-action" type="button" (click)="openContact($event)">
                  Quero este modulo
                </button>
              </div>
            </article>

            <article class="price-card price-card--checklist">
              <div class="price-card-topline">
                <span class="price-card-code">02 / CHK</span>
                <span class="price-card-status">MODULO INDIVIDUAL</span>
              </div>
              <div class="price-card-icon" aria-hidden="true"><span>CHK</span><i></i></div>
              <p class="micro-label">QUALYPOSTO</p>
              <h3>Checklist</h3>
              <p class="price-card-description">Inspeções guiadas para elevar o padrão da equipe e enxergar não conformidades com rapidez.</p>
              <ul class="price-feature-list">
                <li><span aria-hidden="true"></span> Garantia de conformidades perante os órgãos reguladores</li>
                <li><span aria-hidden="true"></span> Verificação das exigências legais: ANP, INMETRO, PROCON, trabalhistas, órgãos ambientais, regularidades fiscais, bombeiros e demais órgãos de fiscalização</li>
                <li><span aria-hidden="true"></span> Registros das verificações com imagens e vídeos</li>
                <li><span aria-hidden="true"></span> Registros descritivos das irregularidades</li>
                <li><span aria-hidden="true"></span> Controle gerencial via painel Web</li>
                <li><span aria-hidden="true"></span> Visão administrativa das evoluções e correções das não conformidades</li>
                <li><span aria-hidden="true"></span> Visão em dashboards</li>
                <li><span aria-hidden="true"></span> Mapas geográficos dos postos</li>
                <li><span aria-hidden="true"></span> Apontamentos visuais de irregularidades por posto</li>
                <li><span aria-hidden="true"></span> Relatórios individualizados por varredura</li>
                <li><span aria-hidden="true"></span> Certificação das execuções por georreferenciamento</li>
              </ul>
              <div class="price-card-footer">
                <div class="price-value"><span>Investimento</span><strong><sup>R$</sup> 750<small>/mês</small></strong></div>
                <button class="price-action" type="button" (click)="openContact($event)">
                  Quero este modulo
                </button>
              </div>
            </article>

            <article class="price-card price-card--combo">
              <div class="combo-ribbon"><span>RECOMENDADO</span><strong>ECONOMIZE R$ 100</strong></div>
              <div class="price-card-topline">
                <span class="price-card-code">01 + 02</span>
                <span class="price-card-status">ECOSSISTEMA COMPLETO</span>
              </div>
              <div class="combo-symbol" aria-hidden="true"><span>REC</span><i>+</i><span>CHK</span></div>
              <p class="micro-label">QUALYPOSTO COMPLETO</p>
              <h3>Combo</h3>
              <p class="price-card-description">Recebimento e Checklist trabalhando juntos para uma visão gerencial unica de toda a operação.</p>
              <ul class="price-feature-list">
                <li><span aria-hidden="true"></span> Todos os recursos dos dois módulos</li>
                <li><span aria-hidden="true"></span> Indicadores e evidências de toda a rede</li>
                <li><span aria-hidden="true"></span> Mais contexto para controlar toda a rede</li>
              </ul>
              <div class="price-card-footer">
                <div class="price-value"><span>Investimento</span><strong><sup>R$</sup> 1.100<small>/mês</small></strong></div>
                <button class="price-action" type="button" (click)="openContact($event)">
                  Quero controle completo
                </button>
              </div>
            </article>
          </div>

          <p class="pricing-note">

            Não sabe qual formato combina com a sua operação?
            <button type="button" (click)="openContact($event)">Fale com um especialista.</button>
          </p>
        </div>
      </section>
      <!-- DIFERENCIAIS: reúne os principais recursos da plataforma. -->
      <section class="section differentials">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">POR QUE QUALYPOSTO</p>

              <h2>
                Não começa no software.<br>
                Começa no seu posto.
              </h2>
            </div>

            <p>
              Uma solução desenvolvida pela Indicemor para conectar
              os detalhes da operação à visão de quem gerencia.
            </p>
          </div>

          <div class="difference-grid">
            <div class="difference-major">
              <span class="micro-label">ESPECIALIZAÇÃO</span>

              <h3>
                O setor de combustíveis está no centro de cada
                processo.
              </h3>

              <p>
                Do recebimento ao checklist, o QualyPosto foi
                pensado para a realidade dos postos brasileiros.
              </p>
            </div>

            <div class="difference-rows">
              @for (
                item of differentials;
                track item;
                let index = $index
              ) {
                <div>
                  <span>0{{ index + 1 }}</span>
                  <strong>{{ item }}</strong>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- IMPACTO: reforça o resultado central da solução. -->
      <section class="impact dark">
        <div class="container">
          <p>
            Seu posto já gera informação todos os dias.
          </p>

          <h2>
            Transforme essa<br>
            informação em<br>
            <span class="impact-word">controle.</span>
          </h2>
        </div>
      </section>

      <!-- FAQ: responde às dúvidas mais comuns sobre o produto. -->
      <section class="section faq" id="duvidas">
        <div class="container split">
          <div>
            <p class="eyebrow">ANTES DE CONVERSARMOS</p>

            <h2>
              Vamos deixar<br>
              tudo claro.
            </h2>

            <p class="body-copy">
              Respostas para as principais dúvidas sobre o
              QualyPosto.
            </p>
          </div>

          <div class="faq-list">
            @for (faq of faqs; track faq.question) {
              <details name="qualyposto-faq">
                <summary>
                  {{ faq.question }}
                  <span aria-hidden="true">+</span>
                </summary>

                <p>{{ faq.answer }}</p>
              </details>
            }
          </div>
        </div>
      </section>

      <!-- CTA FINAL: direciona o visitante para o contato comercial. -->
      <section class="final-cta" id="contato">
        <div class="container final-grid">
          <div>
            <p class="eyebrow">
              SEU POSTO. SUA OPERAÇÃO. SEU CONTROLE.
            </p>

            <h2>
              Mais visibilidade.<br>
              Mais controle.<br>
              <span>Comece por aqui.</span>
            </h2>

            <p>
              Fale com nossa equipe e entenda como o QualyPosto pode
              ser aplicado à sua operação.
            </p>

            <button
              type="button"
              class="button button-light"
              (click)="openContact($event)"
            >
              Falar com a equipe QualyPosto
              <span class="button-arrow" aria-hidden="true">↗</span>
            </button>
          </div>

          <div class="final-art">
            <img
              src="assets/ecosystem.png?v=439253c9"
              alt="Ecossistema QualyPosto"
              width="1672"
              height="941"
              loading="lazy"
            >

            <span>DO RECEBIMENTO À DECISÃO.</span>
          </div>
        </div>
      </section>
    </main>

    <!-- RODAPÉ: reúne marca, atalhos e informações institucionais. -->
    <footer class="footer dark">
      <div class="container footer-top">
        <a href="#inicio" aria-label="Voltar ao início">
          <img
            class="footer-logo"
            src="assets/qualyposto-logo.png"
            alt="QualyPosto"
            width="500"
            height="244"
          >
        </a>

        <p>
          Operação, conformidade e gestão<br>
          para postos de combustíveis.
        </p>

        <span class="indicemor">
          Desenvolvido pela
          <strong>Indicemor.</strong>
        </span>
      </div>

      <div class="container footer-bottom">
        <span>© 2026 QualyPosto.</span>

        <nav aria-label="Links do rodapé">
          <a href="#solucao">Solução</a>
          <a href="#duvidas">Dúvidas</a>
          <button type="button" (click)="openPrivacy()">
            Privacidade
          </button>
          <a href="#contato">Contato</a>
        </nav>

        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>

    <!-- CONTATO: alternativa quando o WhatsApp não está configurado. -->
    <dialog
      id="contact-dialog"
      class="text-dialog"
      aria-labelledby="contact-title"
    >
      <button
        type="button"
        class="dialog-close"
        aria-label="Fechar contato"
        (click)="closeDialog('contact-dialog')"
      >
        ×
      </button>

      <p class="eyebrow">QUALYPOSTO</p>

      <h2 id="contact-title">
        Vamos conversar<br>
        sobre seu posto.
      </h2>

      @if (!whatsappUrl) {
        <p>
          O número comercial ainda não foi configurado.
          Você pode copiar a mensagem abaixo.
        </p>

        <blockquote>
          {{ whatsappMessage }}
        </blockquote>

        <button
          type="button"
          class="button"
          (click)="copyContactMessage()"
        >
          {{
            messageCopied()
              ? 'Mensagem copiada ✓'
              : 'Copiar mensagem'
          }}
        </button>

        <p class="small-note" aria-live="polite">
          {{
            messageCopied()
              ? 'Mensagem copiada para a área de transferência.'
              : ''
          }}
        </p>
      }
    </dialog>

    <!-- PRIVACIDADE: informa como a página trata os dados do visitante. -->
    <dialog
      id="privacy-dialog"
      class="text-dialog"
      aria-labelledby="privacy-title"
    >
      <button
        type="button"
        class="dialog-close"
        aria-label="Fechar privacidade"
        (click)="closeDialog('privacy-dialog')"
      >
        ×
      </button>

      <p class="eyebrow">PRIVACIDADE</p>

      <h2 id="privacy-title">
        Sobre esta página.
      </h2>

      <p>
        Esta página apresenta o QualyPosto e não solicita cadastro
        nem dados pessoais por meio de formulários.
      </p>

      <p>
        Ao seguir um link para o WhatsApp, você acessa um serviço
        externo. As informações compartilhadas serão tratadas nesse
        canal.
      </p>

      <button
        type="button"
        class="button"
        (click)="closeDialog('privacy-dialog')"
      >
        Entendido
      </button>
    </dialog>
  `
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);

  // Estados que controlam menu, seleções e elementos interativos.
  readonly menuOpened = signal(false);
  readonly messageCopied = signal(false);
  readonly receivingStep = signal(0);
  readonly selectedUnit = signal('Todas as unidades');
  readonly selectedDashboardTab = signal('Todos os registros');
  readonly selectedNetworkUnit = signal(0);

  readonly whatsappUrl = getWhatsAppUrl();
  readonly whatsappMessage = SITE_CONFIG.whatsappMessage;

  // Conteúdo usado para montar as seções repetidas do template.
  readonly questions = [
    'O procedimento foi realmente executado?',
    'O combustível chegou em conformidade?',
    'Onde estão as evidências do checklist?',
    'Qual unidade precisa da sua atenção?'
  ];

  readonly checklistAreas = [
    'ANP',
    'INMETRO',
    'Bombeiros',
    'Ambiental',
    'Procon',
    'SEFAZ',
    'Vigilância Sanitária',
    'Segurança do Trabalho'
  ];

  readonly receivingSteps: ReceivingStep[] = [
    {
      title: 'Identificar',
      label: 'CAPTURA VIA NF-e',
      heading: 'A informação começa na origem.',
      text:
        'Capture automaticamente os dados da nota fiscal a partir ' +
        'da NF-e, reduzindo o preenchimento manual.'
    },
    {
      title: 'Conferir',
      label: 'DADOS DO RECEBIMENTO',
      heading: 'Cada conferência fica registrada.',
      text:
        'Reúna fornecedor, transportadora, motorista, veículo, ' +
        'volumes, compartimentos e lacres.'
    },
    {
      title: 'Analisar',
      label: 'REGRAS RELACIONADAS À ANP',
      heading: 'Registrar é só o começo.',
      text:
        'Os dados informados são analisados com regras relacionadas ' +
        'à ANP para indicar a conformidade do recebimento.'
    },
    {
      title: 'Consultar',
      label: 'HISTÓRICO DE RECEBIMENTOS',
      heading: 'A entrega termina. O registro fica.',
      text:
        'Consulte recebimentos anteriores e suas informações no ' +
        'Gerencial.'
    }
  ];

  readonly units = [
    'Todas as unidades',
    'Posto Centro',
    'Posto Norte',
    'Posto Rodovia',
    'Posto Sul'
  ];

  readonly networkUnits = [
    'Posto Centro',
    'Posto Norte',
    'Posto Rodovia',
    'Posto Sul'
  ];

  readonly dashboardTabs = [
    'Todos os registros',
    'Recebimentos',
    'Checklists'
  ];

  readonly records: DashboardRecord[] = [
    {
      unit: 'Posto Centro',
      type: 'Recebimentos',
      subject: 'Recebimento de diesel S10',
      status: 'Conforme',
      detail:
        'Informações da NF-e, transportadora, volumes e análise ' +
        'reunidas no mesmo registro.'
    },
    {
      unit: 'Posto Norte',
      type: 'Checklists',
      subject: 'Checklist de conformidade',
      status: 'Atenção',
      detail:
        'Item com necessidade de acompanhamento, observações e ' +
        'evidências registradas pela equipe.'
    },
    {
      unit: 'Posto Rodovia',
      type: 'Recebimentos',
      subject: 'Recebimento de gasolina',
      status: 'Conforme',
      detail:
        'Registro do recebimento disponível para consulta no ' +
        'histórico da unidade.'
    },
    {
      unit: 'Posto Sul',
      type: 'Checklists',
      subject: 'Verificação operacional',
      status: 'Conforme',
      detail:
        'Verificação acompanhada de registro fotográfico e ' +
        'observações.'
    },
    {
      unit: 'Posto Norte',
      type: 'Recebimentos',
      subject: 'Recebimento de etanol',
      status: 'Conforme',
      detail:
        'Dados operacionais e análise de conformidade disponíveis ' +
        'na visão da unidade.'
    },
    {
      unit: 'Posto Centro',
      type: 'Checklists',
      subject: 'Checklist de segurança',
      status: 'Conforme',
      detail:
        'Evidências e observações organizadas por item.'
    }
  ];

  readonly expandedRecord = signal<DashboardRecord | null>(null);

  // Filtra os registros do painel conforme unidade e tipo selecionados.
  readonly filteredDashboardRecords = computed(() => {
    return this.records.filter(record => {
      const matchesUnit =
        this.selectedUnit() === 'Todas as unidades' ||
        record.unit === this.selectedUnit();

      const matchesType =
        this.selectedDashboardTab() === 'Todos os registros' ||
        record.type === this.selectedDashboardTab();

      return matchesUnit && matchesType;
    });
  });

  readonly workflowSteps = [
    {
      label: 'FUNCIONÁRIO + APLICATIVO',
      title: 'A operação acontece.',
      text:
        'No posto, a equipe registra recebimentos e realiza ' +
        'verificações.'
    },
    {
      label: 'REGISTRO + EVIDÊNCIA',
      title: 'O processo ganha contexto.',
      text:
        'Informações, fotos, vídeos e observações ficam ligados à ' +
        'operação.'
    },
    {
      label: 'QUALYPOSTO + GERENCIAL',
      title: 'A informação se conecta.',
      text:
        'Os registros são organizados para consulta geral ou por ' +
        'unidade.'
    },
    {
      label: 'PROPRIETÁRIO',
      title: 'Você enxerga o que importa.',
      text:
        'Consulte o que foi realizado e identifique pontos de ' +
        'atenção.'
    }
  ];

  readonly benefits = [
    {
      title: 'Visibilidade, mesmo de longe.',
      text:
        'Saiba o que acontece no posto sem depender de mensagens ' +
        'soltas e atualizações informais.'
    },
    {
      title: 'Rastreabilidade em cada processo.',
      text:
        'Consulte os registros e as evidências associados ao que ' +
        'foi executado.'
    },
    {
      title: 'Uma rotina mais padronizada.',
      text:
        'Transforme verificações importantes em processos ' +
        'estruturados.'
    },
    {
      title: 'Atenção onde ela é necessária.',
      text:
        'Identifique inconformidades e pontos que precisam de ' +
        'acompanhamento.'
    },
    {
      title: 'Informação em um só lugar.',
      text:
        'Reúna unidades, recebimentos, checklists e evidências na ' +
        'visão do proprietário.'
    }
  ];

  readonly differentials = [
    'Operação, conformidade e gestão integradas.',
    'Captura automática de dados a partir da NF-e.',
    'Análise com regras relacionadas à ANP.',
    'Checklists moldáveis à sua rotina.',
    'Evidências e Gerencial sempre conectados.'
  ];

  readonly faqs = [
    {
      question: 'O QualyPosto funciona para um único posto?',
      answer:
        'Sim. A solução atende um único posto ou redes, permitindo ' +
        'consulta individual ou geral.'
    },
    {
      question: 'Preciso contratar os dois aplicativos?',
      answer:
        'Não. O aplicativo operacional e o QualyPosto Checklist ' +
        'podem ser contratados individualmente ou em conjunto.'
    },
    {
      question: 'O Gerencial Web está incluído?',
      answer:
        'Sim. O Gerencial acompanha a solução contratada e organiza ' +
        'as informações dos aplicativos.'
    },
    {
      question: 'Posso personalizar os checklists?',
      answer:
        'Sim. Você pode escolher perguntas, adaptar os itens e ' +
        'adicionar novas verificações.'
    },
    {
      question: 'Quais áreas podem ser acompanhadas?',
      answer:
        'ANP, INMETRO, Bombeiros, Ambiental, Procon, SEFAZ, ' +
        'Vigilância Sanitária e segurança trabalhista.'
    },
    {
      question: 'Posso registrar fotos e vídeos?',
      answer:
        'Sim. Os itens podem receber fotos, vídeos e observações. ' +
        'As fotografias podem conter data, horário e localização.'
    },
    {
      question: 'Existe histórico dos recebimentos?',
      answer:
        'Sim. Os recebimentos realizados ficam disponíveis para ' +
        'consulta. O checklist é atualizado nos próprios itens.'
    },
    {
      question: 'Como funciona a análise do combustível?',
      answer:
        'O sistema utiliza os dados do recebimento e regras ' +
        'relacionadas à ANP para indicar conformidade.'
    },
    {
      question: 'Como contratar?',
      answer:
        'Entre em contato com a equipe QualyPosto pelo WhatsApp.'
    }
  ];

  constructor() {
    // Inicia os efeitos visuais somente após a primeira renderização.
    afterNextRender(() => {
      this.initializeMotion();
    });
  }

  closeMenu(): void {
    this.menuOpened.set(false);
    document
      .querySelector<HTMLDetailsElement>('.nav-dropdown')
      ?.removeAttribute('open');
  }

  // Atualiza os filtros e detalhes da demonstração gerencial.
  changeUnit(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedUnit.set(select.value);
    this.expandedRecord.set(null);
  }

  changeDashboardTab(tab: string): void {
    this.selectedDashboardTab.set(tab);
    this.expandedRecord.set(null);
  }

  toggleRecord(record: DashboardRecord): void {
    this.expandedRecord.set(
      this.expandedRecord() === record ? null : record
    );
  }

  // Permite navegar pelas etapas de recebimento usando o teclado.
  navigateReceivingTabs(
    event: KeyboardEvent,
    currentIndex: number
  ): void {
    let nextIndex = currentIndex;

    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowDown'
    ) {
      nextIndex =
        (currentIndex + 1) % this.receivingSteps.length;
    } else if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowUp'
    ) {
      nextIndex =
        (currentIndex - 1 + this.receivingSteps.length) %
        this.receivingSteps.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = this.receivingSteps.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    this.receivingStep.set(nextIndex);

    document
      .getElementById(`receiving-tab-${nextIndex}`)
      ?.focus();
  }

  // Abre o WhatsApp ou exibe o diálogo com a mensagem de contato.
  openContact(event?: Event): void {
    if (this.whatsappUrl) {
      window.open(
        this.whatsappUrl,
        '_blank',
        'noopener,noreferrer'
      );

      return;
    }

    event?.preventDefault();

    const dialog = document.getElementById(
      'contact-dialog'
    ) as HTMLDialogElement | null;

    dialog?.showModal();
  }

  // Controla a abertura e o fechamento dos diálogos da página.
  openPrivacy(): void {
    const dialog = document.getElementById(
      'privacy-dialog'
    ) as HTMLDialogElement | null;

    dialog?.showModal();
  }

  closeDialog(id: string): void {
    const dialog = document.getElementById(
      id
    ) as HTMLDialogElement | null;

    dialog?.close();
  }

  async copyContactMessage(): Promise<void> {
    try {
      await navigator.clipboard.writeText(
        this.whatsappMessage
      );

      this.messageCopied.set(true);
    } catch {
      this.messageCopied.set(false);
    }
  }

  // Configura animações de entrada e efeitos ligados à rolagem.
  private initializeMotion(): void {
    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return;
    }

    let observer: IntersectionObserver | undefined;
    let frameId: number | undefined;
    let disposed = false;

    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.header');
    const parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.hero-art, .fuel-backdrop img, ' +
        '.evidence-image > img, .final-art img'
      )
    );

    const updateScrollEffects = (): void => {
      frameId = undefined;

      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(window.scrollY / scrollable, 1)
        : 0;

      root.style.setProperty(
        '--scroll-progress',
        `${progress * 100}%`
      );
      header?.classList.toggle('is-scrolled', window.scrollY > 12);

      const viewportCenter = window.innerHeight / 2;

      for (const element of parallaxElements) {
        const bounds = element.getBoundingClientRect();

        if (
          bounds.bottom < -120 ||
          bounds.top > window.innerHeight + 120
        ) {
          continue;
        }

        const elementCenter = bounds.top + bounds.height / 2;
        const distance = (elementCenter - viewportCenter) /
          window.innerHeight;
        const shift = Math.max(
          -24,
          Math.min(24, distance * -18)
        );

        element.style.setProperty(
          '--scroll-shift',
          `${shift.toFixed(2)}px`
        );
      }
    };

    const requestScrollUpdate = (): void => {
      if (frameId === undefined) {
        frameId = window.requestAnimationFrame(updateScrollEffects);
      }
    };

    window.addEventListener('scroll', requestScrollUpdate, {
      passive: true
    });
    window.addEventListener('resize', requestScrollUpdate);
    updateScrollEffects();

    import('animejs')
      .then(({ animate, stagger }) => {
        if (disposed) {
          return;
        }

        animate('.hero-enter', {
          opacity: [0, 1],
          translateY: [20, 0],
          delay: stagger(100),
          duration: 750,
          ease: 'out(3)'
        });

        animate('.hero-art', {
          opacity: [0, 1],
          scale: [1.04, 1],
          duration: 1300,
          ease: 'out(3)'
        });

        const revealSelectors = [
          '.problem .split > div',
          '.transition-statement',
          '.section-head > *',
          '.receiving-demo',
          '.fuel-foot',
          '.checklist-grid > div',
          '.evidence-image',
          '.evidence-foot',
          '.dashboard-shell',
          '.network .split > div',
          '.workflow-summary',
          '.difference-grid > *',
          '.faq .split > div',
          '.final-grid > *',
          '.footer-top > *'
        ].join(', ');

        const staggerSelectors = [
          '.question',
          '.ecosystem-card',
          '.workflow-step',
          '.benefit-list article',
          '.difference-rows > div'
        ].join(', ');

        const revealElements = Array.from(
          document.querySelectorAll<HTMLElement>(revealSelectors)
        );
        const staggerElements = Array.from(
          document.querySelectorAll<HTMLElement>(staggerSelectors)
        );
        const staggerDelay = new WeakMap<Element, number>();

        for (const element of staggerElements) {
          const siblings = Array.from(
            element.parentElement?.children ?? []
          ).filter(sibling => sibling.matches(staggerSelectors));
          const index = Math.max(0, siblings.indexOf(element));

          const delayStep = element.matches('.ecosystem-card') ? 150 : 85;
          staggerDelay.set(element, Math.min(index, 4) * delayStep);
        }

        const observedElements = Array.from(
          new Set([...revealElements, ...staggerElements])
        );

        observer = new IntersectionObserver(
          entries => {
            for (const entry of entries) {
              if (!entry.isIntersecting) {
                continue;
              }

              const element = entry.target as HTMLElement;
              const isEcosystemCard = element.matches('.ecosystem-card');

              animate(element, {
                opacity: [0, 1],
                translateY: isEcosystemCard ? [70, 0] : [30, 0],
                scale: isEcosystemCard ? [0.94, 1] : [0.985, 1],
                delay: staggerDelay.get(element) ?? 0,
                duration: isEcosystemCard ? 1100 : 850,
                ease: 'out(4)'
              });

              observer?.unobserve(element);
            }
          },
          {
            threshold: 0.12,
            rootMargin: '0px 0px -7% 0px'
          }
        );

        observedElements.forEach(
          element => observer?.observe(element)
        );

        const impactWord = document.querySelector('.impact-word');

        if (impactWord) {
          observer.observe(impactWord);
        }
      })
      .catch(() => {
        /*
         * A página permanece funcional caso a biblioteca de
         * animação não carregue.
         */
      });

    this.destroyRef.onDestroy(() => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', requestScrollUpdate);

      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId);
      }
    });
  }
}
