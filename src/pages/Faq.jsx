import Header from '../components/Header'
import StepsSection from '../components/StepsSection';
import DrawerMenu from '../components/DrawerMenu.jsx';

import { useState } from "react";


function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-[800px] mx-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex justify-between items-center"
      >
        <span>{q}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 pt-0 text-white/70 text-sm text-left">{a}</div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0b1220] text-white p-6 space-y-8 md:px-30">

        <StepsSection />

        {/* SECURITY */}
        <Section title="Juego limpio, seguro y transparente">
          <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
            <li>Todos los resultados y operaciones son controladas por un Contrato Inteligente en la blockchain</li>
            <li>El contrato inteligente esta disponible para ser verificado por los usuarios</li>
            <li>Los resultados son generados de forma aleatoria usando una función aleatoria verificable <a href='https://docs.chain.link/vrf' target='_blank' className='font-bold underline'>Chainlink VRF</a></li>
          </ul>
        </Section>

        {/* PAYOUT */}
        <Section title="Sistema de pagos">
          <div className="space-y-3 text-sm text-white/70">
            <p>El capital de una ronda es distribuido de la siguiente manera:</p>
            <ul className="list-disc list-inside">
              <li>~85% → Ganadores</li>
              <li>~10% → Casa</li>
              <li>~5% → Jackpot</li>
            </ul>
            <div className="bg-black/30 p-3 rounded-lg border border-white/10">
              Tu ganancia = (Tu apuesta / Total de apuestas ganadoras) × Pozo de premios
            </div>
          </div>
        </Section>

        {/* JACKPOT */}
        <Section title="Ronda Especial">
          <p className="text-sm text-white/70">
            El 5% del capital de una ronda se acumula para un jackpot. Cuando se llega a un monto mínimo de <b>500 USDT</b>, empieza una ronda especial en la cual puedes ganar todo el dinero acumulado.
          </p>
        </Section>

        {/* RULES */}
        <Section title="Reglas y límites">
          <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
            <li>Precio de un ticket: <b>1 USDT</b></li>
            <li>Un usuario puede comprar máximo <b>5 tickets</b> de un mismo animal</li>
            <li>Los animales son limitados: solo <b>100 tickets</b> por ronda</li>
            <li>No es posible cambiar luego de hacer una apuesta</li>
            <li>Cada ronda dará como resultado un animal ganador</li>
          </ul>
        </Section>

        {/* HOW TO PLAY */}
        <Section title="Cómo jugar">
          <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
            <li>Conecta tu cartera</li>
            <li>Aprueba el acceso a tus tokens USDT</li>
            <li>Haz tus apuestas</li>
            <li>Reclama tus recompensas una vez la ronda termina</li>
          </ul>
        </Section>

        {/* VRF */}
        <Section title="Funcion Aleatoria Verificable">
          <p className="text-sm text-white/70 text-left mb-2">
            El contrato inteligente utiliza una Funcion Aleatoria Verificable <a href='https://docs.chain.link/vrf' target='_blank' className='font-bold underline'>Chainlink VRF</a> para generar el animal ganador.
          </p>
          <p className="text-sm text-white/70 text-left mb-2">
            Se trata de un servicio pago, proporcionado por la empresa Chainlink que genera un numero completamente aleatorio, y se lo entrega al contrato (uno nuevo cada ronda), junto con una prueba criptográfica.
          </p>
          <p className="text-sm text-white/70 text-left mb-2">
            Esto nos permite garantizar que el resultado de cada ronda es completamente aleatorio y justo.
          </p>
        </Section>

        {/* FAQ */}
        <Section title="Preguntas Frecuentes">
          <div className="space-y-2">
            <FAQItem
              q="¿Puedo apostar por varios animales?"
              a="Si, puedes distribuir tus apuestas en varios animales siempre y cuando no se haya alcanzado el limite de 100 tickets por animal y 5 tickets por usuario."
            />
            <FAQItem
              q="¿Cómo puedo reclamar mi premio?"
              a="Cuando la ronda termina basta con presionar un botón y los tokens serán depositados en tu cartera."
            />
            <FAQItem
              q="¿Pierdo mis tokens si mi animal no gana?"
              a="Si, solo los ganadores reciben pago."
            />
            <FAQItem
              q="¿Por qué debo aprobar el acceso a mis tokens USDT?"
              a="El contrato requiere tener permiso para poder hacer la transferencia de tokens, aprobar un monto mayor es seguro y permite hacer apuestas mas rápido en el futuro. Otorgar acceso no significa que el contrato pueda retirar tu dinero, solo puede transferir la cantidad de tickets que hayas comprado."
            />
            <FAQItem
              q="¿Cómo se que el juego es justo?"
              a="El juego no es administrado por una persona. En su lugar un contrato inteligente maneja los balances, recibe los pagos y genera un animal ganador. Al vivir en la blockchain, nisiquiera los desarrolladores pueden modificar el comportamiento del contrato, retirar tu dinero o influir en los resultados."
            />
          </div>
        </Section>

        {/* FOOTER */}
        <div className="text-center text-xs text-white/40 pt-6">
          Este es un juego de apuestas con tecnología blockchain. Usar responsablemente. Todas las transacciones son irreversibles.
        </div>
      </div>
      <DrawerMenu/>
    </>
  );
}
