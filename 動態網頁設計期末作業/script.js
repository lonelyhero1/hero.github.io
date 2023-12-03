var vm = new Vue({
  el:"#app",
  data:{
    movies:[],
    cart:[],
    stockquantity:[], /* 庫存數量 */
    currentMovie: null,
    isCartOpen: false,
    showOrder: false,
    allmovie:0,
    totalPrices:0,
    query: '',/*查詢 */
    soldOut: false,
    errormessage: false,
  },
  created(){
    let apiUrl="movie.json"
    axios.get(apiUrl).then(res=>{
      this.movies=res.data
    })
  },
  methods:{
    bgcss(url){
      return {
        'background-image':'url(' + url + ')',
        'background-size':'cover',
        'background-position':'center center',
      }
    },
    wheel(evt){
      TweenMax.to(".cards",0.8,{
        left: "+="+ evt.deltaY*2 +"px"
      })
    },
    addCart(movie,evt){
      if(movie.store==0 || movie.store<movie.QTY){
        this.errormessage = true
        setTimeout(()=>{this.errormessage = false},1000)
      }
      else{
        this.currentMovie= movie
        let target = evt.target
        this.$nextTick(()=>{
          TweenMax.from(".buybox",0.8,{
            left: $(evt.target).offset().left,
            top: $(evt.target).offset().top,
            opacity:1
        })
        setTimeout(()=>{
          var selectedDrink = vm.cart.find((d) => d.name === movie.name);
          if(!selectedDrink){
            this.cart.push(movie)
          }
          this.allmovie += movie.QTY
        },800)
        //庫存減掉購買數量
        movie.store -= movie.QTY
        movie.QTYinCart += movie.QTY
        })
      }
    },
    reducemovie(movie){
      if(movie.QTYinCart>=1){
        movie.QTYinCart--
        this.allmovie--
        movie.store++
      }
      if(movie.QTYinCart==0){
        this.cart.splice(this.cart.indexOf(movie),1)
      }
    },
    addmovie(movie){
      if(0<movie.store){
        movie.QTYinCart++
        this.allmovie++
        movie.store--
      }
      else{
        this.errormessage = true
        setTimeout(()=>{this.errormessage = false},1000)
      }
    },
    delate(movie){
      this.cart.splice(this.cart.indexOf(movie),1)
      movie.store += movie.QTYinCart
      this.allmovie-=movie.QTYinCart
      movie.QTYinCart = 0
    },
    clearCart(){
      this.cart.forEach((movie)=>{
        movie.store += movie.QTYinCart
        movie.QTYinCart = 0
      })
      this.cart=[]
      this.allmovie=0
    },
    showOrder(){
      allmovie = allmovie
    },
    abccd(movie){
      if(movie.store < 0){
        movie.store = 0
      }
    },
    QTYabc(movie){
      if(movie.QTY < 1){
        movie.QTY = 1
      }
    }
  },
  watch: {
    cart(){
      TweenMax.from(".fa-shopping-cart",0.3,{
        scale: 0.5
      })
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, movie) => {
        return total + (movie.price * movie.QTYinCart);
      }, 0);
    },
    filteredMovies() {
      return this.movies.filter(movie => {
        var cards = document.querySelector('.cards');
        cards.style.left = '0px';
        return movie.name.includes(this.query);
      });
    }
  }
})