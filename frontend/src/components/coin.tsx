interface CoinProps {
  result: string
}

const Coin: React.FC<CoinProps> = ({ result }) => {
  return (
    <div className={`coin ${result}`}>
      <div className="side-a">HEADS</div>
      <div className="side-b">TAILS</div>
    </div>
  )
}

export default Coin
