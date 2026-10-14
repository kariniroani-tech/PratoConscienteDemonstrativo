import { useNavigate } from 'react-router'
import { ROUTES } from '../../data/constants'
import { useDemoStore } from '../../store/demoStore'
import { AnnotationBadge } from '../demo/AnnotationBadge'
import { PlaceIcon } from './icons'
import { PratoAbertoLogo } from './PratoAbertoLogo'

/** Tela inicial do Prato Aberto — reconstrução do slide 11. */
export function HomePanel() {
  const navigate = useNavigate()
  const signal = useDemoStore((state) => state.signal)

  return (
    <section
      className="pa-purple relative flex h-full flex-col px-7 pb-10 pt-9 sm:px-[68px] md:pb-8 md:pt-[46px]"
      aria-labelledby="pa-home-title"
      data-annot="existente"
    >
      <AnnotationBadge kind="existente" />
      <div data-tour="pa-intro" className="max-w-[420px]">
        <PratoAbertoLogo className="text-[38px]" />
        <h1
          id="pa-home-title"
          className="mt-7 font-varela text-[29px] font-normal uppercase leading-[1.42] tracking-[0.005em] sm:text-[34px]"
        >
          Comida boa
          <br />
          não tem segredo
        </h1>
        <p className="mt-[22px] max-w-[318px] font-roboto text-[15px] leading-6 text-white/95">
          Um jeito fácil e transparente para todo mundo se nutrir de informação sobre o que é servido na Rede
          Municipal de Ensino.
        </p>
      </div>
      <div className="mt-10 md:mt-[clamp(40px,22vh,190px)]">
        <button
          type="button"
          data-tour="pa-find-school"
          className="pa-find-button"
          onClick={() => {
            signal('find-clicked')
            navigate(ROUTES.search)
          }}
        >
          <PlaceIcon size={20} />
          Encontre sua escola
        </button>
      </div>
    </section>
  )
}
