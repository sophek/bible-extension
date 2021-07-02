import { createApp } from 'vue'
import debounce from './directives/debouncer'
import App from './App.vue'

import Unicon from 'vue-unicons'
import { uniHeart, uniClipboard, uniBright, uniCloud } from 'vue-unicons/dist/icons'

Unicon.add([uniHeart, uniClipboard, uniBright, uniCloud])

//defining the directive
const app = createApp(App)

//defining the directive
app.directive('debounce', (el, binding) => debounce(el, binding))
app.use(Unicon)
app.mount('#app')
