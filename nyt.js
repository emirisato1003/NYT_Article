/* script.js */
const articleSection = document.getElementById('article-section');
const result = document.querySelector('#article');
let dataArticle = document.querySelector('[data-article]');
let date = document.querySelector('#currentTime');

// function to get nyt section for select form
const getNytSection = (data) => {
    // console.log(data);
    let output = '<option value="">Select a Section</option>';
    for (let i = 1; i < data.results.length; i++) {
        output += `<option value="${data.results[i].section}">${data.results[i].display_name}</option>`;
    }
    document.querySelector("[data-article-section]").innerHTML = output;
};

// function to get selected article from select form
const getSelectedSectionArticle = (data) => {
    // console.log(data);
    for (let i = 0; i < 7; i++) {
        // check if there is image || title || abstract
        if (data.results[i].multimedia[2].url || data.results[i].title || data.results[i.abstract]) {
            let newsTitle = document.querySelector('#newsTitle-' + i);
            newsTitle.href = data.results[i].url;
            newsTitle.innerText = data.results[i].title;

            // document.querySelector('.titleSection-' + i).innerText = data.results[i].section;
            document.querySelector('.titleSection-' + i).classList.add('d-none');
            let img = document.querySelector('#img-' + i);
            img.src = data.results[i].multimedia[2].url;
            img.alt = (data.results[i].multimedia[2].caption > 100 ? data.results[i].multimedia[2].caption : data.results[i].title);

            let abstract = document.querySelector('#abstract-' + i);
            (data.results[i].abstract.length > 150 ? abstract.innerText = data.results[i].abstract.substring(0, 100) + '...' : abstract.innerText = data.results[i].abstract);
            date.classList.add('d-none');
            document.querySelector('#sectionTitle').innerHTML = `<h1>${data.results[i].section}</h1>`;
        }
    };

    let output = '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-3">';
    for (let i = 7; i < data.results.length; i++) {
        output += `<div class="col mb-3">
                        <div class="card h-100"> 
                            <img src="${(data.results[i].multimedia[2].url ? data.results[i].multimedia[2].url : '')}" class="card-img-top" alt="${(data.results[i].multimedia[1].caption > 100 ? data.results[i].multimedia[1].caption : data.results[i].title)}"> 
                            <span class="text-secondary text-center"><small>${data.results[i].multimedia[2].copyright}</small></span>
                            <div class="card-body">
                                <a href='${data.results[i].url}'>
                                    <h5 class="card-title fw-bold">${data.results[i].title}</h5>
                                </a>
                                <p class="card-text">${data.results[i].abstract}</p>
                            </div>
                        </div>
                    </div>`;
    }
    output += '</div>';
    dataArticle.innerHTML = output;
};

// display current date
const displayDate = () => {
    let currentDate = new Date().toLocaleDateString('en-us', { month: 'long', day: '2-digit', year: 'numeric', weekday: 'long' });
    date.innerHTML = `<p class="fs-5">${currentDate}</p>`;
};

// function to get top articles for home page
const getTopStoriesHome = (data) => {
    // show article in the main
    for (let i = 0; i < 7; i++) {
        // console.log(data.results[i].section);
        let newsTitle = document.querySelector('#newsTitle-' + i);
        newsTitle.href = data.results[i].url;
        newsTitle.innerText = data.results[i].title;

        document.querySelector('.titleSection-' + i).innerText = data.results[i].section.toUpperCase();
        let img = document.querySelector('#img-' + i);
        img.src = data.results[i].multimedia[0].url;
        img.alt = (data.results[i].multimedia[0].caption > 100 ? data.results[i].multimedia[0].caption : data.results[i].title);
        document.querySelector('#copyright-' + i).innerText = data.results[i].multimedia[0].copyright;
        let abstract = document.querySelector('#abstract-' + i);
        (data.results[i].abstract.length > 150 ? abstract.innerText = data.results[i].abstract.substring(0, 100) + '...' : abstract.innerText = data.results[i].abstract);
    };

    // show article in card
    let output = '<div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-3">';
    for (let i = 7; i < data.results.length; i++) {
        output += `<div class="col mb-3">
                        <div class="card h-100">
                            <img src="${data.results[i].multimedia[1].url}" class="card-img-top" alt="${(data.results[i].multimedia[0].caption > 100 ? data.results[i].multimedia[0].caption : data.results[i].title)}">
                            <span class="text-secondary text-center"><small>${data.results[i].multimedia[1].copyright}</small></span>
                            <div class="card-body">
                            <a href='${data.results[i].url}'>
                                <h5 class="card-title fw-bold">${data.results[i].title}</h5>
                            </a>
                            <p class="card-text">${data.results[i].abstract}</p>
                            </div>
                            <div class="card-footer">
                                <small class="text-body-secondary">${data.results[i].byline}</small>
                            </div>
                        </div>
                    </div>`;
    }
    output += '</div>';
    dataArticle.innerHTML = output;
};

// set valuable for api key
api_key = 'Nl1D97fits0uHLJl0YsJ2mWL4UL1Bv5J';

let url = `https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=${api_key}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        getNytSection(data);
    });

articleSection.addEventListener('change', (e) => {

    let section = e.target.value;

    articleUrl = `https://api.nytimes.com/svc/news/v3/content/all/${section}.json?api-key=${api_key}`;
    fetch(articleUrl)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            getSelectedSectionArticle(data);
        });
});

homeUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${api_key}`;
fetch(homeUrl)
    .then(Response => Response.json())
    .then(data => {
        // console.log(data);

        getTopStoriesHome(data);
    });

displayDate();
