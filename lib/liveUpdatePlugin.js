export default function () {
   if (process.client) {
        window.onmessage = function(e){
            if (e.data === 'liveUpdate') {
                window.$nuxt.refresh()
            }
        }
   }
}
  