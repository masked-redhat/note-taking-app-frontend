clearAllNotesBtn.onclick = () => {
    let userAction = confirm("Do you really want to clear all your notes?");
    if (userAction) {
        localStorage.clear();
    };
    createTimeNotes();
}

newNoteBtn.onclick = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if (newNoteBtn.innerText == 'New Note') {
        newNoteBtn.innerText = 'Show All Notes';
        createNewNoteForm();
        document.getElementById('formNoteHeading').focus()
        clearAllNotesBtn.disabled = true;
    }
    else {
        newNoteBtn.innerText = 'New Note';
        notesSection.textContent = '';
        createTimeNotes()
        clearAllNotesBtn.disabled = false;
    }
};

let note = {
    title: "Hello adfasdfasdfthis is a message",
    text: "klfdjaldfja sdfas dflkasj dflasj fjaskdfl jasldfk aslkdf las jflasj fd"
}


addNoteInLocalStorage(note);
addNoteInLocalStorage(note);
addNoteInLocalStorage(note);



createTimeNotes();