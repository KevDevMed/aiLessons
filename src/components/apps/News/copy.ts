type LessonKind = 'word' | 'phrase' | 'expression';

/**
 * News app copy is locked to Spanish. The News experience is built for
 * Spanish speakers learning English — every helper field produced by the
 * backend (`spanishMeaning`, `spanishExplanation`, `learningSpanishSummary`,
 * `exampleTranslation`) is Spanish by design, so a mixed EN/ES UI on top
 * of those felt incoherent. This file deliberately ignores the global
 * `useI18n()` toggle; other apps still follow it.
 */
const NEWS_COPY = {
  locale: 'es-ES',
  loadingArticles: 'Cargando noticias...',
  noArticlesTitle: 'Todavia no hay articulos',
  noArticlesText:
    'Las noticias de negocios e IA se actualizan automaticamente cada 24 horas. Vuelve pronto.',
  articleNotFoundTitle: 'Articulo no encontrado',
  articleNotFoundText: 'Es posible que este articulo ya no este disponible.',
  back: '< Volver',
  guidedReadingTitle: 'Aprende con esta noticia',
  guidedReadingSubtitle:
    'Apoyo en espanol y vocabulario util en ingles sacado del articulo.',
  summaryLabel: 'Resumen',
  vocabularyTitle: 'Vocabulario y expresiones',
  pronunciationLabel: 'Pronunciacion',
  meaningLabel: 'Significado',
  usageLabel: 'Como se usa',
  inArticleLabel: 'En la noticia',
  translationLabel: 'Traduccion',
  openOriginal: 'Abrir articulo original ->',
  analysisTitle: 'Analisis AI',
  analysisSummaryLabel: 'Resumen',
  whyItMattersLabel: 'Por que importa',
  opinionLabel: 'Lectura practica',
  learningItemsCount: (count: number) =>
    count === 1 ? '1 item para aprender' : `${count} items para aprender`,
  cardLearningCount: (count: number) =>
    count === 1 ? '1 palabra o expresion' : `${count} palabras y expresiones`,
  analysisUnavailableLabel: 'AI no disponible',
  relevanceLabel: (score: number) => `${score}/100 relevancia`,
  kindLabel: (kind: LessonKind) => {
    if (kind === 'word') return 'Palabra';
    if (kind === 'phrase') return 'Frase';
    return 'Expresion';
  },
  showMore: 'Ver mas articulos',
  imageUnavailable: 'Imagen no disponible',
  now: 'ahora',
  minutesAgo: (count: number) => `hace ${count} min`,
  hoursAgo: (count: number) => `hace ${count} h`,
  daysAgo: (count: number) => `hace ${count} d`,
  tabHome: 'Inicio',
  tabCloseAria: (title: string) => `Cerrar ${title}`,
} as const;

export function useNewsCopy() {
  return NEWS_COPY;
}
