const getTodayDate = (dateTime = '') => {
    try {
        if (dateTime != '') {
            let dateThings = dateTime.split(' ');
            dateThings[1] = dateThings[1].slice(0, -1);
            dateThings[0] = MONTHS.indexOf(dateThings[0]) + 1;
            dateThings = `${dateThings[2]}-${dateThings[0]}-${dateThings[1]}`
            return [dateTime, dateThings];
        }
    }
    catch { }
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let monthName = MONTHS[month - 1];
    let year = date.getFullYear();

    let dateInWords = `${monthName} ${day}, ${year}`;
    let dateInNum = `${year}-${month}-${day}`;
    return [dateInWords, dateInNum];
}

const createNewNoteForm = () => {
    let form = document.createElement('form');
    form.id = 'noteForm';
    form.onsubmit = 'return false;';

    let formHeader = document.createElement('header');
    formHeader.className = 'noteHeader';

    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'noteHeading';
    titleInput.id = 'formNoteHeading';
    titleInput.placeholder = 'Title';
    titleInput.tabIndex = 1;

    formHeader.append(titleInput);

    let noteContent = document.createElement('textarea');
    noteContent.name = 'noteContent';
    noteContent.id = 'formNoteContent';
    noteContent.placeholder = 'Note text here...';
    noteContent.tabIndex = 2;

    const saveNoteBtnFunc = (e = null) => {
        saveNote(titleInput.value, noteContent.value, getTodayDate()[0]);
        try {
            e.preventDefault();
        } catch { }
    }
    const cancelNoteBtnFunc = (e) => {
        closeNote();
        e.preventDefault();
    }

    for (const imgName of [{ name: './ok.svg', alt: 'save note', func: saveNoteBtnFunc }, { name: './delete.svg', alt: 'cancel note', func: cancelNoteBtnFunc }]) {
        let btn = document.createElement('button');
        let img = document.createElement('img');
        img.src = imgName.name;
        img.alt = imgName.alt;
        img.className = 'icon';
        btn.append(img);
        btn.onclick = imgName.func;
        formHeader.append(btn);
    }

    form.append(formHeader)

    form.append(noteContent);

    form.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.ctrlKey && keyEvent.shiftKey && keyEvent.key == 'S') {
            formHeader.children[1].click();
        }
    })

    notesSection.textContent = '';
    notesSection.append(form);

    return [titleInput, noteContent, formHeader.children[1], formHeader.children[2]];
}

const createNoteSection = (notes, date) => {
    let article = document.createElement('article');
    article.className = 'dateNote';
    article.id = date[0];

    let articleHeader = document.createElement('header');
    articleHeader.className = 'notesHeader';
    let timeLabel = document.createElement('img');
    timeLabel.src = './label.svg';
    timeLabel.alt = 'on date';
    timeLabel.className = 'icon';

    let timeHeading = document.createElement('time');
    timeHeading.dateTime = date[1];
    timeHeading.textContent = date[0];
    timeHeading.className = 'noteTime';

    let timeLine = document.createElement('div');
    timeLine.className = 'line';

    let articleSection = document.createElement('section');
    articleSection.className = 'notes';

    for (const data in notes) {
        let div = document.createElement('div');
        div.className = 'noteContainer';
        let note = createNote(notes[data], data, article.id);
        div.append(note);
        articleSection.prepend(div);
    }

    articleHeader.append(timeLabel);
    articleHeader.append(timeHeading);
    articleHeader.append(timeLine);
    article.append(articleHeader);
    article.append(articleSection);
    notesSection.prepend(article);
}

const addNoteInLocalStorage = (note) => {
    let date = getTodayDate()[0];
    if (localStorage.getItem(date) != null) {
        let data = JSON.parse(localStorage.getItem(date));
        let length = Object.keys(data).length;
        let newNote = {};
        newNote[length] = note;
        data = Object.assign(newNote, data);
        localStorage.setItem(date, JSON.stringify(data));
    }
    else {
        localStorage.setItem(date, JSON.stringify({ 0: note }));
    }
}

const createNoNoteDiv = () => {
    let div = document.createElement('div');
    div.id = 'noNoteAvailable';
    div.textContent = 'No Notes Found.';

    notesSection.textContent = '';
    notesSection.append(div);
}

const createTimeNotes = () => {
    let length = localStorage.length;
    let num = 0;
    if (!length) {
        createNoNoteDiv();
        return;
    }
    let bopbop = setInterval((i = num) => {
        if (num >= 4 || num >= length) {
            clearInterval(bopbop);
            // localStorage.clear()
        }
        else {
            let date = localStorage.key(i);
            createNoteSection(JSON.parse(localStorage.getItem(date)), getTodayDate(date));
            num++;
        }
    }, 0)
}

const saveNote = (title, text, date) => {
    if (title.trim() == '') {
        closeNote();
        return;
    }
    if (text.trim() == '') {
        text = 'Nothing Here...'
    }
    let notes = localStorage.getItem(date);
    if (notes == null) {
        notes = '{}';
    }
    notes = JSON.parse(notes);
    let length = Object.keys(notes).length;
    let _ = { 'title': title, 'text': text };
    let note = {}
    note[length] = _;
    notes = Object.assign(note, notes);
    notes = JSON.stringify(notes);
    localStorage.setItem(date, notes);
    newNoteBtn.click();
}

const closeNote = () => {
    newNoteBtn.innerText = 'New Note';
    scrollTop()
    notesSection.textContent = '';
    createTimeNotes();
}


const createNote = (data, noteNumber, date) => {
    let note = document.createElement('article');
    note.className = 'note';
    note.dataset.number = 1;

    let noteHeader = document.createElement('header');
    noteHeader.className = 'noteHeader';

    let noteHeading = document.createElement('h3');
    noteHeading.textContent = data.title;

    let noteOptions = document.createElement('ul');
    noteOptions.className = 'noteOptions';

    for (const imgName of [{ name: 'edit.svg', alt: 'edit note', func: editNoteBtn }, { name: 'trash.svg', alt: 'delete note', func: deleteNoteBtn }]) {
        let btn = document.createElement('button')
        let imgIcon = document.createElement('img');
        imgIcon.className = 'icon';
        imgIcon.src = imgName.name;
        imgIcon.alt = imgName.alt;
        btn.append(imgIcon);
        btn.dataset.number = noteNumber;
        imgIcon.dataset.number = noteNumber;
        btn.dataset.date = date;
        imgIcon.dataset.date = date;
        btn.onclick = (e) => { imgName.func(e) };
        noteOptions.append(btn);
    }

    let noteContent = document.createElement('p');
    noteContent.className = 'noteContent';
    noteContent.innerText = data.text;

    // let copyBtn = document.createElement('btn');

    noteHeader.append(noteHeading);
    noteHeader.append(noteOptions);

    note.append(noteHeader);
    note.append(noteContent);

    return note;
}

const deleteNoteBtn = (e) => {
    let index = e.target.dataset.number;
    let date = e.target.dataset.date;
    let notes = JSON.parse(localStorage.getItem(date));
    delete notes[index];
    index = 0;
    let newNotes = {};
    for (const num in notes) {
        newNotes[index] = notes[num];
        index += 1;
    }
    if (!index) {
        localStorage.removeItem(date);
    }
    else {
        newNotes = JSON.stringify(newNotes);
        localStorage.setItem(date, newNotes);
    }
    notesSection.textContent = '';
    createTimeNotes();
}

const editNoteBtn = (e) => {
    let index = e.target.dataset.number;
    let date = e.target.dataset.date;
    let notes = JSON.parse(localStorage.getItem(date));
    let data = notes[index];
    let [titleInput, noteContent, btns] = editNote(data.title, data.text);
    btns[0].onclick = (e) => {
        e.preventDefault();
        let newTitle = titleInput.value;
        let newText = noteContent.value;
        notes[index] = { title: newTitle, text: newText };
        notes = JSON.stringify(notes);
        localStorage.setItem(date, notes);
        notesSection.textContent = '';
        createTimeNotes();
    }
    btns[1].onclick = (e) => {
        e.preventDefault();
        closeNote();
    }
}

const editNote = (title, text) => {
    scrollTop();
    let [titleInput, noteContent, ...btns] = createNewNoteForm();
    titleInput.value = title;
    noteContent.value = text;
    titleInput.focus()
    return [titleInput, noteContent, btns];
}

const scrollTop = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}