window.onload = function () {
    var $searchbar = document.getElementById('searchbar');
    var $results = document.getElementById('search-results');
    if (!$searchbar || !$results) return;

    SimpleJekyllSearch({
        searchInput: $searchbar,
        resultsContainer: $results,
        json: '/search.json',
        searchResultTemplate: '<a class="block rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 no-underline hover:border-slate-700" href="{url}"><div class="text-sm text-slate-100">{title}</div><div class="mt-1 text-xs text-slate-400">{date}</div></a>',
        noResultsText: ''
    });

    var updateVisibility = function () {
        if ($searchbar.value && $searchbar.value.trim().length > 0) {
            $results.classList.remove("hidden");
        } else {
            $results.classList.add("hidden");
            $results.innerHTML = "";
        }
    };

    $searchbar.addEventListener("input", updateVisibility);
    updateVisibility();
}

