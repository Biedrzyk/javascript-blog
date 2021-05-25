const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagWithLinks: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
}

'use strict';

/*document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });*/

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('article');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle', targetArticle);


  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
  console.log(targetArticle);

};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = 'authors.list';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';


  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log('funkcja customSelector', customSelector);
  console.log('funkcja articles', articles);
  console.log('funkcja optArticleSelector', optArticleSelector);
  let html = '';

  for (let article of articles) {

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /*const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';*/
    console.log(linkHTML);

    /* insert link into titleList */

    html = html + linkHTML;
    /*html.insertAdjacentHTML('afterbegin', linkHTML)*/

    console.log(html);
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {

  const params = { max: 0, min: 999999 };

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params) {

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  /* START LOOP: for every article: */

  for (let article of articles) {

    /* find tags wrapper */

    const titleList = article.querySelector(optArticleTagsSelector);
    console.log(titleList);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {
      console.log('Generate tags:', tag);
      /* generate HTML of the link */

      const tagHTMLData = {id: tag, title: tag};
      const tagHTML = templates.tagWithLink(tagHTMLData);


      /*const tagLinkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';*/
      console.log(tagLinkHTML);

      /* add generated code to html variable */

      html = html + tagLinkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      }
      else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    titleList.innerHTML = html;
    console.log(titleList);


    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  console.log('tagList: ', tagList);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */

    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    console.log('tagLinkHTML:', tagLinkHTML);

    allTagsHTML += '<li><a class="' + tagLinkHTML + '" href="#tag-' + tag + '"><span>' + tag + '</a>' + '</span></li>';
    console.log('allTagsHTML: ', allTagsHTML);

  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  console.log('Tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */

  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log('activeTags:', activeTags);

  /* START LOOP: for each active tag link */

  let html = '';
  console.log(html);

  for (let activeTag of activeTags) {

    /* remove class active */
    activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each found tag link */

  for (let tagLink of tagLinks) {

    /* add class active */
    tagLink.classList.add('active');
    console.log('TagLinks is ', tagLinks);
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  console.log('tagLinks', tagLinks);
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {

  let allAuthors = {};

  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    let html = '';

    const articleAuthor = article.getAttribute('data-author');
    console.log('articleAuthor', articleAuthor);


    const authorLinkHTML = '<li><a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';

    console.log('authorLinkHTML', authorLinkHTML);

    html = html + authorLinkHTML;

    if (!allAuthors[articleAuthor]) {
      allAuthors[articleAuthor] = 1
    }
    else {
      allAuthors[articleAuthor]++
    }
    console.log('allAuthors: ', allAuthors);

    authorWrapper.innerHTML = html;
    console.log(authorWrapper.innerHTML);

  }

  const authorList = document.querySelector('.authors');
  console.log('authorList: ', authorList);

  let allAuthorsHTML = '';

  for (let author in allAuthors) {

    allAuthorsHTML += '<li><a href="#author-' + author + '"><span>' + author + '</a>' + '</span></li>';
    console.log('allAuthorsHTML: ', JSON.stringify(allAuthorsHTML));
  }
authorList.innerHTML = allAuthorsHTML;
}

generateAuthors();

const authorClickHandler = function (event) {

  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');
  console.log('href:', href);

  const author = href.replace('#author-', '');
  console.log('author:', author);

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#article-"]');
  console.log('activeAuthorLinks:', activeAuthorLinks);

  if (activeAuthorLinks) {

    for (let activeAuthor of activeAuthorLinks) {

      activeAuthor.classList.remove('active');

    }
  }

  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let author of authorLinks) {

    author.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');

};

const addClickListenersToAuthors = function () {

  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let author of authorLinks) {

    author.addEventListener('click', authorClickHandler);

  }

};

addClickListenersToAuthors();