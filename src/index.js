import { Elm } from './Main.elm';


Elm.Main.init({
  node: document.getElementById('root'),
  flags: {
    stripesSvg: new URL('./stripes.svg', import.meta.url).href
  }
});
