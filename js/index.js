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
  const currentSectionIndex = getNearestSectionIndex(currentPosition, sections.map(({ element }) => element.offsetTop));
  const currentSection = sections[currentSectionIndex];
  displayCurrentItemMenu(currentSection);
  history.replaceState(undefined, undefined, currentSection.anchor)
}

const form = document.querySelector('.contact-form form');
const sendButton = document.querySelector('.contact-form form button');

sendButton.addEventListener('click', (e) => {
  let formData = Object.assign({}, getInputsData(), getEditorData());
  changeSendButtonText(true);
  sendAction(formData)
    .then(resp => {
      changeSendButtonText(false);
      showAlert(true);
    })
    .catch(err => {
      changeSendButtonText(false);
      showAlert(false);
    });
  e.preventDefault();
});

const getNearestSectionIndex = (currentPosition, sectionPositions) => {
  const deltaPositions = sectionPositions.map((position, idx) => ({ delta: Math.abs(currentPosition - position), idx }));
  const sortedPositions = deltaPositions.sort((a, b) => a.delta - b.delta)
  return sortedPositions[0].idx;
};

const displayCurrentItemMenu = (currentSection) => {
  Array.from(document.querySelectorAll('.menu a')).map(e => {
    e.style.color = 'black';
  });
  document.querySelector(`.menu a[href="${currentSection.anchor}"]`).style.color = '#92A1E2';
};

const sendAction = (formData) => {
  return axios.post('/api/send-mail', formData);
};

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

const changeSendButtonText = (isSending) => {
  const sendBtn = document.querySelector('.btn-send');
  if(isSending){
    sendBtn.textContent = 'Envoie en cours...';
  } else {
    sendBtn.textContent = 'Envoyer';
  }
}

const showAlert = (isSucceeded) => {
  const alert = document.querySelector('.alert');
  const alertMsg = (isSucceeded) ? document.querySelector('.alert-success') : document.querySelector('.alert-error');
  alert.style.display = 'block';
  alertMsg.style.display = 'flex';
  setTimeout(() => {
    alert.style.display = 'none';
    alertMsg.style.display = 'none';
  }, 3000)
};
