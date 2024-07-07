/* script.js */
const articleSection = document.getElementById('article-section');
const result = document.querySelector('#article');
const dataArticle = document.querySelector('[data-article]');
const date = document.querySelector('#currentTime');

// function to get nyt section for select form
const getNytSection = (data) => {
    // console.log(data);
    const options = data.results.slice(1).map(result =>
        `<option value="${result.section}">${result.display_name}</option>`
    );
    document.querySelector("[data-article-section]").innerHTML = '<option value="#">Top News</option>' + options.join('');
};

// function to get selected article from select form
const getSelectedSectionArticle = (data) => {
    const sectionTitle = document.getElementById('sectionTitle');
    sectionTitle.innerHTML = `<h1>${data.results[0].section}</h1>`;
    // new way
    data.results.slice(0, 7).forEach((result, i) => {
        // console.log(result)
        if (result.multimedia?.[2]?.url || result.title || result.abstract) {
            const newsTitle = document.querySelector(`#newsTitle-${i}`);
            newsTitle.href = result.url;
            newsTitle.innerHTML = result.title;

            const img = document.querySelector(`#img-${i}`);
            img.src = result.multimedia[2].url;
            img.alt = result.multimedia[2].caption.length > 100 ? result.multimedia[2].caption : result.title;

            const abstract = document.querySelector(`#abstract-${i}`);
            abstract.innerHTML = result.abstract.length > 100 ? `${result.abstract.substring(0, 80)}...` : result.abstract;
        }
    });

    // to create article cards
    const createArticleCard = (article) => `
    <div class="col mb-3">
        <div class="card h-100">
            <img src="${article.multimedia[2]?.url || ''}" class="card-img-top" alt="${article.multimedia[1]?.caption?.length > 100 ? article.multimedia[1].caption : article.title}">
            <span class="text-secondary text-center"><small>${article.multimedia[2]?.copyright || ''}</small></span>
            <div class="card-body">
                <a href='${article.url}'>
                    <h5 class="card-title fw-bold">${article.title}</h5>
                </a>
                <p class="card-text">${article.abstract}</p>
            </div>
        </div>
    </div>
    `;

    const generateArticleGrid = (data) => {
        const articleCards = data.results.slice(7).map(createArticleCard).join('');
        return `
        <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-3">
            ${articleCards}
        </div>
        `;
    };
    dataArticle.innerHTML = generateArticleGrid(data);
};

// display current date
const displayDate = () => {
    let currentDate = new Date().toLocaleDateString('en-us', { month: 'long', day: '2-digit', year: 'numeric', weekday: 'long' });
    date.innerHTML = `<p class="fs-5">${currentDate}</p>`;
};

const truncateText = (text, maxLength) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// function to get top articles for home page
const getTopStoriesHome = (data) => {
    // console.log(data.results[0].section)
    // show article in the main
    data.results.slice(0, 7).forEach((result, i) => {
        const newsTitle = document.querySelector(`#newsTitle-${i}`);
        newsTitle.href = result.url;
        newsTitle.innerHTML = result.title;

        const titleSection = document.querySelector(`.titleSection-${i}`);
        titleSection.innerHTML = result.section;

        const img = document.querySelector(`#img-${i}`);
        img.src = result.multimedia[0].url;
        img.alt = result.multimedia[0].caption.length > 100 ? result.multimedia[0].caption : result.title;

        const copyright = document.querySelector(`#copyright-${i}`);
        copyright.innerHTML = result.multimedia[0].copyright;
        // console.log(copyright);

        const abstract = document.querySelector(`#abstract-${i}`);
        abstract.innerHTML = truncateText(result.abstract, 70);
        console.log(truncateText(result.abstract, 70));

    });

    // to create article cards
    const createArticleCard = (article) => `
    <div class="col mb-3">
        <div class="card h-100">
            <img src="${article.multimedia[1].url}" class="card-img-top" alt="${article.multimedia[0]?.caption?.length > 100 ? article.multimedia[1].caption : article.title}">
            <span class="text-secondary text-center"><small>${article.multimedia[2]?.copyright || ''}</small></span>
            <div class="card-body">
                <a href='${article.url}'>
                    <h5 class="card-title fw-bold">${article.title}</h5>
                </a>
                <p class="card-text">${article.abstract}</p>
            </div>
            <div class="card-footer">
            <small class="text-body-secondary">${article.byline}</small>
            </div>
        </div>
    </div>
    `;
    const generateArticleGrid = (data) => {
        const articleCards = data.results.slice(7).map(createArticleCard).join('');
        return `
        <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-3">
            ${articleCards}
        </div>
        `;
    };
    dataArticle.innerHTML = generateArticleGrid(data);
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

articleSection.addEventListener('change', e => {

    const section = e.target.value;

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
