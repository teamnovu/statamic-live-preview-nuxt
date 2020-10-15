export default function (context) {
   if (process.client) {
        window.onmessage = function(e){
            if (e.data === 'liveUpdate') {
                context.store._vm.$nuxt.refresh()
            }
        }
   }
}
  