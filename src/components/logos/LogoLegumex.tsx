export default function LogoLegumex({className = ""}) {
  return (
    <img
      src={`${import.meta.env.VITE_BASE_URL}/logo.png`}
      alt="Img Logo"
      className={className}
    />
  )
}
