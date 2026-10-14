import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { DEMO_QUERY, ROUTES } from '../../data/constants'
import { ESCOLAS, type Escola } from '../../data/escolas'
import { matchesQuery } from '../../lib/text'
import { useDemoStore } from '../../store/demoStore'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { DemoNote } from '../demo/DemoNote'
import { CancelIcon, EditIcon } from './icons'

/** Com mouse, o campo já começa focado. No celular, o teclado só abre quando a pessoa toca no campo. */
const hasFinePointer = () => window.matchMedia?.('(pointer: fine)').matches ?? true

/** Busca de escolas — reconstrução do slide 12. */
export function SearchPanel() {
  const navigate = useNavigate()
  const query = useDemoStore((state) => state.searchQuery)
  const setQuery = useDemoStore((state) => state.setSearchQuery)
  const openSchool = useDemoStore((state) => state.openSchool)
  const inputRef = useRef<HTMLInputElement>(null)
  const [debounced, setDebounced] = useState(query)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 220)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (hasFinePointer()) inputRef.current?.focus({ preventScroll: true })
  }, [])

  const term = debounced.trim()
  const searching = query.trim() !== term
  const results = term.length >= 2 ? ESCOLAS.filter((e) => matchesQuery(`${e.nome} ${e.codigo}`, term)) : []

  const choose = (escola: Escola) => {
    openSchool()
    navigate(ROUTES.school(escola.codigo))
  }

  return (
    <section
      data-tour="pa-search"
      aria-label="Busca de escolas"
      className="relative flex h-full min-h-[320px] flex-col bg-white md:shadow-[2px_0_8px_rgb(0_0_0/0.28)]"
      data-annot="existente"
    >
      <AnnotationBadge kind="existente" className="bottom-2 top-auto" />
      <div className="pa-purple px-2 pb-2 pt-2.5">
        <form
          role="search"
          className="flex h-[46px] items-center gap-1 rounded-md bg-white/85 pl-1 pr-1.5 shadow-sm focus-within:bg-white/95 focus-within:ring-2 focus-within:ring-white"
          onSubmit={(event) => {
            event.preventDefault()
            if (results.length === 1) choose(results[0])
          }}
        >
          <button
            type="button"
            aria-label="Voltar para a tela inicial"
            onClick={() => navigate(ROUTES.home)}
            className="grid size-10 shrink-0 place-items-center rounded-full text-[#9455c0] hover:bg-black/5"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <label htmlFor="pa-search-input" className="sr-only">
            Pesquise pelo nome da escola
          </label>
          <input
            id="pa-search-input"
            ref={inputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquise pelo nome da escola"
            className="min-w-0 flex-1 bg-transparent font-roboto text-[16px] text-[#2a1f31] outline-none placeholder:text-[#8a7896]"
          />
          {query && (
            <button
              type="button"
              aria-label="Limpar pesquisa"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="grid size-8 shrink-0 place-items-center rounded-full text-[#a985bc] hover:text-[#8a5fa6]"
            >
              <CancelIcon size={20} />
            </button>
          )}
        </form>
      </div>

      <div className="h-[3px] overflow-hidden" aria-hidden="true">
        {searching && <div className="h-full w-1/3 animate-loading-bar bg-pa-purple-light" />}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin" aria-live="polite">
        {results.length > 0 ? (
          <ul aria-label="Escolas encontradas">
            {results.map((escola) => (
              <li key={escola.codigo}>
                <button
                  type="button"
                  onClick={() => choose(escola)}
                  className="grid w-full grid-cols-[52px_1fr] py-2 text-left transition-colors hover:bg-[#f6f1f9] focus-visible:bg-[#f6f1f9] focus-visible:outline-offset-[-3px]"
                >
                  <span className="flex flex-col items-center pt-0.5">
                    <span
                      className="grid size-[26px] place-items-center rounded-full text-white shadow-[0_1px_2px_rgb(0_0_0/0.3)]"
                      style={{ background: 'radial-gradient(circle at 35% 30%, #c962d3, #b14aba 70%)' }}
                    >
                      <EditIcon size={14} />
                    </span>
                    <span className="mt-2.5 font-roboto text-[10px] text-[#706c6c]">{escola.distancia}</span>
                  </span>
                  <span className="min-w-0 pr-3">
                    <span className="block font-roboto text-[15px] font-bold uppercase leading-tight text-[#191919]">
                      {escola.nome}
                    </span>
                    <span className="mt-1.5 block font-roboto text-[13px] text-[#6c6c6c]">{escola.endereco}</span>
                    <span className="mt-1 block font-roboto text-[11px] text-[#373737]">Código: {escola.codigo}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-4 px-5 py-6 font-roboto text-[14px] text-pa-muted">
            {term.length >= 2 && !searching ? (
              <p>
                Nenhuma escola encontrada para “<strong className="text-pa-text">{term}</strong>”.
              </p>
            ) : (
              <p>Digite o nome da unidade escolar para pesquisar.</p>
            )}
            <DemoNote label="Atalho da demonstração">
              <p>Nesta demonstração há dados apenas da escola mostrada na apresentação.</p>
              <button
                type="button"
                className="mt-2 font-medium text-pa-button underline underline-offset-2 hover:text-pa-purple-deep"
                onClick={() => {
                  setQuery(DEMO_QUERY)
                  if (hasFinePointer()) inputRef.current?.focus()
                }}
              >
                Pesquisar “{DEMO_QUERY}”
              </button>
            </DemoNote>
          </div>
        )}
      </div>
    </section>
  )
}
