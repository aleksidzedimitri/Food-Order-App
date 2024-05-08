import { useContext } from "react";
import logoImg from "../assets/logo.jpg";
import Button from "./Button.jsx";
import CartContext from "../store/CartContext.jsx"; // Corrected import
import ModalContext from "../store/ModalContext.jsx";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const modalCtx = useContext(ModalContext);

  const totalCartItems = cartCtx.items.reduce((totalItems, item) => {
    return totalItems + item.quantity;
  }, 0);

  function handleShowCart() {
    modalCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Restaurant" />
        <h1>Fooder</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
