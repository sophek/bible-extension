import { createApp } from 'vue'
import debounce from './directives/debouncer'
import "primeicons/primeicons.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeflex/primeflex.css';

import PrimeVue from 'primevue/config';

import Unicon from 'vue-unicons'
import { uniHeart, uniClipboard, uniBright, uniCloud, uniAt, uniPhone, uniChat } from 'vue-unicons/dist/icons'

import App from './App.vue'

Unicon.add([uniHeart, uniClipboard, uniBright, uniCloud, uniAt, uniPhone, uniChat])

//defining the directive
const app = createApp(App)

//defining the directive
app.directive('debounce', (el, binding) => debounce(el, binding))
app.use(Unicon)
app.use(PrimeVue);
app.mount('#app')
