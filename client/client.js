const API_URL = "http://localhost:5000/search/sfbay/";

const app = new Vue({
  el: "#app",
  data: {
    loading: false,
    term: "", //Searchbar value
    activeTerm: null,
    terms: [],
    activeResults: [], //Results from search of activeTerm
    hiddenResults: {}
  },
  mounted() {
    if (localStorage.terms) {
      this.terms = JSON.parse(localStorage.terms);
    }

    if (localStorage.hiddenResults) {
      this.hiddenResults = JSON.parse(localStorage.hiddenResults);
    }
  },
  methods: {
    removeTerm(term) {
      const index = this.terms.indexOf(term);
      this.terms.splice(index, 1);
      this.activeResults = [];
      this.activeTerm = "";
      localStorage.terms = JSON.stringify(this.terms);
    },
    hideResult(result) {
      // Same as this.hiddenResults[result.url] = true;
      this.$set(this.hiddenResults, result.url, true);
      localStorage.hiddenResults = JSON.stringify(this.hiddenResults);
    },
    addTerm() {
      this.terms.push(this.term);
      this.term = "";
      localStorage.terms = JSON.stringify(this.terms);
    },
    setActiveTerm(term) {
      this.activeResults = [];
      this.activeTerm = term;
      this.loading = true;
      const url = `${API_URL}${term}`;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          this.activeResults = json.results;
          this.loading = false;
        });
    }
  }
});
