import { useNavigate } from 'react-router'
import { DISCLAIMER, ROUTES } from '../../data/constants'
import { useDemoStore } from '../../store/demoStore'
import { toast } from '../../store/toastStore'
import { useUiStore } from '../../store/uiStore'
import { useTour } from '../../tour/TourContext'
import { Modal } from '../ui/Modal'
import { Legend } from './Legend'

const secondary =
  'h-10 rounded-full border border-[#d6d0c2] px-4 font-spartan text-[15px] font-semibold text-pc-green hover:bg-pc-cream'
const primary = 'h-10 rounded-full bg-pc-green px-5 font-spartan text-[15px] font-semibold text-pc-cream hover:bg-pc-green-2'

/** Diálogos compartilhados da moldura: reiniciar simulação, sobre a demonstração e fim do tutorial. */
export function ShellDialogs() {
  const navigate = useNavigate()
  const tour = useTour()
  const resetOpen = useUiStore((state) => state.resetOpen)
  const setResetOpen = useUiStore((state) => state.setResetOpen)
  const aboutOpen = useUiStore((state) => state.aboutOpen)
  const setAboutOpen = useUiStore((state) => state.setAboutOpen)
  const resetSimulation = useDemoStore((state) => state.resetSimulation)

  const confirmReset = () => {
    setResetOpen(false)
    resetSimulation()
    if (tour.active) {
      tour.start()
    } else {
      navigate(ROUTES.home)
      window.scrollTo({ top: 0 })
    }
    toast('Simulação reiniciada: dados de exemplo restaurados.')
  }

  return (
    <>
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reiniciar a simulação?"
        footer={
          <>
            <button type="button" className={secondary} onClick={() => setResetOpen(false)}>
              Cancelar
            </button>
            <button type="button" className={primary} onClick={confirmReset}>
              Reiniciar
            </button>
          </>
        }
      >
        <p>
          A navegação volta à tela inicial do Prato Aberto e os relatos enviados nesta demonstração são apagados deste
          navegador. {tour.active && 'O tutorial recomeça da primeira etapa.'}
        </p>
      </Modal>

      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="Sobre esta demonstração">
        <p>{DISCLAIMER}</p>
        <p className="mt-3">
          As telas do Prato Aberto foram reconstruídas a partir das capturas da apresentação. O painel “Prato
          Consciente” representa a proposta. Nenhuma informação é enviada a servidores: tudo acontece neste navegador.
        </p>
        <div className="mt-4 rounded-xl bg-pc-cream p-4">
          <Legend detailed />
        </div>
      </Modal>

      <Modal
        open={tour.finishedOpen}
        onClose={tour.closeFinished}
        title="Demonstração concluída!"
        footer={
          <>
            <button
              type="button"
              className={secondary}
              onClick={() => {
                tour.closeFinished()
                navigate(ROUTES.landing)
              }}
            >
              Tela inicial
            </button>
            <button type="button" className={secondary} onClick={tour.closeFinished}>
              Explorar livremente
            </button>
            <button
              type="button"
              className={primary}
              onClick={() => {
                tour.closeFinished()
                resetSimulation()
                tour.start()
              }}
            >
              Refazer a demonstração
            </button>
          </>
        }
      >
        <p>
          Você viu como o Prato Aberto funciona hoje, onde o Prato Consciente entraria, como a família enviaria um relato
          e como esse retorno poderia apoiar a gestão pública da alimentação escolar.
        </p>
      </Modal>
    </>
  )
}
