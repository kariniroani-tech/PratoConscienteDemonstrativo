import { ChevronDown, CircleAlert, LoaderCircle } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import type { Escola } from '../../data/escolas'
import { EXEMPLOS_RELATO } from '../../data/exemplos'
import { formatBR } from '../../lib/dates'
import { cn } from '../../lib/cn'
import { findPersonalData } from '../../lib/text'
import { useDemoStore } from '../../store/demoStore'
import { useTour } from '../../tour/TourContext'
import { DemoNote } from '../demo/DemoNote'

const MAX_LENGTH = 1000
const MIN_LENGTH = 15

interface Errors {
  classe?: string
  relato?: string
}

function validateClasse(classe: string): string | undefined {
  return classe ? undefined : 'Selecione a classe do aluno.'
}

function validateRelato(relato: string): string | undefined {
  const text = relato.trim()
  if (!text) return 'Escreva o relato da família antes de enviar.'
  if (text.length < MIN_LENGTH) return `O relato está muito curto. Conte um pouco mais (mínimo de ${MIN_LENGTH} caracteres).`
  const personal = findPersonalData(text)
  if (personal)
    return `Para proteger a privacidade, retire dados pessoais do relato (encontramos algo parecido com ${personal}).`
  return undefined
}

/** PROPOSTA — formulário "Classe do aluno" + "Relato da família" (slide 15). */
export function PcForm({ escola, data }: { escola: Escola; data: string }) {
  const classe = useDemoStore((state) => state.formClasse)
  const relato = useDemoStore((state) => state.formRelato)
  const setClasse = useDemoStore((state) => state.setFormClasse)
  const setRelato = useDemoStore((state) => state.setFormRelato)
  const addRelato = useDemoStore((state) => state.addRelato)
  const presentationMode = useDemoStore((state) => state.presentationMode)
  const tour = useTour()
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const classeRef = useRef<HTMLSelectElement>(null)
  const relatoRef = useRef<HTMLTextAreaElement>(null)

  const examplesVisible = showExamples || tour.active || presentationMode

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const next: Errors = { classe: validateClasse(classe), relato: validateRelato(relato) }
    setErrors(next)
    if (next.classe) {
      classeRef.current?.focus()
      return
    }
    if (next.relato) {
      relatoRef.current?.focus()
      return
    }
    setSubmitting(true)
    // Envio SIMULADO: nada sai do navegador. O atraso imita a resposta de um servidor.
    window.setTimeout(() => {
      addRelato({ escolaCodigo: escola.codigo, escolaNome: escola.nome, data, classe, texto: relato.trim() })
      setSubmitting(false)
    }, 750)
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="pc-form-titulo"
      className="mx-auto w-full max-w-[560px] rounded-[4px] bg-white p-5 shadow-[0_1px_4px_rgb(0_0_0/0.18)] sm:p-6"
    >
      <h3 id="pc-form-titulo" className="sr-only">
        Relato da família sobre o cardápio de {formatBR(data)}
      </h3>
      <p className="mb-5 font-roboto text-[13px] leading-relaxed text-pa-muted">
        Compartilhe a percepção da família sobre o cardápio deste dia. Não é preciso informar o nome da criança nem
        dados pessoais.
      </p>

      <div data-tour="pc-classe">
        <label htmlFor="pc-classe" className="block font-roboto text-[15px] font-medium text-black">
          Classe do aluno
        </label>
        <div className="relative mt-2">
          <select
            id="pc-classe"
            ref={classeRef}
            value={classe}
            onChange={(event) => {
              setClasse(event.target.value)
              if (errors.classe) setErrors((current) => ({ ...current, classe: validateClasse(event.target.value) }))
            }}
            aria-invalid={Boolean(errors.classe)}
            aria-describedby={errors.classe ? 'pc-classe-erro' : undefined}
            className={cn(
              'h-[44px] w-full appearance-none rounded-[4px] border bg-white pl-3.5 pr-10 font-roboto text-[15px] outline-none focus:ring-2',
              classe ? 'text-black' : 'text-[#757575]',
              errors.classe
                ? 'border-pa-error focus:border-pa-error focus:ring-pa-error/20'
                : 'border-[#c4c4c4] focus:border-pa-button focus:ring-pa-button/25',
            )}
          >
            <option value="" disabled>
              Selecione a classe
            </option>
            {escola.classes.map((opcao) => (
              <option key={opcao} value={opcao} className="text-black">
                {opcao}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
            aria-hidden="true"
          />
        </div>
        {errors.classe && (
          <p id="pc-classe-erro" className="mt-1.5 flex items-center gap-1.5 font-roboto text-[13px] text-pa-error">
            <CircleAlert size={15} aria-hidden="true" />
            {errors.classe}
          </p>
        )}
      </div>

      <div data-tour="pc-relato" className="mt-5">
        <label htmlFor="pc-relato" className="block font-roboto text-[15px] font-medium text-black">
          Relato da família
        </label>
        <textarea
          id="pc-relato"
          ref={relatoRef}
          rows={6}
          maxLength={MAX_LENGTH}
          value={relato}
          onChange={(event) => {
            setRelato(event.target.value)
            if (errors.relato) setErrors((current) => ({ ...current, relato: validateRelato(event.target.value) }))
          }}
          aria-invalid={Boolean(errors.relato)}
          aria-describedby={cn(errors.relato && 'pc-relato-erro', 'pc-relato-contador')}
          placeholder="Digite aqui o relato ou sugestão da família sobre o cardápio e a alimentação..."
          className={cn(
            'mt-2 block min-h-[150px] w-full resize-y rounded-[4px] border bg-white px-3.5 py-3 font-roboto text-[15px] leading-relaxed text-black outline-none placeholder:text-[#5f5f5f] focus:ring-2',
            errors.relato
              ? 'border-pa-error focus:border-pa-error focus:ring-pa-error/20'
              : 'border-[#c4c4c4] focus:border-pa-button focus:ring-pa-button/25',
          )}
        />
        <div className="mt-1.5 flex items-start justify-between gap-3 font-roboto text-[13px]">
          {errors.relato ? (
            <p id="pc-relato-erro" className="flex items-start gap-1.5 text-pa-error">
              <CircleAlert size={15} className="mt-px shrink-0" aria-hidden="true" />
              {errors.relato}
            </p>
          ) : (
            <span />
          )}
          <span id="pc-relato-contador" className="shrink-0 tabular-nums text-[#757575]">
            {relato.length}/{MAX_LENGTH}
          </span>
        </div>

        {examplesVisible ? (
          <DemoNote label="Exemplos fictícios · atalho da demonstração" className="mt-3">
            <p className="mb-2">Toque em um exemplo para preencher o relato:</p>
            <div className="flex flex-wrap gap-2">
              {EXEMPLOS_RELATO.map((exemplo) => (
                <button
                  key={exemplo.rotulo}
                  type="button"
                  onClick={() => {
                    setRelato(exemplo.texto)
                    setErrors((current) => ({ ...current, relato: undefined }))
                    relatoRef.current?.focus()
                  }}
                  className="rounded-full border border-[#d8bf98] bg-white px-3 py-1.5 text-[13px] text-[#5b4527] hover:border-pa-button hover:text-pa-button"
                >
                  {exemplo.rotulo}
                </button>
              ))}
            </div>
          </DemoNote>
        ) : (
          <button
            type="button"
            onClick={() => setShowExamples(true)}
            className="mt-2 font-roboto text-[13px] text-pa-button underline underline-offset-2"
          >
            Ver exemplos de relato (demonstração)
          </button>
        )}

        <button
          type="submit"
          data-tour-submit=""
          disabled={submitting}
          className="mt-5 flex h-[42px] w-full items-center justify-center gap-2 rounded-[3px] bg-pa-button font-roboto text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#5c1287] disabled:opacity-75"
        >
          {submitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            'Enviar Relato'
          )}
        </button>
      </div>
    </form>
  )
}
