import { useRef, useState, type KeyboardEvent } from 'react'
import {
  DIAS_CURTOS,
  addDays,
  addMonths,
  formatCalendarCaption,
  formatLong,
  monthKey,
  monthLabel,
  monthMatrix,
  parseISO,
} from '../../lib/dates'
import { cn } from '../../lib/cn'
import { useDemoStore } from '../../store/demoStore'
import { TriangleLeftIcon, TriangleRightIcon } from './icons'

const KEY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }

/** Calendário do Prato Aberto — reconstrução dos slides 13 a 15. */
export function Calendar() {
  const selectedDate = useDemoStore((state) => state.selectedDate)
  const visibleMonth = useDemoStore((state) => state.visibleMonth)
  const selectDate = useDemoStore((state) => state.selectDate)
  const setVisibleMonth = useDemoStore((state) => state.setVisibleMonth)
  const [focusDate, setFocusDate] = useState<string | null>(null)
  const gridRef = useRef<HTMLTableElement>(null)

  const weeks = monthMatrix(visibleMonth)
  const previousDay = addDays(selectedDate, -1)
  const nextDay = addDays(selectedDate, 1)

  const tabbableDate =
    focusDate && monthKey(focusDate) === visibleMonth
      ? focusDate
      : monthKey(selectedDate) === visibleMonth
        ? selectedDate
        : `${visibleMonth}-01`

  const moveFocus = (iso: string) => {
    setFocusDate(iso)
    if (monthKey(iso) !== visibleMonth) setVisibleMonth(monthKey(iso))
    requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)?.focus()
    })
  }

  const onDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    const step = KEY_STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    moveFocus(addDays(iso, step))
  }

  return (
    <div data-tour="pa-calendar" className="px-4 pb-8 pt-6 md:pt-7">
      <div className="mx-auto flex w-[244px] items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          aria-label="Mês anterior"
          className="grid size-8 place-items-center rounded-full text-pa-blue hover:bg-[#eef4fa]"
        >
          <TriangleLeftIcon size={22} />
        </button>
        <p className="font-roboto text-[15px] text-[#212121]" aria-live="polite">
          {monthLabel(visibleMonth)}
        </p>
        <button
          type="button"
          onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          aria-label="Próximo mês"
          className="grid size-8 place-items-center rounded-full text-pa-blue hover:bg-[#eef4fa]"
        >
          <TriangleRightIcon size={22} />
        </button>
      </div>

      <div className="mt-1 flex items-center justify-center gap-[22px]">
        <button
          type="button"
          onClick={() => selectDate(previousDay)}
          aria-label={`Dia anterior: ${formatLong(previousDay)}`}
          className="w-[46px] text-center font-roboto text-[40px] leading-none text-pa-violet-soft transition-colors hover:text-[#c9b2da]"
        >
          {parseISO(previousDay).d}
        </button>
        <p className="min-w-[96px] text-center font-roboto text-[84px] leading-none tracking-[-0.02em] text-pa-violet">
          <span className="sr-only">Data selecionada: </span>
          {parseISO(selectedDate).d}
        </p>
        <button
          type="button"
          onClick={() => selectDate(nextDay)}
          aria-label={`Dia seguinte: ${formatLong(nextDay)}`}
          className="w-[46px] text-center font-roboto text-[40px] leading-none text-pa-violet-soft transition-colors hover:text-[#c9b2da]"
        >
          {parseISO(nextDay).d}
        </button>
      </div>
      <p className="mt-3 text-center font-roboto text-[12px] text-pa-muted">{formatCalendarCaption(selectedDate)}</p>

      <table ref={gridRef} aria-label={`Calendário de ${monthLabel(visibleMonth)}`} className="mx-auto mt-9 border-separate border-spacing-0">
        <thead>
          <tr>
            {DIAS_CURTOS.map((dia) => (
              <th key={dia} scope="col" className="w-[35.5px] pb-2.5 text-center font-roboto text-[15px] font-normal text-pa-muted">
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, row) => (
            <tr key={row}>
              {week.map((iso, col) =>
                iso ? (
                  <td key={iso} className="p-0 text-center">
                    <button
                      type="button"
                      data-date={iso}
                      tabIndex={iso === tabbableDate ? 0 : -1}
                      aria-pressed={iso === selectedDate}
                      aria-label={formatLong(iso)}
                      onClick={() => {
                        setFocusDate(iso)
                        selectDate(iso)
                      }}
                      onKeyDown={(event) => onDayKeyDown(event, iso)}
                      className={cn(
                        'relative mx-auto grid h-[31px] w-[33px] place-items-center rounded-md font-roboto text-[14.5px] transition-colors hover:bg-[#f3edf7]',
                        iso === selectedDate ? 'text-pa-violet' : 'text-pa-muted',
                      )}
                    >
                      {parseISO(iso).d}
                      {iso === selectedDate && (
                        <span className="absolute bottom-[2px] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-pa-violet" />
                      )}
                    </button>
                  </td>
                ) : (
                  <td key={`vazio-${row}-${col}`} aria-hidden="true" />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
