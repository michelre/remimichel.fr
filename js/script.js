const sections = Array.from(document.querySelectorAll('.menu li > a')).map(d => {
  const anchor = d.getAttribute('href');
  return {anchor, element: document.querySelector(anchor)};
});

let timerScroll = null;
window.addEventListener('scroll', (e) => {
  if(timerScroll !== null){
    clearTimeout(timerScroll);
  }
  timerScroll = setTimeout(() => {
    scrollEndAction();
  }, 100)
});

window.addEventListener('load', () => {
  scrollEndAction();
});

function scrollEndAction() {
  const currentPosition = document.documentElement.scrollTop;
  const currentSection = sections.find(({element}) => element.offsetTop >= currentPosition) || sections[sections.length - 1];
  Array.from(document.querySelectorAll('.menu a')).map(e => {
    e.style.color = '#ABABAD';
    e.querySelector('span').style.width = '20px';
  });
  document.querySelector(`.menu a[href="${currentSection.anchor}"]`).style.color = 'black';
  document.querySelector(`.menu a[href="${currentSection.anchor}"] > span`).style.width = '40px';
  history.replaceState(undefined, undefined, currentSection.anchor)
}