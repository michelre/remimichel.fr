import 'zenscroll';
import Quill from 'quill';
import axios from 'axios';

const sections = Array.from(document.querySelectorAll('.menu li > a')).map(d => {
  const anchor = d.getAttribute('href');
  return {anchor, element: document.querySelector(anchor)};
});
let editor = null;
let timerScroll = null;
window.addEventListener('scroll', (e) => {
  if (timerScroll !== null) {
    clearTimeout(timerScroll);
  }
  timerScroll = setTimeout(() => {
    scrollEndAction();
  }, 100)
});

window.addEventListener('load', () => {
  scrollEndAction();
  initQuill();
});

function initQuill() {
  const toolbarOptions = [
    ['bold', 'italic', 'underline'],
    ['blockquote', 'code-block'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'align': []}]
  ];
  const options = {
    modules: {toolbar: toolbarOptions},
    placeholder: 'Votre message...',
    theme: 'snow'
  };
  editor = new Quill('#editor', options);
}

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

const form = document.querySelector('.contact-form form');
const sendButton = document.querySelector('.contact-form form button');

sendButton.addEventListener('click', (e) => {
  let formData = Object.assign({}, getInputsData(), getEditorData());
  sendAction(formData)
    .then(resp => console.log(resp))
    .catch(err => console.log(err));
  e.preventDefault();
});

const sendAction = (formData) => {
  return axios.post('/api/send-mail', formData)
}

const getEditorData = () => {
  return {content: editor.container.firstChild.innerHTML};
};

const getInputsData = () => {
  const fields = getInputFields();
  return fields.reduce((acc, curr) => Object.assign({}, acc, {[curr]: form.elements[curr].value}), {});
};

const getInputFields = () => {
  const inputs = Array.from(document.querySelectorAll('.contact-form form input'));
  const fields = inputs.reduce((acc, curr) => acc.concat(curr.getAttribute('name')), []);
  return fields.filter(x => x);
};