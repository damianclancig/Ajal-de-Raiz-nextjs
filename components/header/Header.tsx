import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <nav>
        <div className="navbar justify-between bg-base-300">
          <Link href="/" className="btn btn-ghost text-lg">
            Ajal de Raiz
          </Link>
          <ul className="flex">
            <li>
              <Link href="/cart" className="btn btn-ghost rounded-btn">
                Carrito
              </Link>
            </li>
            <li>
              <Link href="/signin" className="btn btn-ghost rounded-btn">
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
export default Header
