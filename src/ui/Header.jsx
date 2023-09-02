import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <header className="flex items-center justify-between  bg-yellow-500 px-4 py-3 uppercase sm:py-6">
      <Link to="/" className="text-sm tracking-widest sm:text-base">
        Fast React Pizza Co.
      </Link>

      <SearchOrder />
      <Username />
    </header>
  );
}

export default Header;
