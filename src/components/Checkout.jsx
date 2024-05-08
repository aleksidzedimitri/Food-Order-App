import { useContext } from "react";
import Modal from "./Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./Input";
import Button from "./Button";
import ModalContext from "../store/ModalContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const reqConfig = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const modalCtx = useContext(ModalContext);

  const { data, isLoading, error, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    reqConfig
  );

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    modalCtx.hideCheckout();
  }

  function handleFinish() {
    modalCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formdata = new FormData(event.target);
    const customerData = Object.fromEntries(formdata.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let action = (
    <>
      <Button onClick={handleClose} type="button" textOnly>
        Close
      </Button>
      <Button>Submit</Button>
    </>
  );
  if (isLoading) {
    action = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={modalCtx.progress === "checkout"} onClose={handleFinish}>
        <h2>Success!</h2>
        <p>Your order was submitted successfully!</p>
        <p>You will receive more details via email.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={modalCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p style={{ fontSize: "1.2em" }}>
          Total Amount: <strong>{currencyFormatter.format(cartTotal)}</strong>
        </p>
        <Input label="Full Name" type="text" id="name" autoComplete="on" />
        <Input
          label="Email Address"
          type="email"
          id="email"
          autoComplete="on"
        />
        <Input
          label="Street Address"
          type="text"
          id="street"
          autoComplete="on"
        />
        <div>
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions"> {action} </p>
      </form>
    </Modal>
  );
}
