import StepCard from "./StepCard"

export default function StepsSection() {

    return <div className="py-10 flex flex-col gap-5">
        <h2 className="text-3xl font-bold">¿Cómo funciona?</h2>
        <p className="text-white/60">
          Apuesta por tus animales preferidos. Mira la ruleta girar. Gana tu recompensa.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StepCard icon="🎯" title="Elige un animal" desc="Escoge a tus favoritos" />
            <StepCard icon="💸" title="Haz una apuesta" desc="Compra tickets" />
            <StepCard icon="🎡" title="Espera" desc="La ronda termina" />
            <StepCard icon="🏆" title="Gana" desc="Reclama tus ganacias" />
        </div>
    </div>


}