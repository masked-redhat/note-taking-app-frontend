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


createTimeNotes();