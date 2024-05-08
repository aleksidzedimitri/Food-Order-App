import { useContext } from "react";
import Modal from "./Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Button from "./Button.jsx";
import ModalContext from "../store/ModalContext.jsx";
import CartItem from "./CartItem.jsx";

export default function Cart({}) {
  const cartCtx = useContext(CartContext);
  const modalCtx = useContext(ModalContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleCloseCart() {
    modalCtx.hideCart();
  }

  function handleGoToCheckout() {
    modalCtx.showCheckout();
  }

  return (
    <Modal
      className="cart"
      open={modalCtx.progress === "cart"}
      onClose={modalCtx.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item)}
          />
        ))}
      </ul>
      <p className="cart-total"> {currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
