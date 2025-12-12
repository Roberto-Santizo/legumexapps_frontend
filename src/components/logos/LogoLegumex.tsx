export default function LogoLegumex({className = ""}) {
  return (
    <img
      src={`${import.meta.env.VITE_AWS_BUCKET_URL}resources/LOGO_LX.png`}
      alt="Img Logo"
      className={className}
    />
  )
}
