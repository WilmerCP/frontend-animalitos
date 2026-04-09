export default function StepCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-white/60">{desc}</div>
    </div>
  );
}