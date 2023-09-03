// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { useSelector } from "react-redux";
import { getCart, cleareCart, getTotalCartPrice } from "../cart/cartSlice";
import store from "../../store";
import {formatCurrency} from "../../utils/helpers"

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const username = useSelector((state) => state.user.userName);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6 ">
      <h2 className="mb-8 text-xl font-semibold ">
        Ready to order? Let&#39;s go!
      </h2>

      <Form method="POST">
        <div
          className="mb-5 flex flex-col gap-2 
        sm:flex-row sm:items-center"
        >
          <label className="sm:basis-40" htmlFor="customer">
            First Name
          </label>
          <div className="grow">
            <input
              id="customer"
              placeholder="First Name"
              className="input"
              type="text"
              name="customer"
              defaultValue={username}
              required
            />
          </div>
        </div>

        <div
          className="mb-5 flex flex-col gap-2 
        sm:flex-row sm:items-center"
        >
          <label className="sm:basis-40" htmlFor="phone">
            Phone number
          </label>
          <div className="grow">
            <input
              id="phone"
              type="tel"
              autoComplete="true"
              name="phone"
              required
              placeholder="Phone Number"
              className="input"
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div
          className="mb-5 flex flex-col gap-2 
        sm:flex-row sm:items-center"
        >
          <label className="sm:basis-40" htmlFor="address">
            Address
          </label>
          <div className="grow">
            <input
              id="address"
              type="text"
              autoComplete="true"
              name="address"
              required
              placeholder="Address"
              className="input"
            />
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={() => setWithPriority(!withPriority)}
            className="h-6 w-6 accent-yellow-400
            focus:outline-none focus:ring
            focus:ring-yellow-300 focus:ring-offset-2"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <div>
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? "Placing Order..." : `Order now From ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    priority: data.priority === "true",
    cart: JSON.parse(data.cart),
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please enter a correct phone number, We may need to contact you.";
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //Do Not overuse this. It's not good!
  store.dispatch(cleareCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
