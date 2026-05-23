import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useMessages } from "contexts/MessagesContext";
import { useTranslation } from "contexts/TranslationContext";
import { useConfig } from "contexts/ConfigContext";

export default function Drink({ match }) {
  const { id } = useParams();
  const { get } = useApi();
  const { addMessage } = useMessages();
  const [drink, setDrink] = useState(null)
  const { __, language } = useTranslation()
  const { realm } = useConfig()


  useEffect(() => {
    if (realm) {
      const controller = new AbortController();
      get(`drinks/${id}`, { params: { lang: language }, signal: controller.signal })
        .then((response) => {
          const drink = response.data //.user;
          // console.log('drink:', drink);
          setDrink(drink);
        })
        .catch((error) => {
          if (error.code === 'ERR_CANCELED') {
            return;
          }
          //setDrink(null);
          console.log(error.response?.data);
          // error.response.status == 401
          console.warn(error)
          addMessage("danger", error.response?.data?.error ?? error.statusText);
        });
      return () => controller.abort();
    }
  }, [get, id, realm, addMessage, language])

  if (!drink) {
    return <div>{__('Please wait')}</div>;
  }
  // console.log('drink', drink)
  return (
    <div>
      <h2>Drink Details</h2>
      <h3>#{id} {drink.name}</h3>
      <p>Description: {drink.description}</p>
      {/* <p>Price: ${drink.units[0].unit_price.toFixed(2)}</p> */}
      {/* Add more details as needed */}
    </div>);
}
