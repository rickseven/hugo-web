function displayResults (results, store) {
    const searchResults = document.getElementById('results')
    if (results.length) {
      let resultList = ''
      // Iterate and build result list elements
      for (const n in results) {
        const item = store[results[n].ref]
        // console.log(item);
        resultList += '<li class="post-item"><a href="' + item.url + '"><span class="post-title">' + item.title + '</span><span class="post-day">' + item.day + '</span></a></li>';
      }
      searchResults.innerHTML = resultList
    } else {
      searchResults.innerHTML = 'No results found.'
    }
}

function displayAllResults (store) {
    const searchResults = document.getElementById('results')
    let resultList = ''
    for (const key in store) {
        const item = store[key]
        resultList += '<li class="post-item"><a href="' + item.url + '"><span class="post-title">' + item.title + '</span><span class="post-day">' + item.day + '</span></a></li>';
    }
    searchResults.innerHTML = resultList
}
  
// Get the query parameter(s)
const params = new URLSearchParams(window.location.search)
const query = params.get('q')
  
// Perform a search if there is a query
if (query && query.trim() !== '') {
    // Retain the search input in the form when displaying results
    document.getElementById('search-input').setAttribute('value', query)

    const idx = lunr(function () {
        this.ref('id')
        this.field('title', {
        boost: 15
        })
        this.field('tags')
        this.field('content', {
        boost: 10
        })

        for (const key in window.store) {
        this.add({
            id: key,
            title: window.store[key].title,
            tags: window.store[key].category,
            content: window.store[key].content
        })
        }
    })

    // Enhanced search with fuzzy matching and wildcards
    let results = []
    
    // Try exact match first
    results = idx.search(query)
    
    // If no results, try with wildcards for partial matching
    if (results.length === 0) {
        const wildcardQuery = query.split(' ')
            .filter(term => term.length > 0)
            .map(term => `*${term}*`)
            .join(' ')
        results = idx.search(wildcardQuery)
    }
    
    // If still no results, try fuzzy search (edit distance of 1)
    if (results.length === 0) {
        const fuzzyQuery = query.split(' ')
            .filter(term => term.length > 2)
            .map(term => `${term}~1`)
            .join(' ')
        results = idx.search(fuzzyQuery)
    }
    
    // Update the list with results
    displayResults(results, window.store)
} else {
    // If no query or empty query, display all posts
    displayAllResults(window.store)
}